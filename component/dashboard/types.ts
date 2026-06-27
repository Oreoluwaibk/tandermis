import { RcFile } from "antd/es/upload";

export type DashboardView = "form" | "processing" | "result" | "feedback-success";

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

export interface HistoryCase {
  id: string;
  date: string;
  label: string;
  formData: CaseFormData;
  status: "processing" | "completed";
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
