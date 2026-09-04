"use client";

import PageShell from "@/component/PageShell";
import { useAppSelector } from "@/hook";
import { getUserAccountType } from "@/redux/action/auth";
import {
  createPaymentAttempt,
  FLUTTERWAVE_PUBLIC_KEY,
} from "@/services/payment";
import {
  extractPricingPlans,
  formatPlanPrice,
  getPricing,
  matchPricingPlan,
  PricingPlan,
} from "@/services/pricing";
import { getProfileExtras, getStoredAccount } from "@/utils/accountStorage";
import { createErrorMessage } from "@/utils/errorInstance";
import { formatPhoneForGateway } from "@/constants/nigeriaLocations";
import { App, Button, Spin } from "antd";
import Script from "next/script";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const PaymentPage = () => {
  const router = useRouter();
  const { modal } = App.useApp();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [scriptReady, setScriptReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pricingLoading, setPricingLoading] = useState(true);
  const [extras, setExtras] = useState<ReturnType<typeof getProfileExtras>>(null);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [plan, setPlan] = useState<PricingPlan | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth/login?next=/payment");
  }, [isAuthenticated, router]);

  useEffect(() => {
    setExtras(getProfileExtras());
    const storedAccount = getStoredAccount();
    setAccountName(storedAccount?.name || user?.workplace_name || null);

    const load = async () => {
      setPricingLoading(true);
      try {
        const { data } = await getPricing();
        const plans = extractPricingPlans(data);
        setPlan(
          matchPricingPlan(
            plans,
            getUserAccountType(user) || storedAccount?.account_type,
            user?.account_details?.max_seat || storedAccount?.max_seat
          )
        );
      } catch (err: unknown) {
        const error = err as { response?: { data?: unknown }; message?: string };
        modal.error({
          title: "Unable to load pricing",
          content: error?.response
            ? createErrorMessage(error.response.data)
            : error.message,
        });
      } finally {
        setPricingLoading(false);
      }
    };

    load();
  }, [modal, user]);

  const handlePay = async () => {
    if (!plan || !plan.currency) {
      modal.error({
        title: "Pricing unavailable",
        content: "We could not load a matching paid plan for your account.",
      });
      return;
    }

    if (!window.FlutterwaveCheckout) {
      modal.error({
        title: "Payment unavailable",
        content: "The payment gateway is still loading. Please try again.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await createPaymentAttempt(plan.price);
      const { reference, amount } = res.data;
      const origin = window.location.origin;
      const fullName = user
        ? `${user.first_name} ${user.last_name}`.trim()
        : extras?.workplace_name || "Tandermis user";

      window.FlutterwaveCheckout({
        public_key: FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: reference,
        amount: Number(amount ?? plan.price),
        currency: plan.currency,
        payment_options: "card, banktransfer, ussd, mobilemoney, opay",
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
      <PageShell
        title="Subscription payment"
        subtitle="Complete payment to activate your Tandermis subscription."
        backHref="/pricing"
        centered
        panel
      >
        {pricingLoading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-[#4F4F4F]">Amount due</p>
            <p className="mt-2 text-4xl font-semibold text-[#121212]">
              {plan
                ? formatPlanPrice(plan.price, plan.currency)
                : "Pricing unavailable"}
            </p>
            {plan && (
              <p className="mt-2 text-sm text-[#4F4F4F]">
                {plan.account_type === "INDIVIDUAL" ? "Individual" : "Team"} ·{" "}
                {plan.max_seat} seat{plan.max_seat === 1 ? "" : "s"} ·{" "}
                {plan.subscription_duration}
              </p>
            )}
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#4F4F4F]">
              {accountName
                ? `For ${accountName}`
                : "Your subscription keeps the clinical workspace available for your account."}
            </p>

            <Button
              type="primary"
              size="large"
              loading={loading}
              disabled={!scriptReady || !plan}
              onClick={handlePay}
              className="mt-8 h-14! w-full max-w-[320px] rounded-[40px]! text-lg!"
            >
              Pay now
            </Button>
            <Button
              type="link"
              className="mt-2 text-[#121212]!"
              onClick={() => router.push("/pricing")}
            >
              See all plans
            </Button>
            <Button
              type="link"
              className="text-[#121212]!"
              onClick={() => router.push("/dermatology")}
            >
              Continue without paying
            </Button>
          </div>
        )}
      </PageShell>
    </>
  );
};

export default PaymentPage;
