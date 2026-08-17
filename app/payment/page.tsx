"use client";

import PageShell from "@/component/PageShell";
import { useAppSelector } from "@/hook";
import {
  createPaymentAttempt,
  FLUTTERWAVE_PUBLIC_KEY,
  SUBSCRIPTION_AMOUNT,
} from "@/services/payment";
import { getProfileExtras, getStoredAccount } from "@/utils/accountStorage";
import { createErrorMessage } from "@/utils/errorInstance";
import { formatPhoneForGateway } from "@/constants/nigeriaLocations";
import { App, Button } from "antd";
import Script from "next/script";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const PaymentPage = () => {
  const router = useRouter();
  const { modal } = App.useApp();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [scriptReady, setScriptReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extras, setExtras] = useState<ReturnType<typeof getProfileExtras>>(null);
  const [account, setAccount] = useState<ReturnType<typeof getStoredAccount>>(null);

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth/login?next=/payment");
  }, [isAuthenticated, router]);

  useEffect(() => {
    setExtras(getProfileExtras());
    setAccount(getStoredAccount());
  }, []);

  const handlePay = async () => {
    if (!window.FlutterwaveCheckout) {
      modal.error({
        title: "Payment unavailable",
        content: "The payment gateway is still loading. Please try again.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await createPaymentAttempt(SUBSCRIPTION_AMOUNT);
      const { reference, amount } = res.data;
      const origin = window.location.origin;
      const fullName = user
        ? `${user.first_name} ${user.last_name}`.trim()
        : extras?.workplace_name || "Tandermis user";

      window.FlutterwaveCheckout({
        public_key: FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: reference,
        amount: Number(amount ?? SUBSCRIPTION_AMOUNT),
        currency: "NGN",
        payment_options: "card, banktransfer, ussd, mobilemoney",
        redirect_url: `${origin}/payment/callback`,
        customer: {
          email: user?.email || "",
          phone_number: formatPhoneForGateway(
            extras?.phone_number || user?.phone_number,
            extras?.country_code || user?.country_code
          ),
          name: fullName,
        },
        customizations: {
          title: "Tandermis",
          description: "Subscription Payment",
          logo: `${origin}/img.svg`,
        },
        configurations: {
          session_duration: 60,
          max_retry_attempt: 3,
        },
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown }; message?: string };
      modal.error({
        title: "Unable to start payment",
        content: error?.response
          ? createErrorMessage(error.response.data)
          : error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <Script
        src="https://checkout.flutterwave.com/v3.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <PageShell title="Subscription payment" backHref="/profile">
        <div className="rounded-3xl bg-[#F7F7F8] p-6 text-center">
          <p className="text-sm text-[#4F4F4F]">Amount due</p>
          <p className="mt-2 text-3xl font-semibold text-[#121212]">
            ₦{SUBSCRIPTION_AMOUNT.toLocaleString()}
          </p>
          <p className="mt-3 text-sm text-[#4F4F4F]">
            {account
              ? `For ${account.name} (${account.account_type.toLowerCase()} account)`
              : "Complete payment to activate your Tandermis subscription."}
          </p>
        </div>

        <Button
          type="primary"
          size="large"
          loading={loading}
          disabled={!scriptReady}
          onClick={handlePay}
          className="mt-8 h-14! w-full rounded-[40px]! text-lg!"
        >
          Pay now
        </Button>
        <Button
          type="link"
          className="mt-2 w-full text-[#121212]!"
          onClick={() => router.push("/dermatology")}
        >
          Continue without paying
        </Button>
      </PageShell>
    </>
  );
};

export default PaymentPage;
