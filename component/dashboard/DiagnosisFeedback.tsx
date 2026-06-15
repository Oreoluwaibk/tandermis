"use client";

import { FeedbackData } from "./types";
import { Button, Input, Select } from "antd";
import React from "react";

const { Option } = Select;
const { TextArea } = Input;

interface DiagnosisFeedbackProps {
  feedback: FeedbackData;
  onChange: (data: Partial<FeedbackData>) => void;
  onSubmit: () => void;
  loading?: boolean;
}

const DiagnosisFeedback = ({
  feedback,
  onChange,
  onSubmit,
  loading,
}: DiagnosisFeedbackProps) => {
  const isComplete =
    feedback.diagnosisCorrect && feedback.managementCorrect;

  return (
    <div className="w-full rounded-[20px] bg-[#F7F7F8] p-4 md:rounded-[24px] md:p-6">
      <h3 className="text-base font-semibold text-[#121212] md:text-lg">
        Diagnosis Feedback
      </h3>
      <p className="mb-4 mt-1 text-xs text-[#4F4F4F] md:mb-6 md:text-sm">
        Your feedback helps us improve the accuracy of Tandermis&apos; AI
        diagnostic model.
      </p>

      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-2 block text-sm text-[#121212]">
            Is the diagnosis correct? <span className="text-[#DC1111]">*</span>
          </label>
          <Select
            placeholder="select answer"
            className="w-full"
            value={feedback.diagnosisCorrect || undefined}
            onChange={(val) => onChange({ diagnosisCorrect: val })}
          >
            <Option value="Yes">Yes</Option>
            <Option value="No">No</Option>
            <Option value="Partially">Partially</Option>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#121212]">
            Is the next line of management correct?{" "}
            <span className="text-[#DC1111]">*</span>
          </label>
          <Select
            placeholder="select answer"
            className="w-full"
            value={feedback.managementCorrect || undefined}
            onChange={(val) => onChange({ managementCorrect: val })}
          >
            <Option value="Yes">Yes</Option>
            <Option value="No">No</Option>
            <Option value="Partially">Partially</Option>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#121212]">
            Please state other comments about the model response
          </label>
          <TextArea
            placeholder="Add a comment"
            rows={4}
            value={feedback.comments}
            onChange={(e) => onChange({ comments: e.target.value })}
            className="rounded-2xl!"
          />
        </div>
      </div>

      <Button
        type="primary"
        loading={loading}
        disabled={!isComplete}
        onClick={onSubmit}
        className="mt-6 h-12! w-full rounded-[40px]! text-base! font-medium!"
      >
        Submit Feedback
      </Button>
    </div>
  );
};

export default DiagnosisFeedback;
