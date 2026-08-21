"use client";

import PageShell from "@/component/PageShell";
import { useAppSelector } from "@/hook";
import {
  InvitationRole,
  sendTeamInvitation,
} from "@/services/invitation";
import { incrementInviteCount } from "@/utils/accountStorage";
import { createErrorMessage } from "@/utils/errorInstance";
import {
  MinusCircleOutlined,
  PlusOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { App, Button, Form, Input, Select } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const roleOptions = [
  { value: "MEMBER", label: "Member" },
  { value: "ADMIN", label: "Admin" },
];

const InviteTeamPage = () => {
  const router = useRouter();
  const { modal, message } = App.useApp();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [step, setStep] = useState<"prompt" | "invite">("prompt");
  const [mode, setMode] = useState<"single" | "multiple">("single");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth/login?next=/invite-team");
  }, [isAuthenticated, router]);

  const goToApp = () => router.push("/dermatology");

  const sendInvites = async (
    invites: { email: string; role: InvitationRole }[]
  ) => {
    setLoading(true);
    const results: string[] = [];
    try {
      for (const invite of invites) {
        const res = await sendTeamInvitation(invite);
        results.push(
          `${invite.email}: ${res.data.message}${
            res.data.expires_at
              ? ` (expires ${new Date(res.data.expires_at).toLocaleDateString()})`
              : ""
          }`
        );
      }
      incrementInviteCount(invites.length);
      modal.success({
        title: "Invitations sent",
        content: (
          <ul className="mt-2 list-disc pl-5 text-sm">
            {results.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ),
        onOk: goToApp,
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown }; message?: string };
      modal.error({
        title: "Unable to send invitation",
        content: error?.response
          ? createErrorMessage(error.response.data)
          : error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (mode === "single") {
        await sendInvites([{ email: values.email, role: values.role }]);
        return;
      }

      const invites = (values.invites || []).filter(
        (item: { email?: string }) => item?.email
      ) as { email: string; role: InvitationRole }[];

      if (!invites.length) {
        message.warning("Add at least one email to invite.");
        return;
      }

      await sendInvites(invites);
    } catch {
      // form validation errors
    }
  };

  if (!isAuthenticated) return null;

  return (
    <PageShell
      title={step === "prompt" ? "Invite your team" : "Send invitations"}
      subtitle={
        step === "prompt"
          ? "Your team account is ready. Invite colleagues to join your workspace, or continue on your own."
          : "Invite one person or add several colleagues at once."
      }
      backHref="/dermatology"
      centered={step === "prompt"}
      panel
    >
      {step === "prompt" ? (
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-r from-[#F7D0FC] to-[#B2FEED] text-2xl text-[#121212]">
            <TeamOutlined />
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#4F4F4F] md:text-base">
            Would you like to invite colleagues now?
          </p>
          <div className="mt-8 flex w-full max-w-[320px] flex-col gap-3">
            <Button
              type="primary"
              size="large"
              className="h-14! rounded-[40px]! text-base!"
              onClick={() => setStep("invite")}
            >
              Yes, invite now
            </Button>
            <Button
              size="large"
              className="h-14! rounded-[40px]! text-base!"
              onClick={goToApp}
            >
              No, continue
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-left">
          <div className="mx-auto mb-6 flex w-full rounded-full bg-[#F5F5F5] p-1">
            <button
              type="button"
              onClick={() => setMode("single")}
              className={`h-11 flex-1 rounded-full text-sm font-medium transition-colors ${
                mode === "single"
                  ? "bg-[#121212] text-white"
                  : "text-[#4F4F4F]"
              }`}
            >
              Invite one
            </button>
            <button
              type="button"
              onClick={() => setMode("multiple")}
              className={`h-11 flex-1 rounded-full text-sm font-medium transition-colors ${
                mode === "multiple"
                  ? "bg-[#121212] text-white"
                  : "text-[#4F4F4F]"
              }`}
            >
              Invite multiple
            </button>
          </div>

          <Form
            form={form}
            layout="vertical"
            initialValues={{ role: "MEMBER", invites: [{ role: "MEMBER" }] }}
          >
            {mode === "single" ? (
              <>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Enter an email" },
                    { type: "email", message: "Enter a valid email" },
                  ]}
                >
                  <Input className="h-11!" placeholder="colleague@hospital.com" />
                </Form.Item>
                <Form.Item
                  name="role"
                  label="Role"
                  rules={[{ required: true, message: "Select a role" }]}
                >
                  <Select options={roleOptions} />
                </Form.Item>
              </>
            ) : (
              <Form.List name="invites">
                {(fields, { add, remove }) => (
                  <div className="flex flex-col gap-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.key}
                        className="rounded-[20px] bg-[#F7F7F8] p-4 text-left"
                      >
                        <p className="mb-3 text-sm font-medium text-[#121212]">
                          Colleague {index + 1}
                        </p>
                        <Form.Item
                          {...field}
                          name={[field.name, "email"]}
                          label="Email"
                          rules={[
                            { required: true, message: "Enter an email" },
                            { type: "email", message: "Enter a valid email" },
                          ]}
                        >
                          <Input
                            className="h-11!"
                            placeholder="colleague@hospital.com"
                          />
                        </Form.Item>
                        <div className="flex items-end gap-3">
                          <Form.Item
                            {...field}
                            name={[field.name, "role"]}
                            label="Role"
                            className="mb-0! flex-1"
                            rules={[{ required: true, message: "Select a role" }]}
                          >
                            <Select options={roleOptions} />
                          </Form.Item>
                          {fields.length > 1 && (
                            <Button
                              type="text"
                              danger
                              icon={<MinusCircleOutlined />}
                              onClick={() => remove(field.name)}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add({ role: "MEMBER" })}
                      icon={<PlusOutlined />}
                      className="h-12! rounded-[40px]!"
                    >
                      Add another person
                    </Button>
                  </div>
                )}
              </Form.List>
            )}

            <div className="mt-6 flex flex-col items-center">
              <Button
                type="primary"
                loading={loading}
                onClick={handleSubmit}
                className="h-14! w-full rounded-[40px]! text-lg!"
              >
                Send invitation{mode === "multiple" ? "s" : ""}
              </Button>
              <Button
                type="link"
                className="mt-2 text-[#121212]!"
                onClick={goToApp}
              >
                Skip for now
              </Button>
            </div>
          </Form>
        </div>
      )}
    </PageShell>
  );
};

export default InviteTeamPage;
