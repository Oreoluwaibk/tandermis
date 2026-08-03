"use client";

import { fitzpatrickLabels, CaseFormData } from "./types";
import { RcFile } from "antd/es/upload";
import React from "react";

interface CaseSummaryCardProps {
  formData: CaseFormData;
  compact?: boolean;
  variant?: "default" | "chat";
  flowMode?: "research" | "general";
}

const getImageSrc = (value: RcFile | string) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value instanceof Blob) return URL.createObjectURL(value);
  return "";
};

const CaseSummaryCard = ({
  formData,
  compact,
  variant = "default",
  flowMode = "research",
}: CaseSummaryCardProps) => {
  const lesionSrc = getImageSrc(formData.lesionImage);
  const isChat = variant === "chat";
  const showFitzpatrick = flowMode === "research";

  const fields = [
    {
      question: "Which part of the body is the lesion on?",
      answer: formData.lesionLocation,
    },
    {
      question: "Age of patient",
      answer: formData.patientAge
        ? `${formData.patientAge} ${formData.patientAgeUnit}`
        : "",
    },
    {
      question: "Sex of patient",
      answer: formData.patientSex,
    },
    {
      question: "Duration of lesion",
      answer: formData.lesionDuration
        ? `${formData.lesionDuration} ${formData.lesionDurationUnit}`
        : "",
    },
    ...(showFitzpatrick
      ? [
          {
            question: "Fitzpatrick skin type",
            answer:
              fitzpatrickLabels[formData.fitzpatrickSkinType] ||
              formData.fitzpatrickSkinType,
          },
        ]
      : []),
    {
      question: "Is lesion itchy?",
      answer: formData.isLesionItchy,
    },
    {
      question: "Associated symptoms",
      answer: formData.associatedSymptoms,
      multiline: true,
    },
    {
      question: "Additional information",
      answer: formData.additionalInformation,
      multiline: true,
    },
  ];

  if (isChat) {
    return (
      <div className="w-full rounded-3xl border border-[#ECECEC] bg-[#F7F7F8] px-5 py-4 shadow-sm md:rounded-[28px] md:px-6 md:py-5">
        {lesionSrc && (
          <div className="mb-4">
            <img
              src={lesionSrc}
              alt="Lesion"
              className="h-[72px] w-[72px] rounded-2xl object-cover md:h-20 md:w-20"
            />
          </div>
        )}

        <div className="flex flex-col gap-3.5 md:gap-4">
          {fields.map((field) =>
            field.multiline && field.answer ? (
              <div
                key={field.question}
                className="text-sm leading-relaxed text-[#5D5D5D] md:text-[15px]"
              >
                <p>{field.question}</p>
                <p className="mt-1 font-semibold text-[#121212]">
                  Answer: {field.answer}
                </p>
              </div>
            ) : (
              <p
                key={field.question}
                className="text-sm leading-relaxed text-[#5D5D5D] md:text-[15px]"
              >
                {field.question}{" "}
                <span className="font-semibold text-[#121212]">
                  Answer: {field.answer || "—"}
                </span>
              </p>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-[20px] bg-[#F5F5F5] md:rounded-3xl ${
        compact ? "p-3 md:p-4" : "p-6"
      }`}
    >
      {lesionSrc && (
        <div className="mb-3 md:mb-4">
          <img
            src={lesionSrc}
            alt="Lesion"
            className="h-14 w-14 rounded-xl object-cover md:h-16 md:w-16"
          />
        </div>
      )}

      <div className="flex flex-col gap-2 md:gap-3">
        {fields.map((field) => (
          <div key={field.question} className="text-xs text-[#4F4F4F] md:text-sm">
            <span>{field.question}</span>
            <br />
            <span className="font-semibold text-[#121212]">
              Answer: {field.answer || "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseSummaryCard;
