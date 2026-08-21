"use client";

import PageShell from "@/component/PageShell";
import { useAppSelector } from "@/hook";
import { Account } from "@/services/account";
import {
  acceptTeamInvitation,
  getTeamInvitation,
  TeamInvitation,
} from "@/services/invitation";
import { setStoredAccount } from "@/utils/accountStorage";
import { createErrorMessage } from "@/utils/errorInstance";
import { MailOutlined, TeamOutlined } from "@ant-design/icons";
import { App, Button, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const InviteContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { modal } = App.useApp();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<TeamInvitation | null>(null);

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
        setInvitation(res.data.invitation);
      })
      .catch((err) => {
        setError(
          err?.response
            ? createErrorMessage(err.response.data)
            : err.message || "Unable to validate this invitation."
        );
      })
      .finally(() => setLoading(false));
  }, [token]);

  const storeInvitationAccount = (invite: TeamInvitation) => {
    const account: Account = {
      id: invite.account_id,
      name: invite.account_name,
      account_type: "TEAM",
      max_seat: 2,
      address: invite.address,
      state: invite.state,
      country: invite.country,
    };
    setStoredAccount(account);
  };

  const handleAcceptExisting = async () => {
    if (!invitation) return;
    setAccepting(true);
    try {
      await acceptTeamInvitation(token);
      storeInvitationAccount(invitation);
      router.push("/dermatology");
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown }; message?: string };
      modal.error({
        title: "Unable to accept invitation",
        content: error?.response
          ? createErrorMessage(error.response.data)
          : error.message,
      });
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <PageShell title="Team invitation" centered panel>
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
        <div className="flex flex-col items-center">
          <Button
            type="primary"
            className="h-14! w-full max-w-[280px] rounded-[40px]! text-lg!"
            onClick={() => router.push("/")}
          >
            Go home
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="You're invited"
      subtitle="Join this team account to start contributing on Tandermis."
      centered
      panel
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-r from-[#F7D0FC] to-[#B2FEED] text-2xl text-[#121212]">
          <TeamOutlined />
        </div>

        <div className="w-full rounded-3xl bg-[#F7F7F8] px-5 py-5">
          <p className="text-xs uppercase tracking-wide text-[#888888]">
            Account
          </p>
          <p className="mt-1 text-lg font-semibold text-[#121212]">
            {invitation.account_name}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#4F4F4F]">
            {invitation.address}, {invitation.state}, {invitation.country}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#4F4F4F]">
            <MailOutlined />
            <span>
              Invited by {invitation.invited_by} as{" "}
              <span className="font-semibold text-[#121212]">
                {invitation.role.toLowerCase()}
              </span>
            </span>
          </div>
          <p className="mt-2 text-xs text-[#888888]">
            Expires {new Date(invitation.valid_to).toLocaleString()}
          </p>
        </div>

        <div className="mt-7 flex w-full max-w-[320px] flex-col gap-3">
          {!isAuthenticated ? (
            <>
              <Button
                type="primary"
                className="h-14! rounded-[40px]! text-base!"
                onClick={() =>
                  router.push(
                    `/auth/signup?invite_token=${encodeURIComponent(token)}`
                  )
                }
              >
                Accept invite and sign up
              </Button>
              <Button
                className="h-14! rounded-[40px]! text-base!"
                onClick={() =>
                  router.push(
                    `/auth/login?next=${encodeURIComponent(`/team-invitation?token=${token}`)}`
                  )
                }
              >
                I already have an account
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              loading={accepting}
              className="h-14! rounded-[40px]! text-base!"
              onClick={handleAcceptExisting}
            >
              Accept invite and update my details
            </Button>
          )}
          <Button
            type="link"
            className="text-[#DC1111]!"
            onClick={() => router.push("/")}
          >
            Decline invitation
          </Button>
        </div>
      </div>
    </PageShell>
  );
};

const TeamInvitationPage = () => (
  <Suspense
    fallback={
      <PageShell title="Team invitation" centered panel>
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      </PageShell>
    }
  >
    <InviteContent />
  </Suspense>
);

export default TeamInvitationPage;
