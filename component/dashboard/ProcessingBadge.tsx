import { LoadingSpinner } from "./icons";
import React from "react";

export const DELAYED_PROCESSING_MESSAGE =
  "Sorry, AI response is taking a little longer than usual...";

interface ProcessingBadgeProps {
  secondsRemaining: number;
  delayed?: boolean;
}

const ProcessingBadge = ({
  secondsRemaining,
  delayed = false,
}: ProcessingBadgeProps) => (
  <div className="inline-flex max-w-full items-center gap-3 rounded-full bg-[#F0F0F0] px-4 py-2 text-sm leading-snug text-[#4F4F4F]">
    <LoadingSpinner />
    {delayed ? (
      <span>{DELAYED_PROCESSING_MESSAGE}</span>
    ) : (
      <span className="flex items-center gap-2">
        <span>Request is processing</span>
        <span
          className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-white px-2 text-base font-semibold tabular-nums text-[#121212]"
          aria-live="polite"
          aria-label={`${secondsRemaining} seconds remaining`}
        >
          {secondsRemaining}
        </span>
      </span>
    )}
  </div>
);

export default ProcessingBadge;
