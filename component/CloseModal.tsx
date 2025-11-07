import { Modal } from 'antd'
import React from 'react'
import RoundBtn from './RoundBtn';
import { CloseOutlined } from '@ant-design/icons';

interface props {
    open: boolean;
    onCancel: () => void;
    onClick: () => void
}
const CloseModal = ({ open, onCancel, onClick }: props) => {
  return (
    <Modal  
        open={open} 
        onCancel={onCancel}
        closeIcon={<RoundBtn 
            onClick={onCancel}
            title='Close'
            width={97}
            icon={<CloseOutlined />}
            type='default'
            back
            className="absolute top-6! right-6!"
        />}
       footer={<div className='flex items-center justify-center gap-4 md:gap-10'>
        <RoundBtn 
            onClick={onCancel}
            title='Continue inputting'
            width={191}
            type='default'
            back
            className="absolute top-6! right-6!"
        />
        <RoundBtn 
            onClick={onClick}
            title='End session'
            width={144}
            type='primary'
            back
            className="absolute top-6! right-6!"
            bg="#FF383C"
        />
       </div>}
       classNames={{ body: "pt-14!", footer: "py-4!" }}
    >
        <div className='flex flex-col gap-4 items-center'>
            <img src="/close.svg" alt="close icon " />
            <p className='text-xl font-medium'>Data inputted will be lost</p>
            <p className='text-base'>Your progress isn’t saved, closing the form now will result to all inputted data lost. Are you sure you want to end session?</p>
        </div>
    </Modal>
  )
}

export default CloseModal