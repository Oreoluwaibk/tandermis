"use client";

import { useAppDispatch, useAppSelector } from "@/hook";
import { setUser } from "@/redux/reducer/auth/auth";
import {
  extractPricingPlans,
  formatPlanPrice,
  getPricing,
  PricingPlan,
} from "@/services/pricing";
import { requestFreeTrial } from "@/services/trial";
import {
  applySubscriptionToUser,
  hasValidSubscription,
} from "@/utils/subscription";
import { createErrorMessage } from "@/utils/errorInstance";
import { App, Button, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const planTitle = (plan: PricingPlan) => {
  if (plan.account_type === "INDIVIDUAL") return "Individual";
  return `Team · ${plan.max_seat} seat${plan.max_seat === 1 ? "" : "s"}`;
};

const PricingPage = () => {
  const router = useRouter();
  const { modal } = App.useApp();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingTrial, setStartingTrial] = useState(false);
  const subscribed = hasValidSubscription(user);

  useEffect(() => {
    getPricing()
      .then((res) => setPlans(extractPricingPlans(res.data)))
      .catch((err) => {
        modal.error({
          title: "Unable to load pricing",
          content: err?.response
            ? createErrorMessage(err.response.data)
            : err.message,
        });
      })
      .finally(() => setLoading(false));
  }, [modal]);

  const persistExpiry = (expiry: string | null) => {
    if (!user || !expiry) return;
    dispatch(setUser(applySubscriptionToUser(user, expiry)));
  };

  const handleFreePlan = async () => {
    if (!isAuthenticated) {
      router.push("/auth/signup?plan=free");
      return;
    }

    setStartingTrial(true);
    try {
      const result = await requestFreeTrial();
      persistExpiry(result.expiry);

      if (result.activated) {
        modal.success({
          title: "Free trial started",
          content: result.message,
          onOk: () => router.push("/dermatology"),
        });
        return;
      }

      if (result.alreadySubscribed) {
        modal.info({
          title: "Free trial unavailable",
          content: result.message,
          onOk: () => router.push("/dermatology"),
        });
        return;
      }

      modal.warning({
        title: "Free trial unavailable",
        content: result.message,
        okText: "Choose a plan",
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown }; message?: string };
      modal.error({
        title: "Unable to start free trial",
        content: error?.response
          ? createErrorMessage(error.response.data)
          : error.message,
      });
    } finally {
      setStartingTrial(false);
    }
  };

  const handlePaidPlan = (plan: PricingPlan) => {
    if (!isAuthenticated) {
      const params = new URLSearchParams({
        account_type: plan.account_type,
        max_seat: String(plan.max_seat),
        next: "/payment",
      });
      router.push(`/auth/signup?${params.toString()}`);
      return;
    }
    router.push("/payment");
  };

  return (
    <div className="linear-background relative flex min-h-screen w-full flex-col font-sans">
      <img
        src="/bgc.svg"
        className="pointer-events-none absolute top-[10%] z-0 h-[85vh] w-full object-cover md:top-8 md:h-full"
        alt=""
        aria-hidden
      />

      <header className="relative z-10 flex items-center justify-between px-4 py-5 sm:px-8">
        <Link href="/" className="text-xl font-extrabold text-[#121212] sm:text-2xl">
          Tandermis
        </Link>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              type="primary"
              className="h-10! rounded-[40px]! px-5!"
              onClick={() => router.push("/dermatology")}
            >
              Go to app
            </Button>
          ) : (
            <>
              <Button
                className="h-10! rounded-[40px]! px-5!"
                onClick={() => router.push("/auth/login")}
              >
                Sign in
              </Button>
              <Button
                type="primary"
                className="h-10! rounded-[40px]! px-5!"
                onClick={() => router.push("/auth/signup")}
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="no-blur relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6 text-center md:px-8">
        <h1 className="text-2xl font-semibold text-[#121212] md:text-[36px]">
          Plans and pricing
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#4F4F4F] md:text-base">
          Start with a free trial, or choose a subscription plan for your
          practice.
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col rounded-[28px] bg-white/90 p-6 text-left shadow-sm backdrop-blur-sm">
              <p className="text-sm font-medium uppercase tracking-wide text-[#888888]">
                Free
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[#121212]">
                Free trial
              </h2>
              <p className="mt-4 text-3xl font-semibold text-[#121212]">Free</p>
              <p className="mt-1 text-sm text-[#4F4F4F]">
                Try Tandermis before you subscribe.
              </p>
              <Button
                loading={startingTrial}
                className="mt-6 h-12! rounded-[40px]!"
                onClick={() => {
                  if (isAuthenticated && subscribed) {
                    router.push("/dermatology");
                    return;
                  }
                  handleFreePlan();
                }}
              >
                {isAuthenticated && subscribed
                  ? "Plan active"
                  : "Start free trial"}
              </Button>
            </div>

            {plans.map((plan) => (
              <div
                key={`${plan.account_type}-${plan.max_seat}-${plan.price}-${plan.subscription_duration}`}
                className="flex flex-col rounded-[28px] bg-white/90 p-6 text-left shadow-sm backdrop-blur-sm"
              >
                <p className="text-sm font-medium uppercase tracking-wide text-[#888888]">
                  {plan.account_type}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[#121212]">
                  {planTitle(plan)}
                </h2>
                <p className="mt-4 text-3xl font-semibold text-[#121212]">
                  {formatPlanPrice(plan.price, plan.currency)}
                </p>
                <p className="mt-1 text-sm text-[#4F4F4F]">
                  {plan.subscription_duration}
                  {plan.max_seat
                    ? ` · ${plan.max_seat} seat${plan.max_seat === 1 ? "" : "s"}`
                    : ""}
                </p>
                <Button
                  type="primary"
                  className="mt-6 h-12! rounded-[40px]!"
                  onClick={() => handlePaidPlan(plan)}
                >
                  {isAuthenticated ? "Subscribe" : "Get started"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PricingPage;
