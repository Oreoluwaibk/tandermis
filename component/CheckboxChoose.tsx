import { Radio } from 'antd'
import React from 'react'

interface props {
    title: string;
    value: boolean;
    onClick: () => void;
}
const CheckboxChoose = ({ title, value, onClick }: props) => {
  return (
    <div 
        className='border flex cursor-pointer items-center justify-between h-11 min-w-[156px] rounded-[40px] px-4' 
        style={{ 
            borderColor: value ? "#4F4F4F" : "#C4C4C4",
            backgroundColor: value ? "#F0F3FF" : "#fff"
        }}
        onClick={onClick}
    >
        <span className='text-[#121212] text-sm'>{title}</span>
        <Radio value={value} checked={value} />
    </div>
  )
}

export default CheckboxChoose