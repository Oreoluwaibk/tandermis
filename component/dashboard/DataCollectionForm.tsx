"use client";

import InputPicker from "@/component/InputPicker";
import UploadImage from "@/component/UploadImage";
import { fitzpatrickType, partOfTheBody } from "@/savedInfo";
import { ArrowRightOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Select, Tooltip } from "antd";
import { RcFile } from "antd/es/upload";
import React from "react";
import { CaseFormData, clinicalDiagnosisOptions } from "./types";

const { Option } = Select;

interface DataCollectionFormProps {
  formData: CaseFormData;
  onChange: (data: Partial<CaseFormData>) => void;
  onSubmit: () => void;
  loading?: boolean;
}

const fieldSelectProps = {
  className: "w-full dashboard-field-input",
  size: "large" as const,
};

const DataCollectionForm = ({
  formData,
  onChange,
  onSubmit,
  loading,
}: DataCollectionFormProps) => {
  const isComplete =
    formData.frontImage &&
    formData.sideImage &&
    formData.lesionLocation &&
    formData.patientAge &&
    formData.lesionDuration &&
    formData.fitzpatrickSkinType &&
    formData.erythematous &&
    formData.clinicalDiagnosis;

  return (
    <div className="mx-auto flex h-full w-full max-w-[860px] flex-col overflow-hidden">
      <div className="mb-3 shrink-0 flex flex-col items-center gap-2 text-center md:mb-5">
        <h2 className="text-xl font-medium text-[#121212] md:text-[28px]">
          Data Collection Form
        </h2>
        <p className="max-w-[520px] text-xs leading-relaxed text-[#4F4F4F] md:text-base">
          We&apos;re building a next-generation AI system trained to identify
          skin conditions early and accurately.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-[#E0E0E0] bg-[#F5F5F5] md:rounded-[40px]">
          <div className="shrink-0 px-3 pt-3 md:px-5 md:pt-4">
            <p className="text-sm font-medium text-[#121212] md:text-lg">
              Patient Personal Data
            </p>
            <div className="my-2 border-t border-[#C4C4C4] md:my-3" />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 md:px-5 md:pb-4">

        <div className="mb-4 md:mb-5">
          <p className="text-sm font-medium text-[#121212] md:text-base">
            Patient Skin Lesion
          </p>
          <p className="mt-0.5 text-xs text-[#474747] md:text-sm">
            Upload a photograph of the skin lesion
          </p>

          <Row gutter={[12, 12]} className="mt-3 md:mt-4">
            <Col xs={24} md={12}>
              <UploadImage
                variant="dashboard"
                title="Front View of Lesion"
                value={formData.frontImage}
                setValue={(val) =>
                  onChange({ frontImage: val as RcFile | string })
                }
                showDelete
              />
            </Col>
            <Col xs={24} md={12}>
              <UploadImage
                variant="dashboard"
                title="Side View of Lesion"
                value={formData.sideImage}
                setValue={(val) =>
                  onChange({ sideImage: val as RcFile | string })
                }
                showDelete
              />
            </Col>
          </Row>
        </div>

        <Form layout="vertical" className="dashboard-form font-sans!">
          <Row gutter={[12, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Which part of the body is the Lesion on?"
                required
                className="mb-3! md:mb-4!"
              >
                <Select
                  {...fieldSelectProps}
                  placeholder="choose lesion body location"
                  value={formData.lesionLocation || undefined}
                  onChange={(val) => onChange({ lesionLocation: val })}
                >
                  {partOfTheBody.map((part) => (
                    <Option key={part} value={part}>
                      {part}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Age of patient" required className="mb-3! md:mb-4!">
                <InputPicker
                  number
                  value={formData.patientAge}
                  setValue={(val) => {
                    const next =
                      typeof val === "function"
                        ? val(formData.patientAge)
                        : val;
                    onChange({ patientAge: next });
                  }}
                  selectValue={formData.patientAgeUnit}
                  setSelectValue={(val) => {
                    const next =
                      typeof val === "function"
                        ? val(formData.patientAgeUnit)
                        : val;
                    onChange({ patientAgeUnit: next });
                  }}
                  placeHolder="enter patient age"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Duration of Lesion"
                required
                className="mb-3! md:mb-4!"
              >
                <InputPicker
                  number
                  value={formData.lesionDuration}
                  setValue={(val) => {
                    const next =
                      typeof val === "function"
                        ? val(formData.lesionDuration)
                        : val;
                    onChange({ lesionDuration: next });
                  }}
                  selectValue={formData.lesionDurationUnit}
                  setSelectValue={(val) => {
                    const next =
                      typeof val === "function"
                        ? val(formData.lesionDurationUnit)
                        : val;
                    onChange({ lesionDurationUnit: next });
                  }}
                  placeHolder="enter lesion duration"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Fitzpatrick skin type"
                required
                className="mb-3! md:mb-4!"
              >
                <Select
                  {...fieldSelectProps}
                  placeholder="choose skin type"
                  value={formData.fitzpatrickSkinType || undefined}
                  onChange={(val) => onChange({ fitzpatrickSkinType: val })}
                >
                  {fitzpatrickType.map((type) => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span className="inline-flex items-center gap-1.5">
                    Does it have Erythematous
                    <Tooltip title="Redness due to capillary dilation">
                      <QuestionCircleOutlined className="cursor-help text-[#888888]" />
                    </Tooltip>
                  </span>
                }
                required
                className="mb-3! md:mb-4!"
              >
                <Select
                  {...fieldSelectProps}
                  placeholder="choose option"
                  value={formData.erythematous || undefined}
                  onChange={(val) => onChange({ erythematous: val })}
                >
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="What is your clinical diagnosis?"
                required
                className="mb-0!"
              >
                <Select
                  {...fieldSelectProps}
                  placeholder="choose option"
                  showSearch
                  optionFilterProp="children"
                  value={formData.clinicalDiagnosis || undefined}
                  onChange={(val) => onChange({ clinicalDiagnosis: val })}
                >
                  {clinicalDiagnosisOptions.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
          </div>
        </div>

      <div className="mt-3 shrink-0 flex justify-end md:mt-4">
        <Button
          type="primary"
          loading={loading}
          disabled={!isComplete}
          onClick={onSubmit}
          className={`h-12! w-full rounded-[40px]! text-sm! font-medium! md:h-14! md:w-[405px]! md:text-base! ${
            isComplete
              ? "bg-[#121212]! border-[#121212]!"
              : "bg-[#A0A0A0]! text-white! border-[#A0A0A0]! cursor-not-allowed!"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            Get AI Diagnosis
            <ArrowRightOutlined />
          </span>
        </Button>
      </div>
      </div>
    </div>
  );
};

export default DataCollectionForm;
