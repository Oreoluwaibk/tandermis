import { Card, Progress } from 'antd';
import React from 'react'

interface props {
    title: string;
    percentage: number;
}
const ProgressBar = ({ title, percentage }: props) => {
  return (
    <Card 
      className='bg-[#FCFCFC] min-h-10 md:min-h-16 w-[95%] md:p-1! p-0! md:min-w-[571px] rounded-[60px]! font-sans!'
      classNames={{ body: '', header: "font-sans!" }}
    >
        <p>{title} – progress</p>

        <Progress percent={percentage} trailColor='#E6E6E6' strokeColor="#1C43BB" showInfo={false} />
    </Card>
  )
}

export default ProgressBar