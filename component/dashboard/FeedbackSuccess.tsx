"use client";

import { SuccessCheck } from "./icons";
import { Button } from "antd";
import React from "react";

interface FeedbackSuccessProps {
  onSubmitAnother: () => void;
}

const FeedbackSuccess = ({ onSubmitAnother }: FeedbackSuccessProps) => (
  <div className="flex flex-col items-center py-8 text-center">
    <SuccessCheck />
    <h3 className="mt-6 text-2xl font-semibold text-[#121212] md:text-[28px]">
      Your Feedback Has Been Collected Successfully
    </h3>
    <p className="mt-3 max-w-md text-base text-[#4F4F4F]">
      Thank you for contributing to the training of Tandermis&apos; diagnostic
      AI.
    </p>
    <Button
      type="primary"
      onClick={onSubmitAnother}
      className="mt-8 h-14! min-w-[280px] rounded-[40px]! text-lg! font-medium!"
    >
      Submit Another Case
    </Button>
  </div>
);

export default FeedbackSuccess;
