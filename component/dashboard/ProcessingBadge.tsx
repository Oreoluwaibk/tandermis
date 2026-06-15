import { LoadingSpinner } from "./icons";
import React from "react";

interface ProcessingBadgeProps {
  message?: string;
}

const ProcessingBadge = ({
  message = "Request is processing for 90 secs",
}: ProcessingBadgeProps) => (
  <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F0F0] px-4 py-2 text-sm text-[#4F4F4F]">
    <LoadingSpinner />
    {message}
  </div>
);

export default ProcessingBadge;
