import { RcFile } from "antd/es/upload";

export type DashboardView =
  | "form"
  | "processing"
  | "result"
  | "feedback-success"
  | "rating-success";

export type ResponseRating = "up" | "down";

export interface CaseFormData {
  lesionLocation: string;
  patientAge: string | number | null;
  patientAgeUnit: string;
  patientSex: string;
  lesionDuration: string | number | null;
  lesionDurationUnit: string;
  fitzpatrickSkinType: string;
  isLesionItchy: string;
  associatedSymptoms: string;
  additionalInformation: string;
  lesionImage: RcFile | string;
}

export interface DifferentialDiagnosis {
  name: string;
  reasoning: string;
}

export interface DiagnosisWithReasoning {
  name: string;
  reasoning: string;
}

export const normalizeMostLikelyDiagnosis = (
  value: DiagnosisWithReasoning | string
): DiagnosisWithReasoning =>
  typeof value === "string" ? { name: value, reasoning: "" } : value;

export interface ManagementStep {
  step_number: number;
  description: string;
  details: string[];
}

export interface ModelDiagnosisResult {
  id: number;
  most_likely_diagnosis: DiagnosisWithReasoning;
  differential_diagnoses: DifferentialDiagnosis[];
  next_steps_in_management: ManagementStep[];
  important_considerations: string[];
}

export interface HistoryCase {
  id: string;
  date: string;
  label: string;
  formData: CaseFormData;
  status: "processing" | "completed" | "failed";
  datasetId?: number;
  diagnosis?: ModelDiagnosisResult;
  error?: string;
  feedbackSubmitted?: boolean;
  ratingSubmitted?: boolean;
  responseRating?: ResponseRating;
  processingStartedAt?: number;
}

export interface ReviewerFeedbackPayload {
  id: number;
  correct_diagnosis: string;
  correct_differential_diagnoses: string[];
  reviewer_comment?: string;
  is_model_next_steps_in_management_correct: boolean;
}

export interface FeedbackData {
  diagnosisCorrect: string;
  differentialsCorrect: string;
  correctDiagnosis: string;
  correctDifferentials: string;
  managementCorrect: string;
  comments: string;
}

export const emptyFeedbackData = (): FeedbackData => ({
  diagnosisCorrect: "",
  differentialsCorrect: "",
  correctDiagnosis: "",
  correctDifferentials: "",
  managementCorrect: "",
  comments: "",
});

export const emptyFormData = (): CaseFormData => ({
  lesionLocation: "",
  patientAge: null,
  patientAgeUnit: "years",
  patientSex: "",
  lesionDuration: null,
  lesionDurationUnit: "months",
  fitzpatrickSkinType: "",
  isLesionItchy: "",
  associatedSymptoms: "",
  additionalInformation: "",
  lesionImage: "",
});

export const fitzpatrickLabels: Record<string, string> = {
  I: "Very Fair",
  II: "Fair",
  III: "Medium",
  IV: "Olive",
  V: "Brown",
  VI: "Dark",
};
