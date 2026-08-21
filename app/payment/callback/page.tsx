"use client";

import { SuccessCheck } from "@/component/dashboard/icons";
import PageShell from "@/component/PageShell";
import { useAppSelector } from "@/hook";
import { verifyFlutterwaveTransaction } from "@/services/payment";
import { setStoredSubscription } from "@/utils/accountStorage";
import { createErrorMessage } from "@/utils/errorInstance";
import { App, Button, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const CallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { modal } = App.useApp();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
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
  const isPending = result?.status?.toUpperCase() === "PENDING";

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
            {isSuccess
              ? "Payment successful"
              : isPending
                ? "Payment pending"
                : "Payment not completed"}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#4F4F4F] md:text-base">
            {result?.subscription_valid_to}
          </p>
          {result?.reference && (
            <p className="mt-2 text-xs text-[#888888]">
              Reference: {result.reference}
            </p>
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
