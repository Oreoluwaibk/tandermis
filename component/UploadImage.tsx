import { Upload } from "antd";
import { RcFile } from "antd/es/upload";
import Image from "next/image";
import React, { useMemo } from "react";

interface props {
  title: string;
  value: string | RcFile;
  setValue: React.Dispatch<React.SetStateAction<RcFile | string>>;
  showDelete?: boolean;
  variant?: "default" | "dashboard";
}

const UploadImage = ({
  title,
  value,
  setValue,
  showDelete,
  variant = "default",
}: props) => {
  const previewSrc = useMemo(() => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (value instanceof Blob) return URL.createObjectURL(value);
    return "";
  }, [value]);

  React.useEffect(() => {
    if (!previewSrc || typeof value === "string") return;
    return () => URL.revokeObjectURL(previewSrc);
  }, [previewSrc, value]);

  const handleUpload = (file: RcFile) => {
    setValue(file);
    return false;
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("");
  };

  const isDashboard = variant === "dashboard";
  const boxHeight = isDashboard
    ? "h-[160px] sm:h-[180px] md:h-[220px]"
    : "h-[174px]";
  const boxRadius = isDashboard
    ? "rounded-[20px] md:rounded-[24px]"
    : "rounded-3xl";
  const uploadClass = isDashboard
    ? `dashboard-upload relative w-full overflow-hidden border border-dashed border-[#C4C4C4] ${boxRadius} ${boxHeight} cursor-pointer bg-[rgba(196,196,196,0.25)] font-sans!`
    : `flex flex-col items-center justify-center border-2 border-dashed border-[#2F2F2F] ${boxRadius} cursor-pointer ${boxHeight} w-full font-sans! bg-bgUpload!`;

  return (
    <div
      className={`flex flex-col items-center gap-3 font-sans! ${isDashboard ? "w-full" : "bg-bgUpload!"}`}
    >
      <div className="relative w-full">
        <Upload
          className={uploadClass}
          accept=".jpg, .png, .jpeg, .heic"
          beforeUpload={handleUpload}
          showUploadList={false}
        >
          {value ? (
            <img
              src={previewSrc}
              alt="Preview"
              className={`absolute inset-0 h-full w-full object-cover object-center ${boxRadius}`}
            />
          ) : (
            <div className="flex h-full min-h-[inherit] w-full flex-col items-center justify-center gap-1 px-4 py-6">
              <Image
                src="/img.svg"
                alt="upload img"
                width={isDashboard ? 36 : 45}
                height={isDashboard ? 28 : 36}
              />
              <p className="text-xs md:text-sm">
                <span className="pb-1 text-[#1C43BB] underline">
                  Choose image
                </span>{" "}
                or drag & drop image
              </p>
              <p className="text-[10px] text-[#767676] md:text-xs">
                PNG, JPEG, HIEC (max size 10mb)
              </p>
            </div>
          )}
        </Upload>
        {showDelete && value && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#DC1111] shadow-sm hover:bg-white"
            aria-label={`Remove ${title}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
            </svg>
          </button>
        )}
      </div>
      <p className="text-xs text-[#4F4F4F] md:text-sm">{title}</p>
    </div>
  );
};

export default UploadImage;
