"use client"
import React from 'react'
import Container from '../Container'
import { App, Button, Form, Input } from 'antd'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login, loginAction, registerUser } from '@/redux/action/auth';
import { createErrorMessage } from '@/utils/errorInstance';
import { useAppDispatch } from '@/hook';

const FormItem = Form.Item;
const Signup = () => {
    const router = useRouter();
    const { modal } = App.useApp();
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const [ loading, setLoading ] = React.useState(false);

    const handleSubmit = async () => {
        const { validateFields } = form;
        validateFields()
        .then(values => {
            setLoading(true);
            registerUser(values)
            .then((res) => {
                if(res.status === 201) {
                    setLoading(false);
                    modal.success({
                        title: "Success",
                        content: res.data.message || "Signup successful!",
                        onOk: () => {
                            setLoading(false);
                            dispatch(loginAction(res.data.data))
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
        // Submission logic here
        // router.push('/form')
    }
  return (
    <Container padding={30}>
      <div className='w-full'>
        <p className='text-[#121212] text-[28px] font-semibold text-center'>Sign Up with Email</p>
        <p className='text-base text-[#4F4F4F] text-center'>Register your email address to save and</p>
        <p className='text-base text-[#4F4F4F] text-center'>record your data information</p>


        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
        >
            <FormItem className='py-0! my-2!' name="first_name" label="First Name" rules={[{ required: true, message: 'Please enter your first name' }]}>
                <Input className='h-11!' placeholder='Enter first name' />
            </FormItem>

             <FormItem className='py-0! my-2!' name="last_name" label="Last Name" rules={[{ required: true, message: 'Please enter your last name' }]}>
                <Input className='h-11!' placeholder='Enter last name' />
            </FormItem>
            
            <FormItem className='py-0! my-2!' name="email" label="Email Address" rules={[{ required: true, message: 'Please enter your email address' }]}>
                <Input className='h-11!' placeholder='Email email address' />
            </FormItem>

            <FormItem 
                className='py-0! my-2! mb-6!' 
                name="password" 
                label="Password" 
                rules={[
                    { required: true, message: "Please enter your password!" },
                    { min: 8, message: "Password must be at least 8 characters long!" },
                    {
                        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/,
                        message: "Password must contain letters and numbers.",
                    },
                ]}
                hasFeedback
                >
                <Input.Password className='h-11!' placeholder='Enter your password' />
            </FormItem>
            {/* <p className='text-base text-right mt-0 mb-4'><Link href="/auth/forgot-password" className='text-[#121212]! font-semibold'>Sign in</Link></p> */}


            <FormItem>
                <Button 
                    type="primary"
                    htmlType='submit'
                    className="text-white text-lg! w-full rounded-[40px]! h-14!"
                    loading={loading}
                >
                    Register
                </Button>
            </FormItem>

            <p className='text-base'>Already have an account? <Link href="/auth/login" className='text-[#121212]! font-semibold'>Sign in</Link></p>
        </Form>
      </div>
    </Container>
  )
}

export default Signup