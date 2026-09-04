"use client";

import { useAppSelector } from "@/hook";
import { getSafeRedirect } from "@/utils/safeRedirect";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

interface ContainerProps {
  children: React.ReactNode;
  skipAuthRedirect?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  children,
  skipAuthRedirect = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = getSafeRedirect(searchParams.get("next"));
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (skipAuthRedirect) return;
    if (isAuthenticated) router.push(next);
  }, [isAuthenticated, router, next, skipAuthRedirect]);

  return (
    <div className="auth-screen linear-background relative flex min-h-screen w-full flex-col font-sans">
      <img
        src="/bgc.svg"
        className="pointer-events-none absolute top-[10%] z-0 h-[85vh] w-full object-cover md:top-8 md:h-full"
        alt=""
        aria-hidden
      />

      <header className="relative z-10 flex shrink-0 items-center justify-between px-4 pt-5 pb-2 sm:px-6 sm:pt-6 md:px-8 md:pt-8">
        <span className="w-20" aria-hidden />
        <p className="text-xl font-extrabold text-[#121212] sm:text-2xl">
          Tandermis
        </p>
        <Link
          href="/pricing"
          className="text-sm font-semibold text-[#121212] sm:text-base"
        >
          View plans
        </Link>
      </header>

      <main className="no-blur relative z-10 flex flex-1 justify-center overflow-y-auto px-4 py-4 sm:px-6 md:px-8 md:py-6 lg:px-10">
        <div className="auth-form-panel w-full max-w-[480px] sm:max-w-[520px] md:max-w-[600px] lg:max-w-[640px] xl:max-w-[700px]">
          {children}
        </div>
      </main>

      <footer className="auth-screen-footer relative z-10 shrink-0 px-4 pt-3 pb-4 sm:px-6 md:px-8">
        <p className="mx-auto max-w-2xl text-center text-[11px] leading-relaxed text-[#6F6F6F] sm:text-xs md:text-sm">
          *Tandermis keeps your data safe and secured. We do not share your
          data with any third party, it is used to train our AI model alone.*
        </p>
      </footer>
    </div>
  );
};

export default Container;
