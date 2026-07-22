"use client";

import { ResponseRating as ResponseRatingType } from "./types";
import { DislikeOutlined, LikeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

interface ResponseRatingProps {
  onRate: (rating: ResponseRatingType) => void;
  loading?: boolean;
  selected?: ResponseRatingType | null;
}

const ResponseRating = ({
  onRate,
  loading,
  selected,
}: ResponseRatingProps) => (
  <div className="dashboard-form w-full rounded-[20px] bg-[#F7F7F8] p-4 md:rounded-[24px] md:p-6">
    <h3 className="text-base font-semibold text-[#121212] md:text-lg">
      How was this response?
    </h3>
    <p className="mb-5 mt-1 text-xs text-[#4F4F4F] md:mb-6 md:text-sm">
      Your rating helps us improve Tandermis for clinicians.
    </p>

    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        size="large"
        loading={loading && selected === "up"}
        disabled={loading}
        onClick={() => onRate("up")}
        className={`h-14! flex-1 rounded-[40px]! text-base! ${
          selected === "up"
            ? "border-[#121212]! bg-[#121212]! text-white!"
            : "border-[#C4C4C4]! bg-white! text-[#121212]!"
        }`}
        icon={<LikeOutlined />}
      >
        Good response
      </Button>
      <Button
        size="large"
        loading={loading && selected === "down"}
        disabled={loading}
        onClick={() => onRate("down")}
        className={`h-14! flex-1 rounded-[40px]! text-base! ${
          selected === "down"
            ? "border-[#DC1111]! bg-[#DC1111]! text-white!"
            : "border-[#C4C4C4]! bg-white! text-[#121212]!"
        }`}
        icon={<DislikeOutlined />}
      >
        Bad response
      </Button>
    </div>
  </div>
);

export default ResponseRating;
