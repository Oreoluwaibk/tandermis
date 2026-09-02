"use client";

import PageShell from "@/component/PageShell";
import { useAppDispatch, useAppSelector } from "@/hook";
import { login } from "@/redux/action/auth";
import { loginAction, setUser } from "@/redux/reducer/auth/auth";
import { Account } from "@/services/account";
import {
  getTeamInvitation,
  TeamInvitation,
  updateAccountMembership,
} from "@/services/invitation";
import { updateWorkplace } from "@/services/workplace";
import {
  getProfileExtras,
  setProfileExtras,
  setStoredAccount,
} from "@/utils/accountStorage";
import { createErrorMessage } from "@/utils/errorInstance";
import {
  clearPendingReauth,
  getPendingReauth,
} from "@/utils/pendingReauth";
import {
  countries,
  jobTitles,
  stateOptions,
} from "@/constants/nigeriaLocations";
import { App, Button, Form, Input, Select, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const FormItem = Form.Item;

const UpdateInviteDetailsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { modal } = App.useApp();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<TeamInvitation | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(
        `/auth/login?next=${encodeURIComponent(`/team-invitation/update?token=${token}`)}`
      );
    }
  }, [isAuthenticated, router, token]);

  useEffect(() => {
    if (!token) {
      setError("This invitation link is missing a token.");
      setLoading(false);
      return;
    }

    getTeamInvitation(token)
      .then((res) => {
        if (res.data.status !== "valid" || !res.data.invitation) {
          setError(
            res.data.error ||
              "This invitation link has expired. Please request an administrator to resend it."
          );
          return;
        }

        const invite = res.data.invitation;
        setInvitation(invite);
        const extras = getProfileExtras();
        form.setFieldsValue({
          job_title: user?.job_title || extras?.job_title || undefined,
          workplace_name:
            extras?.workplace_name || user?.workplace_name || invite.account_name,
          address_line_1: extras?.address_line_1 || invite.address,
          address_line_2: extras?.address_line_2,
          local_government_area: extras?.local_government_area,
          state: extras?.state || invite.state,
          country: extras?.country || invite.country || "Nigeria",
        });
      })
      .catch((err) => {
        setError(
          err?.response
            ? createErrorMessage(err.response.data)
            : err.message || "Unable to validate this invitation."
        );
      })
      .finally(() => setLoading(false));
  }, [form, token, user]);

  const autofillFromAccount = () => {
    if (!invitation) return;
    form.setFieldsValue({
      workplace_name: invitation.account_name,
      address_line_1: invitation.address,
      state: invitation.state,
      country: invitation.country,
    });
  };

  const handleSubmit = async () => {
    if (!invitation) return;
    try {
      const values = await form.validateFields();
      setSaving(true);

      const membershipRes = await updateAccountMembership(token);

      const workplaceRes = await updateWorkplace({
        job_title: values.job_title,
        workplace_name: values.workplace_name,
        address_line_1: values.address_line_1,
        address_line_2: values.address_line_2 || undefined,
        local_government_area: values.local_government_area,
        state: values.state,
        country: values.country,
      });

      let latestUser = workplaceRes.data.user || user!;
      latestUser = {
        ...latestUser,
        job_title: values.job_title,
        workplace_name: values.workplace_name,
        account_details: {
          account_id:
            workplaceRes.data.user?.account_details?.account_id ||
            membershipRes.data.account_id,
          role:
            workplaceRes.data.user?.account_details?.role ||
            membershipRes.data.role,
          max_seat:
            workplaceRes.data.user?.account_details?.max_seat ||
            user?.account_details?.max_seat ||
            2,
          subscription_valid_to:
            workplaceRes.data.user?.account_details?.subscription_valid_to ??
            null,
        },
      };

      const pending = getPendingReauth();
      if (pending) {
        try {
          const loginRes = await login({
            email: pending.email || user?.email || "",
            password: pending.password,
          });
          if (loginRes.status === 200) {
            latestUser = loginRes.data.user;
            await dispatch(
              loginAction({
                token: {
                  access: loginRes.data.access,
                  refresh: loginRes.data.refresh,
                },
                user: loginRes.data.user,
              })
            );
            clearPendingReauth();
          } else {
            dispatch(setUser(latestUser));
          }
        } catch {
          dispatch(setUser(latestUser));
        }
      } else {
        dispatch(setUser(latestUser));
      }

      setProfileExtras({
        ...getProfileExtras(),
        job_title: values.job_title,
        workplace_name: values.workplace_name,
        address_line_1: values.address_line_1,
        address_line_2: values.address_line_2,
        local_government_area: values.local_government_area,
        state: values.state,
        country: values.country,
      });
      setStoredAccount({
        id: membershipRes.data.account_id || invitation.account_id,
        name: invitation.account_name,
        account_type: "TEAM",
        max_seat: latestUser.account_details?.max_seat || 2,
        address: invitation.address,
        state: invitation.state,
        country: invitation.country,
      } satisfies Account);

      modal.success({
        title: "Invitation accepted",
        content:
          membershipRes.data.message ||
          workplaceRes.data.message ||
          "Your workplace and team membership have been updated.",
        onOk: () => router.push("/dermatology"),
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown }; message?: string };
      if (error?.response || error?.message) {
        modal.error({
          title: "Unable to update details",
          content: error?.response
            ? createErrorMessage(error.response.data)
            : error.message,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <PageShell title="Update your details" centered panel>
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      </PageShell>
    );
  }

  if (error || !invitation) {
    return (
      <PageShell
        title="Invitation unavailable"
        subtitle={error || "This invitation is no longer valid."}
        centered
        panel
      >
        <Button
          type="primary"
          className="h-14! w-full max-w-[280px] rounded-[40px]! text-lg!"
          onClick={() => router.push("/")}
        >
          Go home
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Update your details"
      subtitle={`Join ${invitation.account_name} by confirming your workplace information.`}
      backHref={`/team-invitation?token=${encodeURIComponent(token)}`}
      panel
    >
      <div className="mb-5 rounded-3xl bg-[#F7F7F8] px-4 py-3 text-left text-sm text-[#4F4F4F]">
        Invited as{" "}
        <span className="font-semibold text-[#121212]">
          {invitation.role.toLowerCase()}
        </span>{" "}
        by {invitation.invited_by}.
      </div>

      <Form
        form={form}
        layout="vertical"
        className="text-left"
        onFinish={handleSubmit}
      >
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

        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[#121212]">
            Workplace details
          </p>
          <Button type="link" className="px-0!" onClick={autofillFromAccount}>
            Use account address
          </Button>
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
          <Select showSearch placeholder="Select state" options={stateOptions} />
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

        <Button
          type="primary"
          htmlType="submit"
          loading={saving}
          className="mt-2 h-14! w-full rounded-[40px]! text-lg!"
        >
          Save and join team
        </Button>
      </Form>
    </PageShell>
  );
};

const UpdateInviteDetailsPage = () => (
  <Suspense
    fallback={
      <PageShell title="Update your details" centered panel>
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      </PageShell>
    }
  >
    <UpdateInviteDetailsContent />
  </Suspense>
);

export default UpdateInviteDetailsPage;
