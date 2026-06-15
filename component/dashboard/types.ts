import { RcFile } from "antd/es/upload";

export type DashboardView = "form" | "processing" | "result" | "feedback-success";

export interface CaseFormData {
  lesionLocation: string;
  patientAge: string | number | null;
  patientAgeUnit: string;
  lesionDuration: string | number | null;
  lesionDurationUnit: string;
  fitzpatrickSkinType: string;
  erythematous: string;
  clinicalDiagnosis: string;
  frontImage: RcFile | string;
  sideImage: RcFile | string;
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
  lesionDuration: null,
  lesionDurationUnit: "months",
  fitzpatrickSkinType: "",
  erythematous: "",
  clinicalDiagnosis: "",
  frontImage: "",
  sideImage: "",
});

export const clinicalDiagnosisOptions = [
  "Acquired Angioedema Due to C1 Inhibitor Deficiency",
  "Allergic Contact Dermatitis",
  "Angioedema",
  "Atopic Dermatitis",
  "Cholinergic Urticaria",
  "Melanoma",
  "Basal Cell Carcinoma",
  "Seborrheic Keratosis",
  "Psoriasis",
  "Eczema",
];

export const fitzpatrickLabels: Record<string, string> = {
  I: "Very Fair",
  II: "Fair",
  III: "Medium",
  IV: "Olive",
  V: "Brown",
  VI: "Dark",
};
