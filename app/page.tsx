"use client"
import RoundBtn from "@/component/RoundBtn";
import Image from "next/image";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hook";
import { useTransition } from "react";

export default function Home() {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [ isPending, startTransition ] = useTransition();
  const router = useRouter();

  const handleRedirect = () => {
    if(isAuthenticated) {
      startTransition(() => {
        router.push('/form');
      })
    }else {
      startTransition(() => {
        router.push('/auth/login');
      })
    }
  }
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

  <main className="no-blur flex md:px-70 flex-col items-center justify-center text-center z-10 gap-6">
    <p className="text-[#4F4F4F] text-sx md:text-base">
      Trusted by certified dermatologists · HIPAA-compliant · Research use only
    </p>
    <p className="text-[28px] md:text-[40px] text-[#121212] font-semibold uppercase">
      Join the Future of Dermatology. Help AI Detect Skin Diseases with Precision!
    </p>
    <p className="text-[#4F4F4F] text-sx md:text-base mb-6">
      We’re building a next-generation AI system trained to identify skin conditions early and accurately. Your medical expertise and verified image data can help save lives through better diagnostics.
    </p>
    <RoundBtn
      title="Join the Research"
      type="primary"
      icon={<ArrowRightOutlined />}
      onClick={handleRedirect}
      loading={isPending}
    />
  </main>
</div>

  );
}
