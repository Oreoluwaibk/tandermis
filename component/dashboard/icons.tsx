import React from "react";

export const Sparkles = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zm7 9l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zm-14 0l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
  </svg>
);

export const LoadingSpinner = () => (
  <svg
    className="animate-spin"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

export const LightbulbIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
  </svg>
);

export const SuccessCheck = () => (
  <div className="relative flex h-24 w-24 items-center justify-center">
    <div className="absolute inset-0">
      {[...Array(8)].map((_, i) => (
        <span
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{
            backgroundColor: ["#F7CFFD", "#B2FEED", "#EEE8FA", "#FFD6A5", "#FFADAD", "#CAFFBF", "#FDFFB6", "#9BF6FF"][i],
            top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 8)}%`,
            left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 8)}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#121212] text-white">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M5 13l4 4L19 7" />
      </svg>
    </div>
  </div>
);
