"use client";
import React from "react";
import Container from "../Container";
import { App, Button, Form, Input, Select } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { registerUser } from "@/redux/action/auth";
import { loginAction } from "@/redux/reducer/auth/auth";
import { createErrorMessage } from "@/utils/errorInstance";
import { getSafeRedirect } from "@/utils/safeRedirect";
import { useAppDispatch } from "@/hook";
import {
  countries,
  countryCodes,
  jobTitles,
  normalizePhoneNumber,
  nigerianStates,
} from "@/constants/nigeriaLocations";

const FormItem = Form.Item;

const Signup = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = getSafeRedirect(searchParams.get("next"));
  const { modal } = App.useApp();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    const { validateFields } = form;
    validateFields()
      .then((values) => {
        setLoading(true);
        const payload = {
          ...values,
          phone_number: normalizePhoneNumber(
            values.phone_number,
            values.country_code
          ),
        };
        delete payload.confirm_password;

        registerUser(payload)
          .then(async (res) => {
            if (res.status === 201) {
              const { user, tokens } = res.data;
              await dispatch(
                loginAction({
                  token: tokens,
                  user,
                })
              );
              setLoading(false);
              router.push(next);
            }
          })
          .catch((err) => {
            setLoading(false);
            modal.error({
              title: "Error",
              content: err?.response
                ? createErrorMessage(err.response.data)
                : err.message,
            });
          });
      })
      .catch(() => setLoading(false));
  };

  return (
    <Container>
      <div className="w-full">
        <p className="text-center text-xl font-semibold text-[#121212] sm:text-2xl lg:text-[28px]">
          Sign Up with Email
        </p>
        <p className="mt-1 text-center text-sm text-[#4F4F4F] sm:text-base">
          Register to save and record your clinical contributions
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ country_code: "234", country: "Nigeria" }}
        >
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
            <Input className="h-11!" placeholder="Enter email address" />
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

          <p className="mt-4 mb-2 text-sm font-semibold text-[#121212]">
            Workplace details
          </p>

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
              options={nigerianStates.map((s) => ({ value: s, label: s }))}
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
              loading={loading}
            >
              Register
            </Button>
          </FormItem>

          <p className="text-base text-center">
            Already have an account?{" "}
            <Link
              href={
                next === "/dermatology"
                  ? "/auth/login"
                  : `/auth/login?next=${encodeURIComponent(next)}`
              }
              className="text-[#121212]! font-semibold"
            >
              Sign in
            </Link>
          </p>
        </Form>
      </div>
    </Container>
  );
};

export default Signup;
