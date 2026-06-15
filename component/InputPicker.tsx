import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Input, InputNumber, Select } from "antd";
import React from "react";

interface props {
  number?: boolean;
  value: string | number | null;
  setValue: React.Dispatch<React.SetStateAction<string | number | null>>;
  selectValue: string;
  setSelectValue: React.Dispatch<React.SetStateAction<string>>;
  placeHolder: string;
  className?: string;
}

const unitChevrons = (
  <span className="flex flex-col items-center gap-0.5 leading-none text-[#2F2F2F]">
    <UpOutlined className="text-[8px]!" />
    <DownOutlined className="text-[8px]!" />
  </span>
);

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
    <div
      className={`input-picker flex h-11 w-full items-center rounded-[40px] border border-[#C4C4C4] bg-white ${className}`}
    >
      {!number && <Input className="flex-1" />}
      {number && (
        <InputNumber
          style={{
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
          controls={false}
          placeholder={placeHolder}
          value={value}
          onChange={setValue}
          min={0}
          className="input-picker-number flex-1!"
        />
      )}

      <span className="mx-1 h-5 w-px shrink-0 bg-[#D9D9D9]" aria-hidden />

      <Select
        suffixIcon={unitChevrons}
        variant="borderless"
        value={selectValue}
        className="input-picker-unit shrink-0"
        popupMatchSelectWidth={false}
        onChange={setSelectValue}
      >
        <Select.Option value="days">days</Select.Option>
        <Select.Option value="weeks">weeks</Select.Option>
        <Select.Option value="months">months</Select.Option>
        <Select.Option value="years">years</Select.Option>
      </Select>
    </div>
  );
};

export default InputPicker;
