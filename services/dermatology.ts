import {
  CaseFormData,
  FeedbackData,
  ModelDiagnosisResult,
  ReviewerFeedbackPayload,
} from "@/component/dashboard/types";
import axiosInstance from "@/utils/axiosConfig";
import { lesionImageToBase64 } from "@/utils/imageToBase64";
import { RcFile } from "antd/es/upload";

export interface ModelDiagnosisPayload {
  image: string;
  age: string;
  sex: string;
  lesion_duration: string;
  body_part: string;
  itch: string;
  associated_symptoms?: string;
  additional_information?: string;
  fitzpatrick_skin_type: string;
}

export interface ModelDiagnosisAccepted {
  id: number;
  status: "processing";
  message: string;
}

export type DiagnosisStatusResponse =
  | { status: "processing" }
  | ({ status: "completed" } & ModelDiagnosisResult)
  | { status: "failed"; error: string };

export const POLL_INTERVAL_MS = 3000;

export const buildDiagnosisPayload = async (
  formData: CaseFormData
): Promise<ModelDiagnosisPayload> => ({
  image: await lesionImageToBase64(formData.lesionImage as RcFile),
  age: `${formData.patientAge} ${formData.patientAgeUnit}`,
  sex: formData.patientSex,
  lesion_duration: `${formData.lesionDuration} ${formData.lesionDurationUnit}`,
  body_part: formData.lesionLocation,
  itch: formData.isLesionItchy,
  associated_symptoms: formData.associatedSymptoms || undefined,
  additional_information: formData.additionalInformation || undefined,
  fitzpatrick_skin_type: formData.fitzpatrickSkinType,
});

export const submitModelDiagnosis = (payload: ModelDiagnosisPayload) =>
  axiosInstance.post<ModelDiagnosisAccepted>(
    "/api/dermatology/model-diagnosis",
    payload
  );

export const getDiagnosisStatus = (datasetId: number) =>
  axiosInstance.get<DiagnosisStatusResponse>(
    `/api/dermatology/model-diagnosis/status/${datasetId}`
  );

export const pollDiagnosisStatus = (
  datasetId: number,
  onUpdate: (response: DiagnosisStatusResponse) => void,
  intervalMs = POLL_INTERVAL_MS
) => {
  let stopped = false;

  const poll = async () => {
    if (stopped) return;
    try {
      const { data } = await getDiagnosisStatus(datasetId);
      onUpdate(data);
      if (data.status === "processing") {
        setTimeout(poll, intervalMs);
      }
    } catch {
      if (!stopped) {
        onUpdate({ status: "failed", error: "Unable to fetch diagnosis status." });
      }
    }
  };

  poll();

  return () => {
    stopped = true;
  };
};

export const buildReviewerFeedbackPayload = (
  datasetId: number,
  feedback: FeedbackData,
  diagnosis: ModelDiagnosisResult
): ReviewerFeedbackPayload => {
  const correct_diagnosis =
    feedback.diagnosisCorrect === "Yes"
      ? diagnosis.most_likely_diagnosis
      : feedback.correctDiagnosis.trim();

  const correct_differential_diagnoses =
    feedback.differentialsCorrect === "Yes"
      ? diagnosis.differential_diagnoses.map((item) => item.name).join(", ")
      : feedback.correctDifferentials.trim();

  return {
    id: datasetId,
    correct_diagnosis,
    correct_differential_diagnoses,
    reviewer_comment: feedback.comments.trim() || undefined,
    is_model_next_steps_in_management_correct:
      feedback.managementCorrect === "Yes",
  };
};

export interface ReviewerFeedbackResponse {
  message?: string;
  status?: string;
}

export const submitReviewerFeedback = (payload: ReviewerFeedbackPayload) =>
  axiosInstance.post<ReviewerFeedbackResponse>(
    "/api/dermatology/reviewer-feedback",
    payload
  );
