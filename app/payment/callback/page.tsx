"use client";

import { SuccessCheck } from "@/component/dashboard/icons";
import PageShell from "@/component/PageShell";
import { useAppDispatch, useAppSelector } from "@/hook";
import { setUser } from "@/redux/reducer/auth/auth";
import { verifyFlutterwaveTransaction } from "@/services/payment";
import { setStoredSubscription } from "@/utils/accountStorage";
import { applySubscriptionToUser } from "@/utils/subscription";
import { createErrorMessage } from "@/utils/errorInstance";
import {
  formatPaymentStatus,
  formatReadableDate,
  formatSubscriptionSummary,
} from "@/utils/formatDate";
import { CopyOutlined } from "@ant-design/icons";
import { App, Button, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const CallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { modal, message } = App.useApp();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    status: string;
    reference: string;
    subscription_valid_to: string;
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      const query = searchParams.toString();
      router.push(
        `/auth/login?next=${encodeURIComponent(`/payment/callback${query ? `?${query}` : ""}`)}`
      );
      return;
    }

    const tx_ref = searchParams.get("tx_ref") || searchParams.get("txRef");
    const transaction_id =
      searchParams.get("transaction_id") ||
      searchParams.get("transactionId") ||
      undefined;
    const status = searchParams.get("status") || undefined;

    if (!tx_ref) {
      setResult({
        status: "UNKNOWN",
        reference: "Missing transaction reference",
        subscription_valid_to: "Your subscription was not successful.",
      });
      setLoading(false);
      return;
    }

    verifyFlutterwaveTransaction({
      tx_ref,
      transaction_id,
      status,
    })
      .then((res) => {
        setResult(res.data);
        setStoredSubscription(res.data);
        if (user && res.data.status?.toUpperCase() === "SUCCESS") {
          dispatch(
            setUser(
              applySubscriptionToUser(user, res.data.subscription_valid_to)
            )
          );
        }
      })
      .catch((err) => {
        modal.error({
          title: "Verification failed",
          content: err?.response
            ? createErrorMessage(err.response.data)
            : err.message,
        });
        setResult({
          status: "UNKNOWN",
          reference: tx_ref,
          subscription_valid_to: "Your subscription was not successful.",
        });
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, modal, router, searchParams]);

  const isSuccess = result?.status?.toUpperCase() === "SUCCESS";

  const copyReference = async () => {
    if (!result?.reference) return;
    try {
      await navigator.clipboard.writeText(result.reference);
      setCopied(true);
      message.success("Reference copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      message.error("Unable to copy reference");
    }
  };

  return (
    <PageShell
      title={loading ? "Payment status" : undefined}
      backHref="/profile"
      centered
      panel
    >
      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          {isSuccess && <SuccessCheck />}
          <p className="mt-4 text-2xl font-semibold text-[#121212]">
            Payment {formatPaymentStatus(result?.status).toLowerCase()}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#4F4F4F] md:text-base">
            {formatSubscriptionSummary(result?.subscription_valid_to)}
          </p>
          {result?.reference && !result.reference.toLowerCase().includes("missing") && (
            <div className="mt-5 w-full rounded-3xl bg-[#F7F7F8] px-4 py-4 text-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[#6F6F6F]">Status</span>
                <span className="font-medium text-[#121212]">
                  {formatPaymentStatus(result.status)}
                </span>
              </div>
              {/^\d{4}-\d{2}-\d{2}T/.test(result.subscription_valid_to) && (
                <div className="mt-2 flex items-start justify-between gap-3">
                  <span className="text-[#6F6F6F]">Valid until</span>
                  <span className="max-w-[60%] text-right font-medium text-[#121212]">
                    {formatReadableDate(result.subscription_valid_to)}
                  </span>
                </div>
              )}
              <div className="mt-2 flex items-start justify-between gap-3">
                <span className="text-[#6F6F6F]">Reference</span>
                <button
                  type="button"
                  onClick={copyReference}
                  className="flex max-w-[70%] items-start justify-end gap-2 text-right font-medium text-[#121212]"
                  aria-label="Copy payment reference"
                >
                  <span className="break-all">{result.reference}</span>
                  <CopyOutlined className="mt-0.5 shrink-0" />
                </button>
              </div>
              {copied && (
                <p className="mt-2 text-right text-xs text-[#4F4F4F]">Copied</p>
              )}
            </div>
          )}
          <Button
            type="primary"
            className="mt-8 h-14! w-full max-w-[280px] rounded-[40px]! text-lg!"
            onClick={() =>
              router.push(isSuccess ? "/dermatology" : "/payment")
            }
          >
            {isSuccess ? "Continue" : "Try again"}
          </Button>
        </div>
      )}
    </PageShell>
  );
};

const PaymentCallbackPage = () => (
  <Suspense
    fallback={
      <PageShell title="Payment status" centered panel>
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      </PageShell>
    }
  >
    <CallbackContent />
  </Suspense>
);

export default PaymentCallbackPage;
