"use client";

import DashboardSidebar from "@/component/dashboard/DashboardSidebar";
import DataCollectionForm from "@/component/dashboard/DataCollectionForm";
import DiagnosisFeedback from "@/component/dashboard/DiagnosisFeedback";
import DiagnosisResultCard from "@/component/dashboard/DiagnosisResultCard";
import FeedbackSuccess from "@/component/dashboard/FeedbackSuccess";
import LogoutModal from "@/component/dashboard/LogoutModal";
import ProcessingBadge from "@/component/dashboard/ProcessingBadge";
import RatingSuccess from "@/component/dashboard/RatingSuccess";
import ResponseRating from "@/component/dashboard/ResponseRating";
import ResultViewLayout from "@/component/dashboard/ResultViewLayout";
import {
  CaseFormData,
  DashboardView,
  emptyFormData,
  emptyFeedbackData,
  FeedbackData,
  HistoryCase,
  ModelDiagnosisResult,
  ResponseRating as ResponseRatingType,
} from "@/component/dashboard/types";
import { useAppDispatch, useAppSelector } from "@/hook";
import { apiLogout } from "@/redux/action/auth";
import { logoutUser, selectedRefresh } from "@/redux/reducer/auth/auth";
import {
  buildDiagnosisPayload,
  buildReviewerFeedbackPayload,
  pollDiagnosisStatus,
  submitModelDiagnosis,
  submitUserRating,
  submitReviewerFeedback,
} from "@/services/dermatology";
import { createErrorMessage } from "@/utils/errorInstance";
import { MenuOutlined } from "@ant-design/icons";
import { App, Button } from "antd";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

export type DermatologyFlowMode = "research" | "general";

const STORAGE_KEYS = {
  research: {
    history: "tandermis_dashboard_history",
    casesCount: "tandermis_cases_count",
  },
  general: {
    history: "tandermis_dermatology_history",
    casesCount: "tandermis_dermatology_cases_count",
  },
} as const;

const PROCESSING_NOTICE_MS = 90_000;
const PROCESSING_COUNTDOWN_SECONDS = 90;

const formatCaseLabel = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

interface DermatologyFlowPageProps {
  mode: DermatologyFlowMode;
}

const DermatologyFlowPage = ({ mode }: DermatologyFlowPageProps) => {
  const isResearch = mode === "research";
  const { history: historyKey, casesCount: casesCountKey } = STORAGE_KEYS[mode];

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { modal } = App.useApp();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const refreshToken = useAppSelector(selectedRefresh);

  const [view, setView] = useState<DashboardView>("form");
  const [formData, setFormData] = useState<CaseFormData>(emptyFormData());
  const [feedback, setFeedback] = useState<FeedbackData>(emptyFeedbackData());
  const [history, setHistory] = useState<HistoryCase[]>([]);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [activeDiagnosis, setActiveDiagnosis] = useState<
    ModelDiagnosisResult | undefined
  >();
  const [totalCases, setTotalCases] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [selectedRating, setSelectedRating] =
    useState<ResponseRatingType | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [processingCountdown, setProcessingCountdown] = useState(
    PROCESSING_COUNTDOWN_SECONDS
  );
  const [processingDelayed, setProcessingDelayed] = useState(false);

  const stopPollingRef = useRef<(() => void) | null>(null);
  const historyRef = useRef(history);
  historyRef.current = history;

  const loadHistory = useCallback((): HistoryCase[] => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(historyKey) || "[]");
    } catch {
      return [];
    }
  }, [historyKey]);

  const saveHistory = useCallback(
    (items: HistoryCase[]) => {
      localStorage.setItem(historyKey, JSON.stringify(items));
    },
    [historyKey]
  );

  useEffect(() => {
    setHistory(loadHistory());
    const count = parseInt(localStorage.getItem(casesCountKey) || "0", 10);
    setTotalCases(count);
  }, [loadHistory, casesCountKey]);

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth/login");
  }, [isAuthenticated, router]);

  useEffect(
    () => () => {
      stopPollingRef.current?.();
    },
    []
  );

  useEffect(() => {
    if (view !== "processing" || !activeCaseId) {
      setProcessingCountdown(PROCESSING_COUNTDOWN_SECONDS);
      setProcessingDelayed(false);
      return;
    }

    const activeCase = history.find((h) => h.id === activeCaseId);
    const startedAt = activeCase?.processingStartedAt ?? Date.now();

    const tick = () => {
      const elapsed = Date.now() - startedAt;
      const remainingMs = PROCESSING_NOTICE_MS - elapsed;

      if (remainingMs <= 0) {
        setProcessingDelayed(true);
        setProcessingCountdown(0);
        return;
      }

      setProcessingDelayed(false);
      setProcessingCountdown(Math.ceil(remainingMs / 1000));
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [view, activeCaseId, history]);

  const updateFormData = useCallback((partial: Partial<CaseFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleNewCase = () => {
    stopPollingRef.current?.();
    setFormData(emptyFormData());
    setFeedback(emptyFeedbackData());
    setSelectedRating(null);
    setActiveCaseId(null);
    setActiveDiagnosis(undefined);
    setProcessingCountdown(PROCESSING_COUNTDOWN_SECONDS);
    setProcessingDelayed(false);
    setView("form");
  };

  const startPolling = useCallback(
    (datasetId: number, caseId: string) => {
      stopPollingRef.current?.();
      stopPollingRef.current = pollDiagnosisStatus(datasetId, (data) => {
        if (data.status === "processing") return;

        if (data.status === "completed") {
          const { status: _, ...diagnosis } = data;
          const completedHistory = historyRef.current.map((h) =>
            h.id === caseId
              ? { ...h, status: "completed" as const, diagnosis }
              : h
          );
          setHistory(completedHistory);
          saveHistory(completedHistory);
          setActiveDiagnosis(diagnosis);
          setFeedback(emptyFeedbackData());
          setSelectedRating(null);
          setTotalCases((prev) => {
            const count = prev + 1;
            localStorage.setItem(casesCountKey, String(count));
            return count;
          });
          setView("result");
          setSubmitting(false);
          stopPollingRef.current?.();
          return;
        }

        const failedHistory = historyRef.current.map((h) =>
          h.id === caseId
            ? {
                ...h,
                status: "failed" as const,
                error: data.error || "Background execution error",
              }
            : h
        );
        setHistory(failedHistory);
        saveHistory(failedHistory);
        modal.error({
          title: "Diagnosis failed",
          content: data.error || "Background execution error",
        });
        setView("form");
        setActiveCaseId(null);
        setSubmitting(false);
        stopPollingRef.current?.();
      });
    },
    [casesCountKey, modal, saveHistory]
  );

  const handleSelectCase = (id: string) => {
    const selected = history.find((h) => h.id === id);
    if (!selected) return;
    setActiveCaseId(id);
    setFormData(selected.formData);
    setActiveDiagnosis(selected.diagnosis);
    setFeedback(emptyFeedbackData());
    setSelectedRating(selected.responseRating ?? null);

    if (selected.status === "processing") {
      setView("processing");
      if (selected.datasetId) {
        startPolling(selected.datasetId, id);
      }
    } else if (selected.status === "failed") {
      modal.error({
        title: "Diagnosis failed",
        content: selected.error || "Background execution error",
      });
      setView("form");
    } else if (isResearch && selected.feedbackSubmitted) {
      setView("feedback-success");
    } else if (!isResearch && selected.ratingSubmitted) {
      setView("rating-success");
    } else {
      setView("result");
    }
  };

  const handleDeleteCase = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    saveHistory(updated);
    if (activeCaseId === id) handleNewCase();
  };

  const handleGetDiagnosis = async () => {
    const caseId = crypto.randomUUID();
    const label = formatCaseLabel(new Date());
    const processingStartedAt = Date.now();
    const newCase: HistoryCase = {
      id: caseId,
      date: new Date().toISOString(),
      label,
      formData: { ...formData },
      status: "processing",
      processingStartedAt,
    };

    const updatedHistory = [newCase, ...history];
    setHistory(updatedHistory);
    saveHistory(updatedHistory);
    setActiveCaseId(caseId);
    setActiveDiagnosis(undefined);
    setProcessingCountdown(PROCESSING_COUNTDOWN_SECONDS);
    setProcessingDelayed(false);
    setView("processing");
    setSubmitting(true);

    try {
      const payload = await buildDiagnosisPayload(formData, {
        includeFitzpatrick: isResearch,
      });
      const res = await submitModelDiagnosis(payload);

      if (res.status === 202) {
        const datasetId = res.data.id;
        const withDatasetId = updatedHistory.map((h) =>
          h.id === caseId ? { ...h, datasetId } : h
        );
        setHistory(withDatasetId);
        saveHistory(withDatasetId);
        startPolling(datasetId, caseId);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown }; message?: string };
      modal.error({
        title: "Error",
        content: error?.response
          ? createErrorMessage(error.response.data)
          : error.message,
      });
      const reverted = updatedHistory.filter((h) => h.id !== caseId);
      setHistory(reverted);
      saveHistory(reverted);
      setActiveCaseId(null);
      setView("form");
      setSubmitting(false);
    }
  };

  const handleSubmitFeedback = async () => {
    const activeCase = history.find((h) => h.id === activeCaseId);
    const diagnosis = activeDiagnosis ?? activeCase?.diagnosis;
    const datasetId = activeCase?.datasetId ?? diagnosis?.id;

    if (!datasetId || !diagnosis) {
      modal.error({
        title: "Unable to submit feedback",
        content: "Missing diagnosis data for this case. Please try again.",
      });
      return;
    }

    setFeedbackLoading(true);
    try {
      const payload = buildReviewerFeedbackPayload(
        datasetId,
        feedback,
        diagnosis
      );
      const res = await submitReviewerFeedback(payload);

      if (res.status === 200 || res.status === 201 || res.status === 202) {
        const updatedHistory = history.map((h) =>
          h.id === activeCaseId ? { ...h, feedbackSubmitted: true } : h
        );
        setHistory(updatedHistory);
        saveHistory(updatedHistory);
        setView("feedback-success");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown }; message?: string };
      modal.error({
        title: "Feedback submission failed",
        content: error?.response
          ? createErrorMessage(error.response.data)
          : error.message,
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleSubmitRating = async (rating: ResponseRatingType) => {
    const activeCase = history.find((h) => h.id === activeCaseId);
    const diagnosis = activeDiagnosis ?? activeCase?.diagnosis;
    const datasetId = activeCase?.datasetId ?? diagnosis?.id;

    if (!datasetId) {
      modal.error({
        title: "Unable to submit rating",
        content: "Missing diagnosis data for this case. Please try again.",
      });
      return;
    }

    setSelectedRating(rating);
    setRatingLoading(true);
    try {
      const res = await submitUserRating({
        id: datasetId,
        user_rating: rating === "up" ? 1 : 0,
      });

      if (res.status === 200 || res.status === 201 || res.status === 202) {
        const updatedHistory = history.map((h) =>
          h.id === activeCaseId
            ? { ...h, ratingSubmitted: true, responseRating: rating }
            : h
        );
        setHistory(updatedHistory);
        saveHistory(updatedHistory);
        setView("rating-success");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown }; message?: string };
      modal.error({
        title: "Rating submission failed",
        content: error?.response
          ? createErrorMessage(error.response.data)
          : error.message,
      });
    } finally {
      setRatingLoading(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      if (refreshToken) {
        await apiLogout(refreshToken);
      }
    } catch {
      // Still clear local session if logout API fails
    }
    dispatch(logoutUser());
    setLogoutLoading(false);
    setLogoutOpen(false);
    router.push("/auth/login");
  };

  const renderMainContent = () => {
    if (view === "form") {
      return (
        <DataCollectionForm
          formData={formData}
          onChange={updateFormData}
          onSubmit={handleGetDiagnosis}
          loading={submitting}
          variant={mode}
        />
      );
    }

    if (view === "processing") {
      return (
        <ResultViewLayout formData={formData}>
          <ProcessingBadge
            secondsRemaining={processingCountdown}
            delayed={processingDelayed}
          />
        </ResultViewLayout>
      );
    }

    if (view === "result") {
      return (
        <ResultViewLayout formData={formData}>
          <DiagnosisResultCard
            totalCases={totalCases}
            diagnosis={activeDiagnosis}
          />
          {isResearch ? (
            <DiagnosisFeedback
              feedback={feedback}
              onChange={(partial) =>
                setFeedback((prev) => ({ ...prev, ...partial }))
              }
              onSubmit={handleSubmitFeedback}
              loading={feedbackLoading}
            />
          ) : (
            <ResponseRating
              onRate={handleSubmitRating}
              loading={ratingLoading}
              selected={selectedRating}
            />
          )}
        </ResultViewLayout>
      );
    }

    if (view === "feedback-success") {
      return (
        <ResultViewLayout formData={formData}>
          <DiagnosisResultCard
            totalCases={totalCases}
            diagnosis={activeDiagnosis}
          />
          <FeedbackSuccess onSubmitAnother={handleNewCase} />
        </ResultViewLayout>
      );
    }

    if (view === "rating-success") {
      return (
        <ResultViewLayout formData={formData}>
          <DiagnosisResultCard
            totalCases={totalCases}
            diagnosis={activeDiagnosis}
          />
          <RatingSuccess onSubmitAnother={handleNewCase} />
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
        <div className="shrink-0 px-4 pt-4 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <Button
              type="text"
              icon={<MenuOutlined className="text-lg!" />}
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center"
              aria-label="Open menu"
            />
            <span className="text-lg font-extrabold text-[#121212]">
              Tandermis
            </span>
            <span className="h-10 w-10" aria-hidden />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-6 md:px-12 md:pb-10 md:pt-8">
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

export default DermatologyFlowPage;
