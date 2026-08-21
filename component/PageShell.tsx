"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface PageShellProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  backHref?: string;
  centered?: boolean;
  panel?: boolean;
}

const PageShell = ({
  title,
  subtitle,
  children,
  backHref,
  centered = false,
  panel = false,
}: PageShellProps) => {
  const router = useRouter();

  return (
    <div className="linear-background relative flex min-h-screen w-full flex-col font-sans">
      <img
        src="/bgc.svg"
        className="pointer-events-none absolute top-[10%] z-0 h-[85vh] w-full object-cover md:top-8 md:h-full"
        alt=""
        aria-hidden
      />

      <header className="relative z-10 flex shrink-0 items-center justify-between px-4 py-5 sm:px-6 md:px-10">
        <button
          type="button"
          onClick={() => (backHref ? router.push(backHref) : router.back())}
          className="text-sm text-[#4F4F4F]"
        >
          Back
        </button>
        <p className="text-xl font-extrabold text-[#121212] sm:text-2xl">
          Tandermis
        </p>
        <span className="w-10" aria-hidden />
      </header>

      <main
        className={`no-blur relative z-10 flex w-full flex-1 px-4 py-6 sm:px-6 md:px-8 ${
          centered
            ? "items-center justify-center"
            : "items-start justify-center pt-4 md:pt-8"
        }`}
      >
        <div className="w-full max-w-[520px] text-center">
          {title && (
            <h1 className="text-2xl font-semibold text-[#121212] md:text-[28px]">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#4F4F4F] md:text-base">
              {subtitle}
            </p>
          )}
          {panel ? (
            <div className="mt-6 rounded-[28px] bg-white/90 p-5 shadow-sm backdrop-blur-sm md:rounded-4xl md:p-8">
              {children}
            </div>
          ) : (
            <div className={title || subtitle ? "mt-6" : ""}>{children}</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PageShell;
