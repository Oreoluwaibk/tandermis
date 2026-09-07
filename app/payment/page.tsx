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
  formatPlanTitle,
  getPricing,
  matchPricingPlan,
  plansForAccount,
  PricingPlan,
} from "@/services/pricing";
import { getProfileExtras, getStoredAccount } from "@/utils/accountStorage";
import { createErrorMessage } from "@/utils/errorInstance";
import { formatPhoneForGateway } from "@/constants/nigeriaLocations";
import { App, Button, Select, Spin } from "antd";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useState } from "react";

const PaymentContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { modal } = App.useApp();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [scriptReady, setScriptReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pricingLoading, setPricingLoading] = useState(true);
  const [extras, setExtras] = useState<ReturnType<typeof getProfileExtras>>(null);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [plan, setPlan] = useState<PricingPlan | null>(null);

  const requestedType = searchParams.get("account_type");
  const requestedSeats = searchParams.get("max_seat");
  const requestedDuration = searchParams.get("duration");

  useEffect(() => {
    if (!isAuthenticated) {
      const query = searchParams.toString();
      router.push(
        `/auth/login?next=${encodeURIComponent(`/payment${query ? `?${query}` : ""}`)}`
      );
    }
  }, [isAuthenticated, router, searchParams]);

  useEffect(() => {
    setExtras(getProfileExtras());
    const storedAccount = getStoredAccount();
    setAccountName(storedAccount?.name || user?.workplace_name || null);

    const load = async () => {
      setPricingLoading(true);
      try {
        const { data } = await getPricing();
        const loaded = extractPricingPlans(data);
        setPlans(loaded);

        const accountType =
          requestedType ||
          getUserAccountType(user) ||
          storedAccount?.account_type;
        const maxSeat =
          requestedSeats != null
            ? Number(requestedSeats)
            : user?.account_details?.max_seat || storedAccount?.max_seat;

        setPlan(
          matchPricingPlan(loaded, accountType, maxSeat, requestedDuration)
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
  }, [modal, requestedDuration, requestedSeats, requestedType, user]);

  const selectablePlans = useMemo(() => {
    const storedAccount = getStoredAccount();
    const accountType =
      plan?.account_type ||
      requestedType ||
      getUserAccountType(user) ||
      storedAccount?.account_type;
    const maxSeat =
      accountType === "TEAM"
        ? plan?.max_seat ||
          (requestedSeats != null ? Number(requestedSeats) : undefined) ||
          user?.account_details?.max_seat ||
          storedAccount?.max_seat
        : undefined;
    return plansForAccount(plans, accountType, maxSeat);
  }, [plan, plans, requestedSeats, requestedType, user]);

  const handleSelectPlan = (duration: string) => {
    const next = selectablePlans.find(
      (item) => item.subscription_duration === duration
    );
    if (next) setPlan(next);
  };

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
          description: `${formatPlanTitle(plan)} subscription`,
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
        subtitle="Choose a period and complete payment to activate your Tandermis subscription."
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
            {selectablePlans.length > 1 && (
              <Select
                className="mb-6 w-full max-w-[320px] text-left"
                value={plan?.subscription_duration}
                onChange={handleSelectPlan}
                options={selectablePlans.map((item) => ({
                  value: item.subscription_duration,
                  label: `${formatPlanPrice(item.price, item.currency)} / ${item.subscription_duration}`,
                }))}
              />
            )}
            <p className="text-sm text-[#4F4F4F]">Amount due</p>
            <p className="mt-2 text-4xl font-semibold text-[#121212]">
              {plan
                ? formatPlanPrice(plan.price, plan.currency)
                : "Pricing unavailable"}
            </p>
            {plan && (
              <p className="mt-2 text-sm text-[#4F4F4F]">
                {formatPlanTitle(plan)}
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

const PaymentPage = () => (
  <Suspense
    fallback={
      <PageShell title="Subscription payment" backHref="/pricing" centered panel>
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      </PageShell>
    }
  >
    <PaymentContent />
  </Suspense>
);

export default PaymentPage;
