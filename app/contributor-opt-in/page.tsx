"use client";

import { createContributor } from "@/redux/action/auth";
import { createErrorMessage } from "@/utils/errorInstance";
import {
  getAccessToken,
  isContributor,
  setContributorFlag,
} from "@/utils/authStorage";
import { App, Button } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/hook";

const ContributorOptInPage = () => {
  const router = useRouter();
  const { modal } = App.useApp();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    if (isContributor()) {
      router.push("/dermatology-research");
    }
  }, [isAuthenticated, router]);

  const handleOptIn = async () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    try {
      await createContributor(accessToken);
      setContributorFlag();
      router.push("/dermatology-research");
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown }; message?: string };
      modal.error({
        title: "Contributor registration failed",
        content: error?.response
          ? createErrorMessage(error.response.data)
          : error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 font-sans">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-2xl font-semibold text-[#121212] md:text-[28px]">
          Become a contributor
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#4F4F4F]">
          As a dermatology consultant contributor, you&apos;ll review AI
          diagnoses and provide detailed clinical feedback to help train and
          improve Tandermis.
        </p>
        <p className="mt-3 text-sm text-[#4F4F4F]">
          This is optional. Medical officers and other clinicians can continue
          using the standard dermatology page without opting in.
        </p>
        <Button
          type="primary"
          size="large"
          loading={loading}
          onClick={handleOptIn}
          className="mt-8 h-14! min-w-[280px] rounded-[40px]! text-lg! font-medium!"
        >
          Opt in as contributor
        </Button>
        <div className="mt-4">
          <Button
            type="link"
            onClick={() => router.push("/dermatology")}
            className="text-[#121212]!"
          >
            Continue to dermatology instead
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContributorOptInPage;
