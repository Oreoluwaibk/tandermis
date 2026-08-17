"use client";

import PageShell from "@/component/PageShell";
import { useAppSelector } from "@/hook";
import {
  InvitationRole,
  sendTeamInvitation,
} from "@/services/invitation";
import { incrementInviteCount } from "@/utils/accountStorage";
import { createErrorMessage } from "@/utils/errorInstance";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Radio, Select } from "antd";
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
            res.data.expires_at ? ` (expires ${new Date(res.data.expires_at).toLocaleDateString()})` : ""
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
    <PageShell title="Invite your team" backHref="/dermatology">
      {step === "prompt" ? (
        <div className="text-center">
          <p className="text-base leading-relaxed text-[#4F4F4F]">
            Your team account is ready. Would you like to invite colleagues now?
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              type="primary"
              size="large"
              className="h-14! min-w-[200px] rounded-[40px]! text-base!"
              onClick={() => setStep("invite")}
            >
              Yes, invite now
            </Button>
            <Button
              size="large"
              className="h-14! min-w-[200px] rounded-[40px]! text-base!"
              onClick={goToApp}
            >
              No, continue
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-6 text-center text-sm text-[#4F4F4F]">
            Send a single invitation or add multiple colleagues at once.
          </p>

          <Radio.Group
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="mb-6 flex justify-center gap-4"
          >
            <Radio.Button value="single">Invite one person</Radio.Button>
            <Radio.Button value="multiple">Invite multiple</Radio.Button>
          </Radio.Group>

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
                    {fields.map((field) => (
                      <div
                        key={field.key}
                        className="rounded-2xl border border-[#E8E8E8] p-4"
                      >
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
                      className="h-11!"
                    >
                      Add another person
                    </Button>
                  </div>
                )}
              </Form.List>
            )}

            <Button
              type="primary"
              loading={loading}
              onClick={handleSubmit}
              className="mt-6 h-14! w-full rounded-[40px]! text-lg!"
            >
              Send invitation{mode === "multiple" ? "s" : ""}
            </Button>
            <Button
              type="link"
              className="mt-2 w-full text-[#121212]!"
              onClick={goToApp}
            >
              Skip for now
            </Button>
          </Form>
        </div>
      )}
    </PageShell>
  );
};

export default InviteTeamPage;
