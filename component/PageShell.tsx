"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface PageShellProps {
  title?: string;
  children: React.ReactNode;
  backHref?: string;
}

const PageShell = ({ title, children, backHref }: PageShellProps) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="flex items-center justify-between border-b border-[#E8E8E8] px-4 py-4 md:px-10">
        <button
          type="button"
          onClick={() => (backHref ? router.push(backHref) : router.back())}
          className="text-sm text-[#4F4F4F]"
        >
          Back
        </button>
        <p className="text-lg font-extrabold text-[#121212]">Tandermis</p>
        <span className="w-10" aria-hidden />
      </header>
      <main className="mx-auto w-full max-w-2xl px-4 py-8 md:py-12">
        {title && (
          <h1 className="mb-6 text-center text-2xl font-semibold text-[#121212] md:text-[28px]">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
};

export default PageShell;
