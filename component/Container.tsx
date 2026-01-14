""
import { useAppSelector } from '@/hook';
import { Divider } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

interface props {
    children: React.ReactNode;
    padding?: number;
    width?: string;
}
const Container: React.FC<props> = ({ children, padding = 70, width = `700px` }) => {
    const router = useRouter();
    const { isAuthenticated } = useAppSelector(state => state.auth);

    useEffect(() => {
        if(isAuthenticated) router.push("/form");
    }, [isAuthenticated])
  return (
    <div className="linear-background bg-cover bg-no-repeat min-h-screen w-full flex flex-col items-center justify-center font-sans relative">
        <img 
            src="/bgc.svg" 
            className="absolute fit-object h-5/6 top-[12%] md:h-full w-full! md:top-8 overflow-hidden z-0"
            alt="Background"
        />

        <p className="font-extrabold text-2xl text-[#121212] text-center absolute z-10 top-6">
            Tandermis
        </p>

        <main className={`w-full no-blur flex md:px-${padding} px-3! flex-col items-center justify-center text-center z-10 gap-6 md:pb-10`}>
            {children}
        </main>

        <footer className="w-full text-center absolute bottom-4 z-10 text-sm text-[#6F6F6F]">
            <Divider style={{ height: 1 }} />
            <p>*Tandermis keeps your data safe and secured. We do not</p>
            <p>share your data with any third party, it is use to train our Ai</p>
            <p>model alone*</p>
        </footer>
    </div>
  )
}

export default Container