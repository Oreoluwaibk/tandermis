import { Button } from 'antd'
import React from 'react'

interface props {
  title: string;
  type?: "primary" | "default" | "dashed" | "text" | "link";
  icon?: React.ReactNode;
  onClick?: () => void;
  width?: string | number;
  back?: boolean;
  className?: string;
  submit?: boolean;
  bg?: string;
}
const RoundBtn = ({ 
  className, 
  title, 
  type = "primary", 
  icon, onClick, 
  width, 
  back, 
  submit,
  bg 
}: props) => {
  return (
    <Button htmlType={submit ? "submit" : "button"} icon={back && icon} type={type} style={{width: width || undefined, backgroundColor: bg || undefined}} className={`font-sans! ${className}`} onClick={onClick} >
      {title}
      {!back && icon} 
    </Button>
  )
}

export default RoundBtn