"use client";

import { useAppDispatch, useAppSelector } from "@/hook";
import {
  apiLogout,
  isAccountAdmin,
  isTeamAccount,
} from "@/redux/action/auth";
import { logoutUser, selectedRefresh } from "@/redux/reducer/auth/auth";
import {
  getInviteCount,
  getProfileExtras,
  getStoredAccount,
} from "@/utils/accountStorage";
import { getNickNames } from "@/utils/getNickname";
import { formatReadableDate } from "@/utils/formatDate";
import { LogoutOutlined } from "@ant-design/icons";
import { App, Button, Card, Divider } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="flex items-start justify-between gap-4 py-2">
    <p className="text-sm text-[#6F6F6F]">{label}</p>
    <p className="max-w-[60%] text-right text-sm font-medium text-[#121212]">
      {value || "—"}
    </p>
  </div>
);

const Page = () => {
  const { modal } = App.useApp();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const refreshToken = useAppSelector(selectedRefresh);
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [extras, setExtras] = useState<ReturnType<typeof getProfileExtras>>(null);
  const [storedAccount, setStoredAccountState] = useState<
    ReturnType<typeof getStoredAccount>
  >(null);
  const [inviteCount, setInviteCount] = useState(0);
  const [casesCount, setCasesCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth/login?next=/profile");
  }, [isAuthenticated, router]);

  useEffect(() => {
    setStoredAccountState(getStoredAccount());
    setExtras(getProfileExtras());
    setInviteCount(getInviteCount());
    const research = parseInt(
      localStorage.getItem("tandermis_cases_count") || "0",
      10
    );
    const general = parseInt(
      localStorage.getItem("tandermis_dermatology_cases_count") || "0",
      10
    );
    setCasesCount(research + general);
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      if (refreshToken) await apiLogout(refreshToken);
    } catch {
      // Still clear local session if logout API fails
    }
    dispatch(logoutUser());
    router.push("/auth/login");
  };

  const handleAskLogout = () => {
    modal.confirm({
      title: "Are you sure you want to log out?",
      content: "You will be redirected to the login page.",
      onOk: handleLogout,
    });
  };

  if (!isAuthenticated) return null;

  const accountDetails = user?.account_details;
  const isTeam = isTeamAccount(user) || storedAccount?.account_type === "TEAM";
  const canInvite = isAccountAdmin(user);
  const displayName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
  const expiry = accountDetails?.subscription_valid_to;
  const maxSeat = accountDetails?.max_seat || storedAccount?.max_seat;

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-6 font-sans md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <Button type="text" onClick={() => router.push("/dermatology")}>
            Back
          </Button>
          <p className="text-lg font-extrabold text-[#121212]">Tandermis</p>
          <span className="w-12" />
        </div>

        <Card className="rounded-[32px]!">
          <div className="flex flex-col items-center gap-2 pt-2">
            <div className="flex h-18 w-18 items-center justify-center rounded-full bg-[#F5D2FC] text-4xl font-semibold text-[#1E1E1E]">
              {getNickNames(displayName || user?.email || "U")}
            </div>
            <p className="text-center text-2xl font-medium text-[#121212]">
              {displayName || "User"}
            </p>
            <p className="text-center text-[#4F4F4F]">{user?.email}</p>
          </div>

          <Divider />

          <p className="mb-2 text-base font-semibold text-[#121212]">
            Personal details
          </p>
          <DetailRow label="Username" value={user?.username} />
          <DetailRow
            label="Job title"
            value={user?.job_title || extras?.job_title}
          />
          <DetailRow
            label="Workplace"
            value={user?.workplace_name || extras?.workplace_name}
          />
          <DetailRow
            label="Phone"
            value={extras?.phone_number || user?.phone_number}
          />
          <DetailRow
            label="Address"
            value={
              extras?.address_line_1 ||
              [extras?.state, extras?.country].filter(Boolean).join(", ")
            }
          />

          {(accountDetails || storedAccount) && (
            <>
              <Divider />
              <p className="mb-2 text-base font-semibold text-[#121212]">
                Account
              </p>
              {storedAccount?.name && (
                <DetailRow label="Account name" value={storedAccount.name} />
              )}
              <DetailRow
                label="Type"
                value={isTeam ? "TEAM" : "INDIVIDUAL"}
              />
              {accountDetails?.account_id && (
                <DetailRow label="Account ID" value={accountDetails.account_id} />
              )}
              {accountDetails?.role && (
                <DetailRow label="Role" value={accountDetails.role} />
              )}
              <DetailRow label="Max seats" value={maxSeat} />
              {storedAccount && (
                <DetailRow
                  label="Address"
                  value={`${storedAccount.address}, ${storedAccount.state}, ${storedAccount.country}`}
                />
              )}
            </>
          )}

          {isTeam && (
            <>
              <Divider />
              <p className="mb-2 text-base font-semibold text-[#121212]">
                Team subscription
              </p>
              <DetailRow
                label="Subscription status"
                value={expiry ? "Active" : "Not started"}
              />
              <DetailRow
                label="Expires"
                value={expiry ? formatReadableDate(expiry) : "No active subscription"}
              />
              <DetailRow label="Invites sent" value={inviteCount} />
              <DetailRow
                label="Seats"
                value={`${inviteCount + 1} / ${maxSeat || 2}`}
              />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                {canInvite && (
                  <Button
                    type="primary"
                    className="h-12! flex-1 rounded-[40px]!"
                    onClick={() => router.push("/invite-team")}
                  >
                    Invite members
                  </Button>
                )}
                <Button
                  className="h-12! flex-1 rounded-[40px]!"
                  onClick={() => router.push("/payment")}
                >
                  {expiry ? "Renew subscription" : "Pay subscription"}
                </Button>
              </div>
            </>
          )}

          {!isTeam && (
            <Button
              className="mt-6 h-12! w-full rounded-[40px]!"
              onClick={() => router.push("/payment")}
            >
              Pay subscription
            </Button>
          )}

          <Divider />

          <div className="flex flex-col items-center gap-3">
            <p className="text-base font-medium text-[#121212]">
              Contribution Impact Card
            </p>
            <Button
              type="primary"
              className="w-full border-0! bg-linear-to-r! from-[#F7D0FC]! to-[#B2FEED]! text-base font-medium text-[#434343]! hover:opacity-90!"
            >
              <span className="text-black">{casesCount}</span> Patient Cases
              Contributed
            </Button>
            <p className="text-center text-xs text-[#4F4F4F]">
              Your contributions directly improve Tandermis’ diagnostic accuracy.
            </p>
            <Button
              loading={logoutLoading}
              className="mt-4 w-full border-[#DC1111]! text-lg! text-[#DC1111]!"
              onClick={handleAskLogout}
            >
              Log out <LogoutOutlined className="text-[#DC1111]!" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Page;
