"use client";

import { Button } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

const SubscriptionGate = () => {
  const router = useRouter();

  return (
    <div className="flex w-full max-w-[560px] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-semibold text-[#121212] md:text-[28px]">
        Subscription required
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[#4F4F4F] md:text-base">
        A valid subscription or free trial is needed to use Tandermis for
        diagnosis. Review the plans and continue.
      </p>
      <Button
        type="primary"
        className="mt-8 h-14! min-w-[240px] rounded-[40px]! text-lg!"
        onClick={() => router.push("/pricing")}
      >
        View plans
      </Button>
    </div>
  );
};

export default SubscriptionGate;
