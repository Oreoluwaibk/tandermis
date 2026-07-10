"use client";
import React, { Suspense } from "react";
import Container from "../Container";
import { App, Button, Form, Input } from "antd";
import { createErrorMessage } from "@/utils/errorInstance";
import { resetPasswordApi } from "@/redux/action/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const FormItem = Form.Item;

const ResetPasswordForm = () => {
  const { modal } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [successful, setSuccessful] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const uid = searchParams.get("uid") || "";
  const token = searchParams.get("token") || "";

  React.useEffect(() => {
    if (!uid || !token) {
      modal.warning({
        title: "Invalid reset link",
        content:
          "This password reset link is missing required parameters. Please request a new link.",
      });
    }
  }, [uid, token, modal]);

  const handleSubmit = () => {
    const { validateFields } = form;
    validateFields()
      .then((values) => {
        if (!uid || !token) return;
        setLoading(true);
        resetPasswordApi({
          uid,
          token,
          new_password: values.password,
        })
          .then((res) => {
            if (res.status === 200) {
              setLoading(false);
              setSuccessful(true);
              modal.success({
                title: "Success",
                content:
                  res.data.message ||
                  "Password reset successfully. You can now login.",
              });
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
    <Container padding={30}>
      {!successful && (
        <div className="w-full">
          <p className="text-[#121212] text-[28px] font-semibold text-center mb-4">
            Enter new password
          </p>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <FormItem
              className="py-0! my-2! mb-6!"
              name="password"
              label="New Password"
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
              <Input.Password className="h-11!" placeholder="Enter password" />
            </FormItem>

            <FormItem
              className="py-0! my-2! mb-6!"
              name="confirm_password"
              label="Confirm New Password"
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

            <FormItem className="mt-4!">
              <Button
                type="primary"
                htmlType="submit"
                className="text-white text-lg! w-full rounded-[40px]! h-14!"
                loading={loading}
                disabled={!uid || !token}
              >
                Save New Password
              </Button>
            </FormItem>
          </Form>
        </div>
      )}

      {successful && (
        <div className="w-full">
          <div className="flex items-center justify-center mb-5">
            <Image src="/succes.svg" alt="success icon" width={100} height={100} />
          </div>
          <p className="text-[#121212] text-[28px] font-semibold text-center mb-0!">
            Password reset
          </p>
          <p className="text-[#121212] text-[28px] font-semibold text-center mb-4">
            successfully. Now Sign in
          </p>
          <Button
            type="primary"
            className="text-white text-lg! w-full rounded-[40px]! h-14!"
            loading={isPending}
            onClick={() => {
              startTransition(() => {
                router.push("/auth/login");
              });
            }}
          >
            Sign in
          </Button>
        </div>
      )}
    </Container>
  );
};

const ResetPassword = () => (
  <Suspense fallback={<Container padding={30}>Loading...</Container>}>
    <ResetPasswordForm />
  </Suspense>
);

export default ResetPassword;
