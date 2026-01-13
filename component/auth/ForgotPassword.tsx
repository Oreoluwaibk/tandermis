"use client"
import React from 'react'
import Container from '../Container'
import { App, Button, Form, Input } from 'antd';
import { useAppDispatch } from '@/hook';
import Link from 'next/link';
import { createErrorMessage } from '@/utils/errorInstance';
import { changePassword } from '@/redux/action/auth';
import Image from 'next/image';

const FormItem = Form.Item;
const ForgotPassword = () => {
  const { modal } = App.useApp();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [ loading, setLoading ] = React.useState(false);
  const [ successful, setSuccessful ] = React.useState(false);
  const [ isPending, startTransition ] = React.useTransition();
  const [ email, setEmail ] = React.useState('');
  

  const handleSubmit = () => {
    const { validateFields } = form;
    validateFields()
    .then(values => {
        //  router.push('/form')
        
        setLoading(true);
        changePassword(values)
        .then((res) => {
          if(res.status === 200) {
            setLoading(false);
            modal.success({
              title: "Success",
              content: res.data.message || "Reset mail has been sent successfully!",
              onOk: () => {
                setLoading(false);
                setSuccessful(true);
              },
            });
          }
        })
        .catch(err => {
            setLoading(false);
            modal.error({
                title: "Error",
                content: err?.response
                    ? createErrorMessage(err.response.data)
                    : err.message,
                onOk: () => setLoading(false),
            });
        })
    })
  }

  const handlePost = () => {
      
  }
  return (
  <Container padding={30}>
    {!successful && <div className='w-full'>
      <p className='text-[#121212] text-[28px] font-semibold text-center mb-2'>Reset password</p>
      <p className='text-base text-[#4F4F4F] text-center'>Forgot your password and can’t remember it? </p>
      <p className='text-base text-[#4F4F4F] text-center'>Enter your email address to reset your password</p>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
          <FormItem className='py-0! my-2!' name="email" label="Email Address" rules={[{ required: true, message: 'Please enter your email address' }]}>
              <Input className='h-11!' onChange={(e) => setEmail(e.target.value)} placeholder='Email email address' />
          </FormItem>


          <FormItem className='mt-4!'>
            <Button 
              type="primary"
              htmlType='submit'
              className="text-white text-lg! w-full rounded-[40px]! h-14!"
              loading={loading}
            >
              Reset your password
            </Button>
          </FormItem>

          <p className='text-base'>Remember your password?  <Link href="/auth/login" className='text-[#121212]! font-semibold'>Sign in</Link></p>
      </Form>
    </div>}
    
    {successful && (
      <div className='w-full'>
        <div className='flex items-center justify-center mb-5'>
          <Image src="/succes.svg" alt='success icon' width={100} height={100} />
        </div>
        <p className='text-[#121212] text-[28px] font-semibold text-center mb-0!'>Reset password link sent</p>
        <p className='text-base text-[#4F4F4F] text-center'>We sent a password reset link to your email address {email}. Click on the link to add new password</p>

        <Button 
          type="primary"
          className="text-white text-lg! w-full rounded-[40px]! h-14! mt-6"
          loading={isPending}
          onClick={() =>   window.location.href = `mailto:${email}`}
        >
          Open Mail App
        </Button>
      </div>
      )}  
  </Container>
  )
}

export default ForgotPassword