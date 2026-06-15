"use client";

import { LightbulbIcon } from "./icons";
import React from "react";

interface DiagnosisResultCardProps {
  totalCases: number;
}

const DiagnosisResultCard = ({ totalCases }: DiagnosisResultCardProps) => (
  <div className="w-full">
    <h3 className="mb-3 text-lg font-semibold text-[#121212] md:text-xl">
      Result Diagnosis
    </h3>

    <p className="mb-5 text-xs italic leading-relaxed text-[#888888] md:mb-6 md:text-sm">
      *Tandermis keeps your data safe and secured. We do not share your data
      with any third party, it is used to train our AI model alone.*
    </p>

    <div className="flex flex-col gap-4 text-sm leading-relaxed text-[#374151] md:gap-5 md:text-[15px]">
      <div>
        <p className="mb-1 font-semibold text-[#121212]">1. Submission Complete</p>
        <p>
          Thank you for your clinical contribution. Your case data has been
          received and will help improve Tandermis&apos; diagnostic accuracy.
        </p>
      </div>
      <div>
        <p className="mb-1 font-semibold text-[#121212]">
          2. Total cases contributed by you: {totalCases}
        </p>
        <p>
          Every case you submit strengthens the model — your work makes a real
          difference.
        </p>
      </div>
    </div>

    <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#F0F0F0] px-3 py-1.5 text-xs text-[#4F4F4F] md:mt-6 md:px-4 md:py-2 md:text-sm">
      <LightbulbIcon />
      Thought for 90 secs
    </div>
  </div>
);

export default DiagnosisResultCard;
