import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Input, InputNumber, Select } from 'antd'
import React from 'react'

interface props {
    number?: boolean;
    value: string | number | null;
    setValue: React.Dispatch<React.SetStateAction<string | number | null>>;
    selectValue: string;
    setSelectValue: React.Dispatch<React.SetStateAction<string>>;
    placeHolder: string;
    className?: string;
}
const InputPicker = ({ 
    number,
    value,
    setValue,
    selectValue,
    setSelectValue,
    placeHolder,
    className = "",
}: props) => {
  return (
    <div className={`h-11 rounded-[40px] w-full border border-[#C4C4C4] flex items-center justify-between bg-white ${className}`}>
        {!number && <Input />}
        {number && (
            <InputNumber 
                style={{
                    border: "none", 
                    outline: "none", 
                    width: "75%",
                    backgroundColor: "transparent",
                    boxShadow: "none",
                }}
                controls={false}
                placeholder={placeHolder}
                value={value}
                onChange={setValue}
                min={0}
                className="dashboard-number-input"
            />
        )}
        <Select 
            suffixIcon={
                <span className='flex items-center gap-1.5 pr-1 text-[#2F2F2F] text-xs capitalize'>
                    {selectValue}
                    <span className='flex flex-col items-center gap-0.5 leading-none'>
                        <UpOutlined className='text-[8px]!' />
                        <DownOutlined className='text-[8px]!' />
                    </span>
                </span>
            }
            variant="borderless"
            style={{ width: "auto", minWidth: "88px" }}
            value={selectValue}
            className='selector-pri'
            onChange={setSelectValue}
        >
            <Select.Option value="days">days</Select.Option>
            <Select.Option value="weeks">weeks</Select.Option>
            <Select.Option value="months">months</Select.Option>
            <Select.Option value="years">years</Select.Option>
        </Select>
    </div>
  )
}

export default InputPicker