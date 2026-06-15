import { Upload } from 'antd'
import { RcFile } from 'antd/es/upload';
import Image from 'next/image'
import React from 'react'

interface props {
  title: string;
  value: string | RcFile;
  setValue: React.Dispatch<React.SetStateAction<RcFile | string>>;
  showDelete?: boolean;
  variant?: "default" | "dashboard";
}
const UploadImage = ({ title, value, setValue, showDelete, variant = "default" }: props) => {
  const handleUpload = (file: RcFile) => {
    setValue(file);
    if (typeof value !== "string" && value) {
      URL.revokeObjectURL(value as unknown as string);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("");
  };

  const isDashboard = variant === "dashboard";
  const uploadClass = isDashboard
    ? "dashboard-upload flex flex-col items-center justify-center border border-dashed border-[#C4C4C4] rounded-[20px] md:rounded-[24px] cursor-pointer h-[120px] md:h-[150px] w-full font-sans! bg-[rgba(196,196,196,0.25)]!"
    : "flex flex-col items-center justify-center border-2 border-dashed border-[#2F2F2F] rounded-3xl cursor-pointer h-[174px] w-full font-sans! bg-bgUpload!";

  return (
    <div className={`flex flex-col items-center gap-3 font-sans! ${isDashboard ? "w-full" : "bg-bgUpload!"}`}>
      <div className='relative w-full'>
      <Upload 
        className={uploadClass}
        style={{ display: "flex"}}
        accept=".jpg, .png, .jpeg, .heic"
        beforeUpload={handleUpload}
        showUploadList={false}
      >
        {value && 
          <img
          src={
            typeof value === "string"
              ? value
              : value instanceof Blob
              ? URL.createObjectURL(value)
              : ""
          }
          alt="Preview"
          className={`w-full object-cover object-center ${isDashboard ? "min-h-[120px] max-h-[200px] rounded-[20px] md:min-h-[150px] md:max-h-[250px] md:rounded-[24px]" : "min-h-[174px] max-h-[350px] rounded-3xl"}`}
        />}
        {!value && <>
          <Image src="/img.svg" alt='upload img' width={isDashboard ? 36 : 45} height={isDashboard ? 28 : 36} />
          <p className='text-xs md:text-sm'><span className="underline text-[#1C43BB] pb-1">Choose image</span> or drag & drop image</p>
          <p className='text-[10px] text-[#767676] md:text-xs'>PNG, JPEG, HIEC (max size 10mb)</p>
        </>}
       
      </Upload>
      {showDelete && value && (
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-[#DC1111] hover:bg-white shadow-sm"
          aria-label={`Remove ${title}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
          </svg>
        </button>
      )}
      </div>
      <p className='text-[#4F4F4F] text-xs md:text-sm'>{title}</p>
    </div>
    
  )
}

export default UploadImage