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
      <PageShell title="Team invitation">
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      </PageShell>
    );
  }

  if (error || !invitation) {
    return (
      <PageShell title="Invitation unavailable">
        <p className="text-center text-base text-[#4F4F4F]">
          {error || "This invitation is no longer valid."}
        </p>
        <Button
          type="primary"
          className="mt-8 h-14! w-full rounded-[40px]! text-lg!"
          onClick={() => router.push("/")}
        >
          Go home
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell title="You're invited">
      <div className="rounded-3xl bg-[#F7F7F8] p-6 text-left">
        <p className="text-sm text-[#4F4F4F]">Account</p>
        <p className="text-lg font-semibold text-[#121212]">
          {invitation.account_name}
        </p>
        <p className="mt-3 text-sm text-[#4F4F4F]">
          {invitation.address}, {invitation.state}, {invitation.country}
        </p>
        <p className="mt-3 text-sm text-[#4F4F4F]">
          Invited by {invitation.invited_by} as{" "}
          <span className="font-semibold text-[#121212]">{invitation.role}</span>
        </p>
        <p className="mt-2 text-xs text-[#888888]">
          Expires {new Date(invitation.valid_to).toLocaleString()}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3">
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
                  `/auth/login?next=${encodeURIComponent(`/invite?token=${token}`)}`
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
    </PageShell>
  );
};

const InvitePage = () => (
  <Suspense
    fallback={
      <PageShell title="Team invitation">
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      </PageShell>
    }
  >
    <InviteContent />
  </Suspense>
);

export default InvitePage;
