"use client";

import RoundBtn from "@/component/RoundBtn";
import { ArrowRightOutlined } from "@ant-design/icons";
import React from "react";

interface JoinResearchLandingProps {
  onJoinClick: () => void;
  onViewPlans?: () => void;
  loading?: boolean;
}

const JoinResearchLanding = ({
  onJoinClick,
  onViewPlans,
  loading,
}: JoinResearchLandingProps) => (
  <div className="linear-background relative flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-no-repeat font-sans">
    <img
      src="/bgc.svg"
      className="fit-object absolute top-[12%] z-0 h-5/6 w-full! overflow-hidden md:top-8 md:h-full"
      alt="Background"
    />

    <p className="absolute top-6 z-10 text-center text-2xl font-extrabold text-[#121212]">
      Tandermis
    </p>

    <main className="no-blur z-10 flex flex-col items-center justify-center gap-6 px-4 text-center md:px-70">
      <p className="text-sx text-[#4F4F4F] md:text-base">
        Trusted by certified dermatologists · HIPAA-compliant · Research use only
      </p>
      <p className="text-[28px] font-semibold uppercase text-[#121212] md:text-[40px]">
        Join the Future of Dermatology. Help AI Detect Skin Diseases with
        Precision!
      </p>
      <p className="text-sx mb-6 text-[#4F4F4F] md:text-base">
        We&apos;re building a next-generation AI system trained to identify skin
        conditions early and accurately. Your medical expertise and verified
        image data can help save lives through better diagnostics.
      </p>
      <div className="flex flex-col items-center gap-3">
        <RoundBtn
          title="Join the Research"
          type="primary"
          icon={<ArrowRightOutlined />}
          onClick={onJoinClick}
          loading={loading}
        />
        {onViewPlans && (
          <button
            type="button"
            onClick={onViewPlans}
            className="text-sm font-semibold text-[#121212] underline underline-offset-4 md:text-base"
          >
            View plans and pricing
          </button>
        )}
      </div>
    </main>
  </div>
);

export default JoinResearchLanding;
