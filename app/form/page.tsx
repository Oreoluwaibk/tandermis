"use client"
import CloseModal from '@/component/CloseModal';
import LesionProperties from '@/component/form/LesionProperties';
import PersonalData from '@/component/form/PersonalData';
import ProgressBar from '@/component/ProgressBar';
import RoundBtn from '@/component/RoundBtn';
import { IPersonalData, skinLesionOptions, SkinOptions } from '@/savedInfo';
import { ArrowLeftOutlined, ArrowRightOutlined, CloseOutlined } from '@ant-design/icons';
import { App, Card, Form, Select } from 'antd'
import { RcFile } from 'antd/es/upload';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const FormItem = Form.Item;
const titleArray = ["Personal Data", "Lesion attributes", "Diagnosis"];
const Option = Select.Option;
const Page = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [ steps, setSteps ] = React.useState<number>(0);
  const [ title, setTitle ] = React.useState<string>("Personal Data");
  const [ age, setAge ] = useState<string | number | null>(null);
  const [ ageType, setAgeType ] = useState("months")
  const [ duration, setDuration ] = useState<string | number | null>(null);
  const [ durationType, setDurationType ] = useState("months");

  const [ personalInfo, setPersonalInfo ] = useState<IPersonalData>({
    lesion_duration: "",
    patient_age: "",
    lesion_location: "",
    fitzpatrick_skin_type: 1,
    front_view_path: "",
    side_view_path: "",
    clinical_diagnosis: ""
  });
  const [ frontImage, setFrontImage ] = useState<RcFile | string>("");
  const [ backImage, setBackImage ] = useState<RcFile | string>("");
  const [ index, setIndex ] = useState<number>(0); 
  const [lesionProperties, setLesionProperties] = useState<SkinOptions>({
    macule: null,
    patch: null,
    papule: null,
    plaque: null,
    nodule: null,
    cyst: null,
    pustule: null,
    vesicle: null,
    bullae: null,
    exudative: null,
    abscess: null,
    telangiectasia: null,
    purpura_petechiae: null,
    hyperpigmentation: null,
    hypopigmentation: null,
    scale: null,
    crust: null,
    excoriation: null,
    erythema: null,
    blue: null,
    black: null,
    gray: null,
    orange: null,
    purple: null,
    yellow: null,
    fissure: null,
    erosion: null,
    ulcer: null,
    scar: null,
    atrophy: null,
    friable: null,
    lichenification: null,
    flat_topped: null,
    dome_shaped: null,
    acuminate: null,
    umbilicated: null,
    pedunculated: null,
    warty_papilloma: null,
    exophytic: null,
    induration: null,
    poikiloderma: null,
    burrow: null,
    comedo: null,
    wheal: null,
    solitary: null,
    itch: null,
  });

  const [ progess, setProgress ] = useState<number>(0);
  const [ openModal, setOpenModal ] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dermaFormProgress");
    if (saved) {
      const data = JSON.parse(saved);

      setSteps(data.step || 0);
      setIndex(data.index || 0);
      setTitle(titleArray[data.step || 0])
      setPersonalInfo(data.personalInfo || {});
      setLesionProperties(data.lesionProperties || {});
      setAge(data.personalInfo?.patient_age?.split(" ")[0] || "");
      setAgeType(data.personalInfo?.patient_age?.split(" ")[1] || "months");
      setDuration(data.personalInfo?.lesion_duration?.split(" ")[0] || "");
      setDurationType(data.personalInfo?.lesion_duration?.split(" ")[1] || "months");
      setFrontImage(data.personalInfo?.front_view_path || "");
      setBackImage(data.personalInfo?.side_view_path || "");
    }
  }, []);

  const renderSteps = () => {
    switch (steps) {
      case 0:
        return (
          <PersonalData 
            form={form}
            age={age}
            ageType={ageType}
            setAge={setAge}
            setAgeType={setAgeType}
            duration={duration}
            durationType={durationType}
            setDuration={setDuration}
            setDurationType={setDurationType}
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
            frontImage={frontImage}
            backImage={backImage}
            setFrontImage={setFrontImage}
            setBackImage={setBackImage} 
          />
        );

      case 1:
        return (
          <LesionProperties 
            index={index}
            lesionProperties={lesionProperties}
            setLesionProperties={setLesionProperties}
            goToNext={() => handleStepForTwo(index + 1)}
          />
        );

      case 2:
        return (
          <div className='md:px-[400px]'>
            <p className="text-[#121212] text-base text-center mb-6">
              What is your clinical diagnosis?
            </p>

            <FormItem label="" className='mt-6' name="clinical_diagnosis">
              <Select 
                placeholder="Choose clinical diagnosis"
                showSearch
                optionFilterProp="children"
                onChange={(value) => setPersonalInfo(prev => ({...prev, clinical_diagnosis: value}))}
              >
                {/* populate options here */}

                <Option >Acquired Angioedema Due to C1 Inhibitor Deficiency</Option>
                <Option>Allergic Contact Dermatitis</Option>
                <Option>Angioedema</Option>
                <Option>Atopic Dermatitis</Option>
                <Option>Cholinergic Urticaria</Option>

              </Select>
            </FormItem>
          </div>
        );

      default:
        return <></>;
    }
  };

  useEffect(() => {
    const totalSteps = skinLesionOptions.length + 2; 
    const currentStep = index + 1 + (steps === 0 ? 0 : 1); 
    setProgress(Math.round((currentStep / totalSteps) * 100));
  }, [index, steps]);

  const handleSteps = (step: number) => {
    
    if (step >= titleArray.length - 1) return;
    if (step === 1) {
      if (!handleValidation(1)) return;
      handleStepForTwo(index + 1);
      return;
    }
    if (!handleValidation(step)) return;

    const nextStep = step + 1;
    setSteps(nextStep);
    setTitle(titleArray[nextStep]);
    localStorage.setItem(
      "dermaFormProgress",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("dermaFormProgress") || "{}"),
        step: nextStep,
        title: titleArray[nextStep],
      })
    );
  };

  const handleBack = (step: number) => {
    if (steps === 1 && index > 0) {
      setIndex(index - 1);
      return;
    }
    if (step === 0) return;

    const prevStep = step - 1;
    setSteps(prevStep);
    setTitle(titleArray[prevStep]);
    localStorage.setItem(
      "dermaFormProgress",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("dermaFormProgress") || "{}"),
        step: prevStep,
        title: titleArray[prevStep],
      })
    );
  };

  const handleStepForTwo = (newIndex: number) => {
    if (newIndex >= skinLesionOptions.length) {
      if (!handleValidation(1)) return;

      const nextStep = steps + 1;
      setSteps(nextStep);
      setTitle(titleArray[nextStep]);
      localStorage.setItem(
        "dermaFormProgress",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("dermaFormProgress") || "{}"),
          step: nextStep,
          title: titleArray[nextStep],
          index: index,
        })
      );

      return;
    }

    setIndex(newIndex);
    localStorage.setItem(
      "dermaFormProgress",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("dermaFormProgress") || "{}"),
        index: newIndex,
      })
    );
  };

  

  const handleValidation = (step: number) => {
    switch (step) {
      case 0: {
        if (!age || !duration || !frontImage || !backImage) {
          message.error("Please complete all required fields before proceeding.");
          return false;
        }

        const updatedInfo = {
          ...personalInfo,
          patient_age: `${age} ${ageType}`,
          lesion_duration: `${duration} ${durationType}`,
          front_view_path: frontImage as string,
          side_view_path: backImage as string,
        };

        setPersonalInfo(updatedInfo!);

        // 💾 Save to localStorage
        localStorage.setItem(
          "dermaFormProgress",
          JSON.stringify({
            step,
            personalInfo: updatedInfo,
            lesionProperties,
          })
        );

        return true;
      }

      case 1: {
        const hasSelection = Object.values(lesionProperties).some(
          (val) => val === true || val === false
        );
        if (!hasSelection) {
          message.error("Please select 'Yes' or 'No' for at least one lesion property.");
          return false;
        }

        // 💾 Save to localStorage
        localStorage.setItem(
          "dermaFormProgress",
          JSON.stringify({
            step,
            personalInfo,
            lesionProperties,
          })
        );

        return true;
      }

      case 2: {
        if (!personalInfo.clinical_diagnosis) {
          message.error("Please select a clinical diagnosis.");
          return false;
        }

        // 💾 Final save to localStorage
        localStorage.setItem(
          "dermaFormProgress",
          JSON.stringify({
            step,
            personalInfo,
            lesionProperties,
          })
        );

        message.success("Progress saved successfully!");
        return true;
      }

      default:
        return true;
    }
  };

  return (
    <Card 
      className='font-sans! pt-[50px]! md:pt-0!  min-h-screen' 
      classNames={{ body: "relative md:p-5! px-0! min-h-[75vh] flex flex-col  justify-center"}}
      actions={[
        <div className='flex justify-between items-center mt-8 px-6 '>
          <RoundBtn 
            onClick={() => handleBack(steps)}
            title='Back'
            width={117}
            icon={<ArrowLeftOutlined />}
            type='default'
            back
            className={`${steps === 0 ? 'opacity-0' : 'opacity-100'}`}
          />

          <div className='fixed left-0 right-0 flex justify-center top-0 md:static w-full'>
            <ProgressBar 
              title={title}
              percentage={progess}
            />
          </div>

          <RoundBtn 
            onClick={() => handleSteps(steps)}
            title={steps === 2 ? "Finish" :'Next'}
            width={117}
            icon={<ArrowRightOutlined />}
          />
        </div>
      ]}
    >
      
      <div className='flex flex-col items-center md:gap-4 gap-2 relative! mt-4'>
        <p className='md:text-2xl text-xl font-medium'>Data Collection Form</p>
        <div className='text-center md:text-base text-xs'>
          <p className='text-[#4F4F4F]'>We're building a next-generation AI system trained to identify skin</p>
          <p className='text-[#4F4F4F]'>conditions early and accurately. </p>
        </div>
      </div>

      <div className='md:hidden block absolute left-5 top-11'>
        <ArrowLeftOutlined onClick={() => setOpenModal(true)} className="cursor-pointer" />
      </div>
      <div className='absolute right-0 top-0 md:block hidden'>
         <RoundBtn 
          onClick={() => setOpenModal(true)}
          title='Close'
          width={117}
          icon={<CloseOutlined />}
          type='default'
          back
          className="absolute top-6! right-6!"
        />
      </div>

      <Card className='rounded-[40px]! md:mt-0 mt-8!' classNames={{ body: "!mx-0 md:m-4 md:p-5! p-2!" }} title={<p className='text-pri font-medium text-center md:text-left text-lg'>{title}</p>}>
        <Form layout="vertical" form={form} className='font-sans!'>
          {renderSteps()}
        </Form>
      </Card>

      {openModal && <CloseModal 
        open={openModal} 
        onCancel={() => setOpenModal(false)} 
        onClick={() => router.back()}
      />}
    </Card>
  )
}

export default Page