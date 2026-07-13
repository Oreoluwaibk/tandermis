import { LoadingSpinner } from "./icons";
import React from "react";

export const DEFAULT_PROCESSING_MESSAGE = "Request is processing for 90 secs";
export const DELAYED_PROCESSING_MESSAGE =
  "Sorry, AI response is taking a little longer than usual...";

interface ProcessingBadgeProps {
  message?: string;
}

const ProcessingBadge = ({
  message = DEFAULT_PROCESSING_MESSAGE,
}: ProcessingBadgeProps) => (
  <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-[#F0F0F0] px-4 py-2 text-sm leading-snug text-[#4F4F4F]">
    <LoadingSpinner />
    <span>{message}</span>
  </div>
);

export default ProcessingBadge;
