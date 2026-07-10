"use client";

import { LightbulbIcon } from "./icons";
import { ModelDiagnosisResult } from "./types";
import React from "react";

interface DiagnosisResultCardProps {
  totalCases: number;
  diagnosis?: ModelDiagnosisResult;
}

const DiagnosisResultCard = ({
  totalCases,
  diagnosis,
}: DiagnosisResultCardProps) => (
  <div className="w-full">
    <h3 className="mb-3 text-lg font-semibold text-[#121212] md:text-xl">
      Result Diagnosis
    </h3>

    <p className="mb-5 text-xs italic leading-relaxed text-[#888888] md:mb-6 md:text-sm">
      *Tandermis keeps your data safe and secured. We do not share your data
      with any third party, it is used to train our AI model alone.*
    </p>

    {diagnosis ? (
      <div className="flex flex-col gap-5 text-sm leading-relaxed text-[#374151] md:gap-6 md:text-[15px]">
        <div>
          <p className="mb-1 font-semibold text-[#121212]">
            Most likely diagnosis
          </p>
          <p className="text-base font-medium text-[#121212]">
            {diagnosis.most_likely_diagnosis}
          </p>
        </div>

        {diagnosis.differential_diagnoses?.length > 0 && (
          <div>
            <p className="mb-2 font-semibold text-[#121212]">
              Differential diagnoses
            </p>
            <ul className="flex flex-col gap-3">
              {diagnosis.differential_diagnoses.map((item) => (
                <li key={item.name}>
                  <p className="font-medium text-[#121212]">{item.name}</p>
                  <p className="mt-0.5 text-[#4F4F4F]">{item.reasoning}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {diagnosis.next_steps_in_management?.length > 0 && (
          <div>
            <p className="mb-2 font-semibold text-[#121212]">
              Next steps in management
            </p>
            <ol className="flex flex-col gap-4">
              {diagnosis.next_steps_in_management.map((step) => (
                <li key={step.step_number}>
                  <p className="font-medium text-[#121212]">
                    {step.step_number}. {step.description}
                  </p>
                  <ul className="mt-1 list-disc pl-5 text-[#4F4F4F]">
                    {step.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        )}

        {diagnosis.important_considerations?.length > 0 && (
          <div>
            <p className="mb-2 font-semibold text-[#121212]">
              Important considerations
            </p>
            <ul className="list-disc pl-5 text-[#4F4F4F]">
              {diagnosis.important_considerations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ) : (
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-[#374151] md:gap-5 md:text-[15px]">
        <div>
          <p className="mb-1 font-semibold text-[#121212]">
            1. Submission Complete
          </p>
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
    )}

    <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#F0F0F0] px-3 py-1.5 text-xs text-[#4F4F4F] md:mt-6 md:px-4 md:py-2 md:text-sm">
      <LightbulbIcon />
      {diagnosis ? "Analysis complete" : "Thought for 90 secs"}
    </div>
  </div>
);

export default DiagnosisResultCard;
