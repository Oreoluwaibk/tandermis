"use client";

import InputPicker from "@/component/InputPicker";
import UploadImage from "@/component/UploadImage";
import { fitzpatrickType, partOfTheBody } from "@/savedInfo";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { RcFile } from "antd/es/upload";
import React from "react";
import { CaseFormData } from "./types";

const { Option } = Select;
const { TextArea } = Input;

interface DataCollectionFormProps {
  formData: CaseFormData;
  onChange: (data: Partial<CaseFormData>) => void;
  onSubmit: () => void;
  loading?: boolean;
  variant?: "research" | "general";
}

const fieldSelectProps = {
  className: "w-full dashboard-field-input",
  size: "large" as const,
};

const formItemClass = "mb-3! md:mb-4!";

const DataCollectionForm = ({
  formData,
  onChange,
  onSubmit,
  loading,
  variant = "research",
}: DataCollectionFormProps) => {
  const isGeneral = variant === "general";

  const isComplete =
    formData.lesionImage &&
    formData.lesionLocation &&
    formData.patientAge &&
    formData.patientSex &&
    formData.lesionDuration &&
    formData.isLesionItchy &&
    (isGeneral || formData.fitzpatrickSkinType);

  return (
    <div className="mx-auto w-full max-w-[860px]">
      <div className="mb-3 flex flex-col items-center gap-2 text-center md:mb-5">
        <h2 className="text-xl font-medium text-[#121212] md:text-[28px]">
          {isGeneral ? "Hi doc, tell me about the patient" : "Data Collection Form"}
        </h2>
        {!isGeneral && (
          <p className="max-w-[520px] text-xs leading-relaxed text-[#4F4F4F] md:text-base">
            We&apos;re building a next-generation AI system trained to identify
            skin conditions early and accurately.
          </p>
        )}
      </div>

      <div className="rounded-3xl border border-[#E0E0E0] bg-[#F5F5F5] md:rounded-[40px]">
        <div className="px-3 pt-3 md:px-6 md:pt-5">
          <p className="text-sm font-medium text-[#121212] md:text-lg">
            Patient Personal Data
          </p>
          <div className="my-2 border-t border-[#C4C4C4] md:my-3" />
        </div>

        <div className="px-3 pb-5 md:px-6 md:pb-6">
          <section className="mb-5 md:mb-6">
            <p className="text-sm font-medium text-[#121212] md:text-base">
              Patient Skin Lesion
            </p>
            <p className="mt-0.5 text-xs text-[#474747] md:text-sm">
              Upload a photograph of the skin lesion
            </p>
            <div className="mt-3 md:mt-4">
              <UploadImage
                variant="dashboard"
                title="Lesion Image"
                value={formData.lesionImage}
                setValue={(val) =>
                  onChange({ lesionImage: val as RcFile | string })
                }
                showDelete
              />
            </div>
          </section>

          <Form layout="vertical" className="dashboard-form font-sans!">
            <Row gutter={[16, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Which part of the body is the Lesion on?"
                    required
                    className={formItemClass}
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
                  <Form.Item
                    label="Age of patient"
                    required
                    className={formItemClass}
                  >
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
                    label="Sex of patient"
                    required
                    className={formItemClass}
                  >
                    <Select
                      {...fieldSelectProps}
                      placeholder="choose sex"
                      value={formData.patientSex || undefined}
                      onChange={(val) => onChange({ patientSex: val })}
                    >
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Duration of Lesion"
                    required
                    className={formItemClass}
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
                  {!isGeneral && (
                    <Form.Item
                      label="Fitzpatrick skin type"
                      required
                      className={formItemClass}
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
                  )}
                </Col>

                <Col xs={24} md={isGeneral ? 24 : 12}>
                  <Form.Item
                    label="Is lesion itchy?"
                    required
                    className={formItemClass}
                  >
                    <Select
                      {...fieldSelectProps}
                      placeholder="choose option"
                      value={formData.isLesionItchy || undefined}
                      onChange={(val) => onChange({ isLesionItchy: val })}
                    >
                      <Option value="Yes">Yes</Option>
                      <Option value="No">No</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <div className="my-4 border-t border-[#C4C4C4] md:my-5" />
                  <p className="mb-3 text-sm font-medium text-[#121212] md:mb-4 md:text-base">
                    Additional notes
                  </p>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Associated symptoms"
                    className={formItemClass}
                  >
                    <TextArea
                      placeholder="Describe associated symptoms"
                      rows={4}
                      value={formData.associatedSymptoms}
                      onChange={(e) =>
                        onChange({ associatedSymptoms: e.target.value })
                      }
                      className="dashboard-textarea rounded-[20px]! bg-white! p-3! md:rounded-3xl! md:p-4!"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Additional information" className="mb-0!">
                    <TextArea
                      placeholder="Add any additional information"
                      rows={4}
                      value={formData.additionalInformation}
                      onChange={(e) =>
                        onChange({ additionalInformation: e.target.value })
                      }
                      className="dashboard-textarea rounded-[20px]! bg-white! p-3! md:rounded-3xl! md:p-4!"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <div className="mt-5 flex justify-end md:mt-6">
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
    </div>
  );
};

export default DataCollectionForm;
