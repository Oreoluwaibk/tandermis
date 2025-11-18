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
}
const InputPicker = ({ 
    number,
    value,
    setValue,
    selectValue,
    setSelectValue,
    placeHolder 
}: props) => {
  return (
    <div className='h-11 rounded-[30px] w-full border border-[#C4C4C4] flex items-center justify-between'>
        {!number && <Input />}
        {number && (
            <InputNumber 
                style={{
                    border: "none", 
                    outline: "none", 
                    width: "80%",
                    backgroundColor: "transparent"
                }}
                placeholder='enter lesion duration'
                value={value}
                onChange={setValue}
                min={0}
            />
        )}
        <Select 
            suffixIcon={
                <span className='flex items-center gap-2 text-[#2F2F2F] text-xs'>{selectValue} 
                <span className='flex flex-col items-center gap-1'>
                    <UpOutlined className='text-[10px] text-[#2F2F2F]!' />
                    <DownOutlined className='text-[10px] text-[#2F2F2F]!' />
                </span>
                </span>
            }
            style={{border: "none", outline: "none", width: "20%"}}
            // className='flex'
            styles={{root: {border: "none", outline: "none"}}}
            value=""
            className='selector-pri'
            onChange={setSelectValue}
        >
            <Select.Option value="days">Day(s)</Select.Option>
            <Select.Option value="weeks">Week(s)</Select.Option>
            <Select.Option value="months">Month(s)</Select.Option>
            <Select.Option value="years">Year(s)</Select.Option>
        </Select>
    </div>
  )
}

export default InputPicker