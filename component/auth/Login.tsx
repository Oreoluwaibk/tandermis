"use client"
import React from 'react'
import Container from '../Container'
import { App, Button, Form, Input } from 'antd'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login, loginAction } from '@/redux/action/auth';
import { createErrorMessage } from '@/utils/errorInstance';
import { useAppDispatch } from '@/hook';

const FormItem = Form.Item;
const Login = () => {
    const router = useRouter();
    const { modal } = App.useApp();
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const [ loading, setLoading ] = React.useState(false);

    const handleSubmit = async () => {
        const { validateFields } = form;
        validateFields()
        .then(values => {
            //  router.push('/form')
            setLoading(true);
            login(values)
            .then((res) => {
                if(res.status === 200) {
                    setLoading(false);
                    modal.success({
                        title: "Success",
                        content: res.data.message || "Login successful!",
                        onOk: () => {
                            setLoading(false);
                            dispatch(loginAction(res.data))
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
  return (
    <Container padding={30}>
      <div className='w-full'>
        <p className='text-[#121212] text-[28px] font-semibold text-center'>Sign In with Email</p>
        <p className='text-base text-[#4F4F4F] text-center'>Login to your account to see your saved and</p>
        <p className='text-base text-[#4F4F4F] text-center'>recorded information </p>


        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
        >
            <FormItem className='py-0! my-2!' name="email" label="Email Address" rules={[{ required: true, message: 'Please enter your email address' }]}>
                <Input className='h-11!' placeholder='Email email address' />
            </FormItem>

            <FormItem 
                className='py-0! my-2!' 
                name="password" 
                label="Password" 
                rules={[{ required: true, message: 'Please enter your password' }]}
                >
                <Input.Password className='h-11!' placeholder='Enter your password' />
            </FormItem>
            <p className='text-base text-right mt-0 mb-4'><Link href="/auth/forgot-password" className='text-[#121212]! font-semibold'>Forgot Password</Link></p>


            <FormItem>
                <Button 
                    type="primary"
                    htmlType='submit'
                    className="text-white text-lg! w-full rounded-[40px]! h-14!"
                    loading={loading}
                >
                    Enter the Research
                </Button>
            </FormItem>

            <p className='text-base'>Don’t have an account? <Link href="/auth/signup" className='text-[#121212]! font-semibold'>Sign up</Link></p>
        </Form>
      </div>
    </Container>
  )
}

export default Login