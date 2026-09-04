"use client";
import React, { useEffect, useState } from "react";
import Container from "../Container";
import { App, Button, Form, Input, Radio, Select } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IUser, registerUser, SignupPayload } from "@/redux/action/auth";
import { loginAction, setUser } from "@/redux/reducer/auth/auth";
import { createErrorMessage } from "@/utils/errorInstance";
import { getSafeRedirect } from "@/utils/safeRedirect";
import { useAppDispatch, useAppSelector } from "@/hook";
import {
  countries,
  countryCodes,
  jobTitles,
  normalizePhoneNumber,
  stateOptions,
} from "@/constants/nigeriaLocations";
import { Account, AccountType, createAccount } from "@/services/account";
import { getTeamInvitation, TeamInvitation } from "@/services/invitation";
import {
  extractPricingPlans,
  formatPlanPrice,
  getPricing,
  matchPricingPlan,
  PricingPlan,
} from "@/services/pricing";
import { requestFreeTrial } from "@/services/trial";
import { setProfileExtras, setStoredAccount } from "@/utils/accountStorage";
import { applySubscriptionToUser } from "@/utils/subscription";

const FormItem = Form.Item;

const Signup = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = getSafeRedirect(searchParams.get("next"));
  const inviteToken =
    searchParams.get("invite_token") || searchParams.get("token");
  const requestedPlan = searchParams.get("plan");
  const requestedAccountType = searchParams.get("account_type") as
    | AccountType
    | null;
  const requestedSeats = searchParams.get("max_seat");
  const startTrial = requestedPlan === "free";
  const { modal } = App.useApp();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [invitation, setInvitation] = useState<TeamInvitation | null>(null);
  const [inviteLoading, setInviteLoading] = useState(Boolean(inviteToken));
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const accountType: AccountType =
    Form.useWatch("account_type", form) || "INDIVIDUAL";
  const selectedSeats: number | undefined = Form.useWatch("max_seat", form);
  const teamPlans = pricingPlans
    .filter((plan) => plan.account_type === "TEAM")
    .sort((a, b) => a.max_seat - b.max_seat);
  const selectedPlan = matchPricingPlan(
    pricingPlans,
    accountType,
    accountType === "INDIVIDUAL" ? undefined : selectedSeats
  );

  useEffect(() => {
    getPricing()
      .then((res) => {
        const plans = extractPricingPlans(res.data);
        setPricingPlans(plans);
        const preferredType = requestedAccountType || "TEAM";
        const preferredSeats = requestedSeats
          ? Number(requestedSeats)
          : undefined;
        const defaultTeam = matchPricingPlan(
          plans,
          preferredType,
          preferredSeats
        );
        if (defaultTeam) {
          form.setFieldValue("max_seat", defaultTeam.max_seat);
        }
        if (requestedAccountType) {
          form.setFieldValue("account_type", requestedAccountType);
        }
      })
      .catch(() => {
        // Signup can continue; payment page will retry pricing later.
      });
  }, [form, requestedAccountType, requestedSeats]);

  useEffect(() => {
    if (isAuthenticated && !inviteToken) {
      router.replace(next);
    }
    // Only redirect people who arrive already signed in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!inviteToken) return;

    setInviteLoading(true);
    getTeamInvitation(inviteToken)
      .then((res) => {
        if (res.data.status !== "valid" || !res.data.invitation) {
          modal.error({
            title: "Invalid invitation",
            content:
              res.data.error ||
              "This invitation is no longer valid. Please request a new one.",
          });
          return;
        }

        const invite = res.data.invitation;
        setInvitation(invite);
        form.setFieldsValue({
          email: invite.email,
          workplace_name: invite.account_name,
          address_line_1: invite.address,
          state: invite.state,
          country: invite.country,
        });
      })
      .catch((err) => {
        modal.error({
          title: "Unable to load invitation",
          content: err?.response
            ? createErrorMessage(err.response.data)
            : err.message,
        });
      })
      .finally(() => setInviteLoading(false));
  }, [inviteToken, form, modal]);

  const autofillFromAccount = () => {
    const values = form.getFieldsValue();
    form.setFieldsValue({
      workplace_name: values.account_name || values.workplace_name,
      address_line_1: values.account_address,
      state: values.account_state,
      country: values.account_country,
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const {
        account_name,
        account_type,
        max_seat,
        account_address,
        account_state,
        account_country,
        confirm_password,
        ...userFields
      } = values;

      let accountId = invitation?.account_id;
      let createdAccount: Account | null = invitation
        ? {
            id: invitation.account_id,
            name: invitation.account_name,
            account_type: "TEAM",
            max_seat: 2,
            address: invitation.address,
            state: invitation.state,
            country: invitation.country,
          }
        : null;

      if (!accountId) {
        if (account_type === "TEAM" && !Number(max_seat)) {
          modal.error({
            title: "Select seats",
            content:
              "Choose a team size from the available plans before continuing.",
          });
          return;
        }
        const accountName =
          account_name ||
          `${userFields.first_name} ${userFields.last_name}`.trim();
        const accountRes = await createAccount({
          name: accountName,
          account_type,
          max_seat: account_type === "INDIVIDUAL" ? 1 : Number(max_seat),
          address: account_address,
          state: account_state,
          country: account_country,
        });
        createdAccount = accountRes.data.account;
        accountId = createdAccount.id;
      }

      if (createdAccount) {
        setStoredAccount(createdAccount);
      }

      const payload: SignupPayload = {
        first_name: userFields.first_name,
        last_name: userFields.last_name,
        username: userFields.username,
        email: userFields.email,
        password: userFields.password,
        phone_number: normalizePhoneNumber(
          userFields.phone_number,
          userFields.country_code
        ),
        country_code: userFields.country_code,
        job_title: userFields.job_title,
        workplace_name: userFields.workplace_name,
        address_line_1: userFields.address_line_1,
        address_line_2: userFields.address_line_2 || undefined,
        local_government_area: userFields.local_government_area,
        state: userFields.state,
        country: userFields.country,
        account_id: accountId as number,
        invite_token: inviteToken || undefined,
      };

      const res = await registerUser(payload);
      if (res.status === 200 || res.status === 201) {
        const { user, tokens } = res.data;
        setProfileExtras({
          phone_number: payload.phone_number,
          country_code: payload.country_code,
          address_line_1: payload.address_line_1,
          address_line_2: payload.address_line_2,
          local_government_area: payload.local_government_area,
          state: payload.state,
          country: payload.country,
          job_title: payload.job_title,
          workplace_name: payload.workplace_name,
        });
        let signedInUser: IUser = {
          ...user,
          account_details: user.account_details ||
            (createdAccount
              ? {
                  account_id: createdAccount.id,
                  role: "ADMIN",
                  max_seat: createdAccount.max_seat,
                  subscription_valid_to: null,
                }
              : undefined),
        };

        await dispatch(
          loginAction({
            token: tokens,
            user: signedInUser,
          })
        );

        if (!inviteToken && startTrial) {
          try {
            const result = await requestFreeTrial();
            if (result.expiry) {
              signedInUser = applySubscriptionToUser(
                signedInUser,
                result.expiry
              );
              dispatch(setUser(signedInUser));
            }
            if (!result.activated) {
              modal.warning({
                title: "Account created",
                content: result.message,
              });
            }
          } catch (trialErr: unknown) {
            const error = trialErr as {
              response?: { data?: unknown };
              message?: string;
            };
            modal.warning({
              title: "Account created",
              content: error?.response
                ? createErrorMessage(error.response.data)
                : "Your account was created, but the free trial could not be started. You can start it from the pricing page.",
            });
          }
        }

        if (inviteToken) {
          router.push(next);
        } else if (startTrial) {
          router.push(
            createdAccount?.account_type === "TEAM"
              ? "/invite-team"
              : "/dermatology"
          );
        } else if (next === "/payment" || next.startsWith("/payment")) {
          router.push("/payment");
        } else if (createdAccount?.account_type === "TEAM") {
          router.push("/invite-team");
        } else {
          router.push(next);
        }
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown }; message?: string };
      if (error?.response || error?.message) {
        modal.error({
          title: "Error",
          content: error?.response
            ? createErrorMessage(error.response.data)
            : error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container skipAuthRedirect>
      <div className="w-full">
        <p className="text-center text-xl font-semibold text-[#121212] sm:text-2xl lg:text-[28px]">
          Sign Up with Email
        </p>
        <p className="mt-1 text-center text-sm text-[#4F4F4F] sm:text-base">
          {invitation
            ? `Join ${invitation.account_name} to start contributing`
            : startTrial
              ? "Create your account to start the free trial"
              : "Create your account to save and record clinical contributions"}
        </p>

        {invitation && (
          <div className="mt-4 rounded-2xl bg-[#F7F7F8] px-4 py-3 text-sm text-[#4F4F4F]">
            You were invited by {invitation.invited_by} as a{" "}
            <span className="font-semibold text-[#121212]">
              {invitation.role.toLowerCase()}
            </span>
            .
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            country_code: "234",
            country: "Nigeria",
            account_country: "Nigeria",
            account_type: requestedAccountType || "INDIVIDUAL",
          }}
        >
          {!invitation && (
            <>
              <p className="mt-4 mb-2 text-sm font-semibold text-[#121212]">
                Account details
              </p>

              <FormItem
                name="account_type"
                label="Account type"
                rules={[{ required: true, message: "Select account type" }]}
              >
                <Radio.Group className="flex gap-4">
                  <Radio value="INDIVIDUAL">Individual</Radio>
                  <Radio value="TEAM">Team</Radio>
                </Radio.Group>
              </FormItem>

              <FormItem
                name="account_name"
                label={
                  accountType === "TEAM"
                    ? "Organization / hospital name"
                    : "Account name"
                }
                rules={[{ required: true, message: "Enter account name" }]}
              >
                <Input
                  className="h-11!"
                  placeholder={
                    accountType === "TEAM"
                      ? "Enter hospital or organization name"
                      : "Your full name or practice name"
                  }
                />
              </FormItem>

              {accountType === "TEAM" && (
                <FormItem
                  name="max_seat"
                  label="Maximum seats"
                  rules={[{ required: true, message: "Select the number of seats" }]}
                  extra={
                    selectedPlan
                      ? `${formatPlanPrice(selectedPlan.price, selectedPlan.currency)} / ${selectedPlan.subscription_duration}`
                      : "Seat options load from current pricing."
                  }
                >
                  <Select
                    placeholder="Select seats"
                    options={teamPlans.map((plan) => ({
                      value: plan.max_seat,
                      label: `${plan.max_seat} seats · ${formatPlanPrice(plan.price, plan.currency)} / ${plan.subscription_duration}`,
                    }))}
                  />
                </FormItem>
              )}

              {accountType === "INDIVIDUAL" && selectedPlan && (
                <p className="mb-4 -mt-1 text-sm text-[#4F4F4F]">
                  Individual plan:{" "}
                  {formatPlanPrice(selectedPlan.price, selectedPlan.currency)} /{" "}
                  {selectedPlan.subscription_duration}
                </p>
              )}

              <FormItem
                name="account_address"
                label="Account address"
                rules={[{ required: true, message: "Enter account address" }]}
              >
                <Input
                  className="h-11!"
                  placeholder="Hospital / organization address"
                />
              </FormItem>

              <FormItem
                name="account_state"
                label="Account state"
                rules={[{ required: true, message: "Select state" }]}
              >
                <Select
                  showSearch
                  placeholder="Select state"
                  options={stateOptions}
                />
              </FormItem>

              <FormItem
                name="account_country"
                label="Account country"
                rules={[{ required: true, message: "Select country" }]}
              >
                <Select
                  showSearch
                  options={countries.map((c) => ({ value: c, label: c }))}
                />
              </FormItem>
            </>
          )}

          <p className="mt-4 mb-2 text-sm font-semibold text-[#121212]">
            Personal details
          </p>

          <FormItem
            name="first_name"
            label="First Name"
            rules={[{ required: true, message: "Please enter your first name" }]}
          >
            <Input className="h-11!" placeholder="Enter first name" />
          </FormItem>

          <FormItem
            name="last_name"
            label="Last Name"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input className="h-11!" placeholder="Enter last name" />
          </FormItem>

          <FormItem
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please choose a username" }]}
          >
            <Input className="h-11!" placeholder="Choose a unique username" />
          </FormItem>

          <FormItem
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              className="h-11!"
              placeholder="Enter email address"
              disabled={Boolean(invitation?.email)}
            />
          </FormItem>

          <FormItem
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter your password!" },
              {
                min: 8,
                message: "Password must be at least 8 characters long!",
              },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/,
                message: "Password must contain letters and numbers.",
              },
            ]}
            hasFeedback
          >
            <Input.Password className="h-11!" placeholder="Enter your password" />
          </FormItem>

          <FormItem
            name="confirm_password"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password className="h-11!" placeholder="Confirm password" />
          </FormItem>

          <div className="grid grid-cols-1 gap-0 md:grid-cols-[140px_1fr] md:gap-3">
            <FormItem
              name="country_code"
              label="Country code"
              rules={[{ required: true, message: "Select country code" }]}
            >
              <Select
                className="h-11!"
                options={countryCodes.map((c) => ({
                  value: c.code,
                  label: c.label,
                }))}
              />
            </FormItem>
            <FormItem
              name="phone_number"
              label="Phone number"
              rules={[{ required: true, message: "Enter phone number" }]}
              extra="For Nigerian numbers, omit the leading 0 (e.g. 8123458985)"
            >
              <Input className="h-11!" placeholder="8123458985" />
            </FormItem>
          </div>

          <FormItem
            name="job_title"
            label="Job title"
            rules={[{ required: true, message: "Select your job title" }]}
          >
            <Select
              showSearch
              placeholder="Select job title"
              optionFilterProp="label"
              options={jobTitles.map((title) => ({
                value: title,
                label: title,
              }))}
            />
          </FormItem>

          <div className="mt-4 mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#121212]">
              Workplace details
            </p>
            {!invitation && (
              <Button type="link" className="px-0!" onClick={autofillFromAccount}>
                Use account address
              </Button>
            )}
          </div>

          <FormItem
            name="workplace_name"
            label="Hospital / clinic name"
            rules={[{ required: true, message: "Enter workplace name" }]}
          >
            <Input className="h-11!" placeholder="Enter workplace name" />
          </FormItem>

          <FormItem
            name="address_line_1"
            label="Address line 1"
            rules={[{ required: true, message: "Enter address line 1" }]}
          >
            <Input className="h-11!" placeholder="Street address" />
          </FormItem>

          <FormItem name="address_line_2" label="Address line 2 (optional)">
            <Input className="h-11!" placeholder="Apartment, suite, etc." />
          </FormItem>

          <FormItem
            name="local_government_area"
            label="Local government area"
            rules={[{ required: true, message: "Enter local government area" }]}
          >
            <Input className="h-11!" placeholder="Enter LGA" />
          </FormItem>

          <FormItem
            name="state"
            label="State"
            rules={[{ required: true, message: "Select state" }]}
          >
            <Select
              showSearch
              placeholder="Select state"
              options={stateOptions}
            />
          </FormItem>

          <FormItem
            name="country"
            label="Country"
            rules={[{ required: true, message: "Select country" }]}
          >
            <Select
              showSearch
              options={countries.map((c) => ({ value: c, label: c }))}
            />
          </FormItem>

          <FormItem className="mt-4!">
            <Button
              type="primary"
              htmlType="submit"
              className="text-white text-lg! w-full rounded-[40px]! h-14!"
              loading={loading || inviteLoading}
              // disabled
            >
              Register
            </Button>
          </FormItem>

          <p className="text-center text-base">
            Already have an account?{" "}
            <Link
              href={
                inviteToken
                  ? `/auth/login?next=${encodeURIComponent(`/team-invitation/update?token=${inviteToken}`)}`
                  : startTrial
                    ? "/auth/login?next=/pricing"
                    : next === "/dermatology"
                    ? "/auth/login"
                    : `/auth/login?next=${encodeURIComponent(next)}`
              }
              className="text-[#121212]! font-semibold"
            >
              Sign in
            </Link>
          </p>
          <p className="mt-3 text-center text-sm text-[#4F4F4F]">
            Compare all plans, including the free trial, on the{" "}
            <Link href="/pricing" className="font-semibold text-[#121212]!">
              pricing page
            </Link>
            .
          </p>
        </Form>
      </div>
    </Container>
  );
};

export default Signup;
