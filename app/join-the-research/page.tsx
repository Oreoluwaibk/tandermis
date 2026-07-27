"use client";

import JoinResearchLanding from "@/component/JoinResearchLanding";
import { useAppSelector } from "@/hook";
import { createContributor } from "@/redux/action/auth";
import {
  getAccessToken,
  isContributor,
  setContributorFlag,
} from "@/utils/authStorage";
import { createErrorMessage } from "@/utils/errorInstance";
import { App } from "antd";
import { useRouter } from "next/navigation";
import { Suspense, useState, useTransition } from "react";

function JoinTheResearchContent() {
  const router = useRouter();
  const { modal } = App.useApp();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isPending, startTransition] = useTransition();
  const [contributorLoading, setContributorLoading] = useState(false);

  const handleJoinResearch = async () => {
    if (!isAuthenticated) {
      startTransition(() => {
        router.push("/auth/signup?next=/join-the-research");
      });
      return;
    }

    if (isContributor()) {
      startTransition(() => {
        router.push("/dermatology-research");
      });
      return;
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      startTransition(() => {
        router.push("/auth/login?next=/join-the-research");
      });
      return;
    }

    setContributorLoading(true);
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
      setContributorLoading(false);
    }
  };

  return (
    <JoinResearchLanding
      onJoinClick={handleJoinResearch}
      loading={isPending || contributorLoading}
    />
  );
}

export default function JoinTheResearchPage() {
  return (
    <Suspense fallback={null}>
      <JoinTheResearchContent />
    </Suspense>
  );
}
