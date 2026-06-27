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

const yesNoOptions = (
  <>
    <Option value="Yes">Yes</Option>
    <Option value="No">No</Option>
  </>
);

const DiagnosisFeedback = ({
  feedback,
  onChange,
  onSubmit,
  loading,
}: DiagnosisFeedbackProps) => {
  const diagnosisRequiresCorrection = feedback.diagnosisCorrect === "No";
  const differentialsRequireCorrection = feedback.differentialsCorrect === "No";

  const isComplete =
    feedback.diagnosisCorrect &&
    feedback.differentialsCorrect &&
    feedback.managementCorrect &&
    (!diagnosisRequiresCorrection || feedback.correctDiagnosis.trim()) &&
    (!differentialsRequireCorrection || feedback.correctDifferentials.trim());

  return (
    <div className="dashboard-form w-full rounded-[20px] bg-[#F7F7F8] p-4 md:rounded-[24px] md:p-6">
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
            className="w-full dashboard-field-input"
            size="large"
            value={feedback.diagnosisCorrect || undefined}
            onChange={(val) =>
              onChange({
                diagnosisCorrect: val,
                correctDiagnosis: val === "No" ? feedback.correctDiagnosis : "",
              })
            }
          >
            {yesNoOptions}
          </Select>
          {diagnosisRequiresCorrection && (
            <div className="mt-3">
              <label className="mb-2 block text-sm text-[#121212]">
                What is the correct diagnosis?{" "}
                <span className="text-[#DC1111]">*</span>
              </label>
              <TextArea
                placeholder="Enter the correct diagnosis"
                rows={3}
                value={feedback.correctDiagnosis}
                onChange={(e) =>
                  onChange({ correctDiagnosis: e.target.value })
                }
                className="dashboard-textarea rounded-[20px]! bg-white! p-3!"
              />
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#121212]">
            Are the differentials correct?{" "}
            <span className="text-[#DC1111]">*</span>
          </label>
          <Select
            placeholder="select answer"
            className="w-full dashboard-field-input"
            size="large"
            value={feedback.differentialsCorrect || undefined}
            onChange={(val) =>
              onChange({
                differentialsCorrect: val,
                correctDifferentials:
                  val === "No" ? feedback.correctDifferentials : "",
              })
            }
          >
            {yesNoOptions}
          </Select>
          {differentialsRequireCorrection && (
            <div className="mt-3">
              <label className="mb-2 block text-sm text-[#121212]">
                What are the correct differential diagnoses?{" "}
                <span className="text-[#DC1111]">*</span>
              </label>
              <TextArea
                placeholder="Enter the correct differential diagnoses"
                rows={3}
                value={feedback.correctDifferentials}
                onChange={(e) =>
                  onChange({ correctDifferentials: e.target.value })
                }
                className="dashboard-textarea rounded-[20px]! bg-white! p-3!"
              />
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#121212]">
            Is the next line of management correct?{" "}
            <span className="text-[#DC1111]">*</span>
          </label>
          <Select
            placeholder="select answer"
            className="w-full dashboard-field-input"
            size="large"
            value={feedback.managementCorrect || undefined}
            onChange={(val) => onChange({ managementCorrect: val })}
          >
            {yesNoOptions}
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
            className="dashboard-textarea rounded-[20px]! bg-white! p-3!"
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
