"use client"
import { useAppDispatch, useAppSelector } from '@/hook'
import { getContributor } from '@/redux/action/auth'
import { logoutUser } from '@/redux/reducer/auth/auth'
import { createErrorMessage } from '@/utils/errorInstance'
import { getNickNames } from '@/utils/getNickname'
import { LogoutOutlined } from '@ant-design/icons'
import { App, Button, Card, Divider } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Page = () => {
    const { modal } = App.useApp();
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector(state => state.auth);
    const router = useRouter();
    const [ ispending, startTransition ] = React.useTransition();
    const [ loading, setLoading ] = React.useState(false);

    useEffect(() => {
        if(!isAuthenticated) router.push('/auth/login');
    }, [isAuthenticated]);

    // useEffect(() => {
    //     handleGetDetails();
    // }, [])

    const handleLogout = () => {
        startTransition(() => {
            dispatch(logoutUser());
            router.push('/auth/login');
        });
    }

    const handleAskLogout = () => {
        modal.confirm({
            title: 'Are you sure you want to log out?',
            content: 'You will be redirected to the login page.',   
            onOk: handleLogout
        });
    }

    // const handleGetDetails = () => {
    //     setLoading(true);
    //     getContributor()
    //     .then(res => {
    //         if(res.status === 200) {
    //             console.log("contributor details", res.data);
    //         }
    //     })
    //     .catch(err => {
    //         setLoading(false);
    //         modal.error({
    //             title: "Error",
    //             content: err?.response
    //                 ? createErrorMessage(err.response.data)
    //                 : err.message,
    //             onOk: () => setLoading(false),
    //         });
    //     })
    //     // dispatch(getContributorDetails());
    // }

    if(!isAuthenticated) return null;
  return (
    <Card
        actions={[
        <footer key={1} className="w-full text-center text-sm text-[#6F6F6F]">
          <p>*Tandermis keeps your data safe and secured. We do not</p>
          <p>share your data with any third party, it is use to train our Ai</p>
          <p>model alone*</p>
        </footer>
        ]}
        classNames={{ body: "h-full flex flex-col justify-between px-6 md:px-12 py-6 relative" }}
        className='h-[90vh]'
    >
        <div className='flex flex-col items-center justify-center gap-2 pt-6'>
        
            <div className='text-[#1E1E1E] font-semibold text-4xl h-18 w-18 rounded-full bg-[#F5D2FC] flex items-center justify-center'>{getNickNames(`${user?.first_name} ${user?.last_name}`)}</div>
             <p className='text-2xl font-medium text-center text-[#121212]'>{user?.first_name} {user?.last_name}</p> 
            <p className='text-BASE text-center text-[#4F4F4F]'>{user?.email}</p> 
            <Divider />
        </div>
       

        <div className='flex flex-col items-center justify-center gap-4 absolute bottom-10 left-0 right-0 mx-auto'>
            <div className='flex flex-col gap-4 mb-4'>
            <p className='text-base font-medium text-[#121212]'>Contribution Impact Card</p>
            <Button 
                // className='text-[#434343]! font-medium text-base md:w-[405px] w-full' 
                className="
                    md:w-[405px] w-full
                    font-medium text-base
                    border-0!
                    bg-linear-to-r!
                    from-[#F7D0FC]!
                    to-[#B2FEED]!
                    hover:opacity-90!
                    text-[#434343]!
                "
                type="primary">
                    <span className='text-black'>42</span> 
                    Patient Cases Contributed 
            </Button>
            <p className='text-xs text-[#4F4F4F]'>Your contributions directly improve Tandermis’ diagnostic accuracy.</p>
            </div>
            
            <Button loading={ispending || loading} className='text-[#DC1111]! border-[#DC1111]! text-lg! md:w-[405px] w-full' onClick={handleAskLogout} type="default">Log out <LogoutOutlined className='text-[#DC1111]!' /></Button>
        </div>
    </Card>
  )
}

export default Page