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
  erythematous: string;
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
  managementCorrect: string;
  comments: string;
}

export const emptyFormData = (): CaseFormData => ({
  lesionLocation: "",
  patientAge: null,
  patientAgeUnit: "years",
  patientSex: "",
  lesionDuration: null,
  lesionDurationUnit: "months",
  fitzpatrickSkinType: "",
  erythematous: "",
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
