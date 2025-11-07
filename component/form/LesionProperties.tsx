import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import React from 'react'
import CheckboxChoose from '../CheckboxChoose'
import { skinLesionOptions, SkinOptions } from '@/savedInfo';

interface props {
    index: number;
    lesionProperties: any;
    setLesionProperties: React.Dispatch<React.SetStateAction<SkinOptions>>;
}
const LesionProperties = ({ index, lesionProperties, setLesionProperties }:props) => {
  return (
    <div>
    {skinLesionOptions.map((option, idx) => {
        if (idx !== index) return null;
        const key = option.title.toLowerCase().replace(/\s+/g, "");
        const currentValue = lesionProperties[key] ?? false;

        const handleSelection = (value: boolean) => {
            setLesionProperties((prev) => ({
                ...prev,
                [key]: value,
            }));
        };

        return (
        <div key={idx}>
            <p className="text-[#121212] text-base text-center">
                Does it have {option.title}{" "}
                <Tooltip
                    color="#F0F3FF"
                    className="ml-1"
                    classNames={{ body: "bg-[#F0F3FF]" }}
                    title={option.description}
                >
                    <QuestionCircleOutlined className="text-[#4F4F4F] cursor-pointer text-sm" />
                </Tooltip>
            </p>

            <div className="flex items-center justify-center gap-4 mt-6">
                <CheckboxChoose
                    onClick={() => handleSelection(true)}
                    title="Yes"
                    value={currentValue === true}
                />
                <CheckboxChoose
                    onClick={() => handleSelection(false)}
                    title="No"
                    value={currentValue === false}
                />
            </div>
        </div>
        );
    })}
    </div>
  )
}

export default LesionProperties