"use client";

import CaseSummaryCard from "./CaseSummaryCard";
import { CaseFormData } from "./types";
import React from "react";

interface ResultViewLayoutProps {
  formData: CaseFormData;
  children: React.ReactNode;
}

const ResultViewLayout = ({ formData, children }: ResultViewLayoutProps) => (
  <div className="w-full max-w-5xl">
    <div className="flex flex-col gap-6 md:gap-8">
      {/* User context — ChatGPT-style prompt bubble, wider, anchored right on desktop */}
      <div className="flex w-full justify-stretch md:justify-end">
        <div className="w-full md:max-w-[540px] lg:max-w-[580px]">
          <CaseSummaryCard formData={formData} variant="chat" />
        </div>
      </div>

      {/* AI response stream — left-aligned, narrower reading column */}
      <div className="flex w-full justify-start">
        <div className="flex w-full flex-col gap-5 md:gap-6 lg:w-[58%] lg:max-w-[680px] lg:shrink-0">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default ResultViewLayout;
