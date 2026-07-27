"use client";

import JoinResearchLanding from "@/component/JoinResearchLanding";
import { useAppSelector } from "@/hook";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useTransition } from "react";

function HomeContent() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");
    if (uid && token) {
      router.replace(
        `/auth/reset-password?uid=${encodeURIComponent(uid)}&token=${encodeURIComponent(token)}`
      );
    }
  }, [searchParams, router]);

  const handleRedirect = () => {
    if (isAuthenticated) {
      startTransition(() => {
        router.push("/dermatology");
      });
    } else {
      startTransition(() => {
        router.push("/auth/login");
      });
    }
  };

  return (
    <JoinResearchLanding onJoinClick={handleRedirect} loading={isPending} />
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
