"use client";

import DashboardSidebar from "@/component/dashboard/DashboardSidebar";
import DataCollectionForm from "@/component/dashboard/DataCollectionForm";
import DiagnosisFeedback from "@/component/dashboard/DiagnosisFeedback";
import DiagnosisResultCard from "@/component/dashboard/DiagnosisResultCard";
import FeedbackSuccess from "@/component/dashboard/FeedbackSuccess";
import LogoutModal from "@/component/dashboard/LogoutModal";
import OpusBadge from "@/component/dashboard/OpusBadge";
import ProcessingBadge from "@/component/dashboard/ProcessingBadge";
import ResultViewLayout from "@/component/dashboard/ResultViewLayout";
import {
  CaseFormData,
  DashboardView,
  emptyFormData,
  emptyFeedbackData,
  FeedbackData,
  HistoryCase,
} from "@/component/dashboard/types";
import { useAppDispatch, useAppSelector } from "@/hook";
import { submitResponse } from "@/redux/action/auth";
import { logoutUser } from "@/redux/reducer/auth/auth";
import { toFormData } from "@/utils/converters";
import { createErrorMessage } from "@/utils/errorInstance";
import { App, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const HISTORY_KEY = "tandermis_dashboard_history";
const CASES_COUNT_KEY = "tandermis_cases_count";

const formatCaseLabel = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const loadHistory = (): HistoryCase[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveHistory = (history: HistoryCase[]) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

const DashboardPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { message, modal } = App.useApp();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [view, setView] = useState<DashboardView>("form");
  const [formData, setFormData] = useState<CaseFormData>(emptyFormData());
  const [feedback, setFeedback] = useState<FeedbackData>(emptyFeedbackData());
  const [history, setHistory] = useState<HistoryCase[]>([]);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [totalCases, setTotalCases] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
    const count = parseInt(localStorage.getItem(CASES_COUNT_KEY) || "0", 10);
    setTotalCases(count);
  }, []);

  useEffect(() => {
    // if (!isAuthenticated) router.push("/auth/login");
  }, [isAuthenticated, router]);

  const updateFormData = useCallback((partial: Partial<CaseFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleNewCase = () => {
    setFormData(emptyFormData());
    setFeedback(emptyFeedbackData());
    setActiveCaseId(null);
    setView("form");
  };

  const handleSelectCase = (id: string) => {
    const selected = history.find((h) => h.id === id);
    if (!selected) return;
    setActiveCaseId(id);
    setFormData(selected.formData);
    setView(selected.status === "processing" ? "processing" : "result");
  };

  const handleDeleteCase = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    saveHistory(updated);
    if (activeCaseId === id) handleNewCase();
  };

  const completeProcessing = useCallback(
    (caseId: string, historyList: HistoryCase[]) => {
      const completedHistory = historyList.map((h) =>
        h.id === caseId ? { ...h, status: "completed" as const } : h
      );
      setHistory(completedHistory);
      saveHistory(completedHistory);
      setTotalCases((prev) => {
        const count = prev + 1;
        localStorage.setItem(CASES_COUNT_KEY, String(count));
        return count;
      });
      setView("result");
      setSubmitting(false);
    },
    []
  );

  const handleGetDiagnosis = () => {
    const caseId = crypto.randomUUID();
    const label = formatCaseLabel(new Date());
    const newCase: HistoryCase = {
      id: caseId,
      date: new Date().toISOString(),
      label,
      formData: { ...formData },
      status: "processing",
    };

    const updatedHistory = [newCase, ...history];
    setHistory(updatedHistory);
    saveHistory(updatedHistory);
    setActiveCaseId(caseId);
    setView("processing");
    setSubmitting(true);

    const payload = {
      lesion_location: formData.lesionLocation,
      patient_age: formData.patientAge,
      patient_age_unit: formData.patientAgeUnit,
      patient_sex: formData.patientSex,
      lesion_duration: formData.lesionDuration,
      lesion_duration_unit: formData.lesionDurationUnit,
      fitzpatrick_skin_type: formData.fitzpatrickSkinType,
      itch: formData.isLesionItchy === "Yes",
      associated_symptoms: formData.associatedSymptoms,
      additional_information: formData.additionalInformation,
      front_view_path: formData.lesionImage,
    };

    const formDataPayload = toFormData(payload);

    const processingTimer = setTimeout(() => {
      completeProcessing(caseId, updatedHistory);
    }, 5000);

    // submitResponse(formDataPayload)
    //   .then((res) => {
    //     if (res.status === 200 || res.status === 201) {
    //       clearTimeout(processingTimer);
    //       completeProcessing(caseId, updatedHistory);
    //     }
    //   })
    //   .catch((err) => {
    //     clearTimeout(processingTimer);
    //     modal.error({
    //       title: "Error",
    //       content: err?.response
    //         ? createErrorMessage(err.response.data)
    //         : err.message,
    //     });
    //     setView("form");
    //     const reverted = updatedHistory.filter((h) => h.id !== caseId);
    //     setHistory(reverted);
    //     saveHistory(reverted);
    //     setActiveCaseId(null);
    //     setSubmitting(false);
    //   });
  };

  const handleSubmitFeedback = () => {
    setFeedbackLoading(true);
    setTimeout(() => {
      setFeedbackLoading(false);
      setView("feedback-success");
    }, 800);
  };

  const handleLogout = () => {
    setLogoutLoading(true);
    dispatch(logoutUser());
    setLogoutLoading(false);
    setLogoutOpen(false);
    router.push("/auth/login");
  };

  const renderMainContent = () => {
    if (view === "form") {
      return (
        <div className="mx-auto h-full max-w-[860px]">
          <DataCollectionForm
            formData={formData}
            onChange={updateFormData}
            onSubmit={handleGetDiagnosis}
            loading={submitting}
          />
        </div>
      );
    }

    if (view === "processing") {
      return (
        <ResultViewLayout formData={formData}>
          <ProcessingBadge />
        </ResultViewLayout>
      );
    }

    if (view === "result") {
      return (
        <ResultViewLayout formData={formData}>
          <DiagnosisResultCard totalCases={totalCases} />
          <DiagnosisFeedback
            feedback={feedback}
            onChange={(partial) =>
              setFeedback((prev) => ({ ...prev, ...partial }))
            }
            onSubmit={handleSubmitFeedback}
            loading={feedbackLoading}
          />
        </ResultViewLayout>
      );
    }

    if (view === "feedback-success") {
      return (
        <ResultViewLayout formData={formData}>
          <DiagnosisResultCard totalCases={totalCases} />
          <FeedbackSuccess onSubmitAnother={handleNewCase} />
        </ResultViewLayout>
      );
    }

    return null;
  };

  return (
    <div className="h-screen overflow-hidden bg-white font-sans">
      <DashboardSidebar
        user={user}
        history={history}
        activeCaseId={activeCaseId}
        onSelectCase={handleSelectCase}
        onNewCase={handleNewCase}
        onDeleteCase={handleDeleteCase}
        onLogoutClick={() => setLogoutOpen(true)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <main className="ml-0 flex h-screen flex-col overflow-hidden md:ml-[260px]">
        <div className="shrink-0 px-4 pt-4 md:px-12 md:pt-8">
          <div className="flex items-center justify-between gap-3">
            <Button
              type="text"
              icon={<MenuOutlined className="text-lg!" />}
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center md:hidden!"
              aria-label="Open menu"
            />
            <span className="text-lg font-extrabold text-[#121212] md:hidden">
              Tandermis
            </span>
            <div className="ml-auto">
              <OpusBadge />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-6 md:px-12 md:pb-10">
          {renderMainContent()}
        </div>
      </main>

      <LogoutModal
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        loading={logoutLoading}
      />
    </div>
  );
};

export default DashboardPage;
