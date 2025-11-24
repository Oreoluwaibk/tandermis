import { Upload } from 'antd'
import { RcFile } from 'antd/es/upload';
import Image from 'next/image'
import React from 'react'

interface props {
  title: string;
  value: string | RcFile;
  setValue: React.Dispatch<React.SetStateAction<RcFile | string>>;
}
const UploadImage = ({ title, value, setValue }: props) => {
  const handleUpload = (file: RcFile) => {
    setValue(file);
    if (typeof value !== "string" && value) {
      URL.revokeObjectURL(value as unknown as string);
    }
  };

  console.log("fff", value, title);
  

  return (
    <div className='flex flex-col items-center gap-4  md:min-w-[475px] font-sans! bg-bgUpload!'>
      <Upload 
        className='flex flex-col items-center justify-center border-2 border-dashed border-[#2F2F2F] rounded-3xl cursor-pointer h-[174px] w-full font-sans! bg-bgUpload!'
        style={{ display: "flex"}}
        accept=".jpg, .png, .jpeg"
        beforeUpload={handleUpload}
        showUploadList={false}
      >
        {value && 
          <img
          src={
            typeof value === "string"
              ? value // already a URL (maybe from localStorage)
              : value instanceof Blob // ensure it's a Blob or File
              ? URL.createObjectURL(value)
              : ""
          }
          alt="Preview"
          className="min-h-[174px] max-h-[350px] w-full object-cover object-center rounded-lg"
        />}
        {!value && <>
          <Image src="/img.svg" alt='upload img' width={45} height={36 } />
          <p className='text-sm'><span className="underline text-[#1C43BB] pb-1">Choose image</span> or drag & drop image</p>
          <p className='text-xs text-[#767676]'>PNG, JPEG, HIEC (max size 10mb)</p>
        </>}
       
      </Upload>
      <p className='text-[#4F4F4F] text-sm'>{title}</p>
    </div>
    
  )
}

export default UploadImage