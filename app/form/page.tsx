"use client"
import CloseModal from '@/component/CloseModal';
import LesionProperties from '@/component/form/LesionProperties';
import PersonalData from '@/component/form/PersonalData';
import ProgressBar from '@/component/ProgressBar';
import RoundBtn from '@/component/RoundBtn';
import { useAppSelector } from '@/hook';
import { submitResponse } from '@/redux/action/auth';
import { IPersonalData, skinLesionOptions, SkinOptions } from '@/savedInfo';
import { toFormData } from '@/utils/converters';
import { createErrorMessage } from '@/utils/errorInstance';
import { getNickNames } from '@/utils/getNickname';
import { ArrowLeftOutlined, ArrowRightOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import { App, Button, Card, Divider, Form, Select } from 'antd'
import { RcFile } from 'antd/es/upload';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useTransition } from 'react'

const FormItem = Form.Item;
const titleArray = ["Personal Data", "Lesion attributes", "Diagnosis"];
const Option = Select.Option;
const Page = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { message, modal } = App.useApp();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
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
  const [ loading, setLoading ] = useState(false);
  const [ submitted, setSubmitted ] = useState(false);
  const [ isPending, startTransition ] = useTransition();

  useEffect(() => {
    if(!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated])

  useEffect(() => {
    const saved = localStorage.getItem("dermaFormProgress");
    if (saved) {
      const data = JSON.parse(saved);

      setSteps(data.step || 0);
      setIndex(data.index || 0);
      setTitle(titleArray[data.step || 0])
      setPersonalInfo(data.personalInfo || {});
      setLesionProperties(data.lesionProperties || {});
      // if(data.personalInfo?.patient_age) setAge(data.personalInfo?.patient_age?.split(" ")[0] || "");
      // setAgeType(data.personalInfo?.patient_age?.split(" ")[1] || "months");
      // setDuration(data.personalInfo?.lesion_duration?.split(" ")[0] || "");
      // setDurationType(data.personalInfo?.lesion_duration?.split(" ")[1] || "months");
      setFrontImage(data.personalInfo?.front_view_path || "");
      setBackImage(data.personalInfo?.side_view_path || "");
    }
  }, []);

  const resetFields = () => {
    setAge(null);
    setAgeType("months");
    setDuration(null);
    setDurationType("months");
    setPersonalInfo({
      lesion_duration: "",
      patient_age: "",
      lesion_location: "",
      fitzpatrick_skin_type: 1,
      front_view_path: "",
      side_view_path: "",
      clinical_diagnosis: ""
    })
    setFrontImage("");
    setBackImage("");
    form.resetFields();
  };

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
          <div className='md:px-[250px]'>
            <p className="text-[#121212] text-base text-center mb-6">
              What is your clinical diagnosis?
            </p>

            <FormItem label="" className='mt-6' name="clinical_diagnosis">
              <Select 
                placeholder="Choose clinical diagnosis"
                showSearch
                optionFilterProp="children"
                className='min-w-3/4'
                onChange={(value) => setPersonalInfo(prev => ({...prev, clinical_diagnosis: value}))}
              >
                {/* populate options here */}

                <Option value="Acquired Angioedema Due to C1 Inhibitor Deficiency">Acquired Angioedema Due to C1 Inhibitor Deficiency</Option>
                <Option value="Allergic Contact Dermatitis">Allergic Contact Dermatitis</Option>
                <Option value="Angioedema">Angioedema</Option>
                <Option value="Atopic Dermatitis">Atopic Dermatitis</Option>
                <Option value="Cholinergic Urticaria">Cholinergic Urticaria</Option>

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
    console.log("step", step, handleValidation(step));
    
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

    if(step === 2) {
      console.log("progress", JSON.parse(localStorage.getItem("dermaFormProgress") || ""))
    }
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
          patient_age: age, //`${age} ${ageType}`,
          lesion_duration: duration,//`${duration} ${durationType}`,
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
        console.log("is ussse");
        
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
        console.log("here ot there");
        
        message.success("Progress saved successfully!");
        handleSubmit({personalInfo, lesionProperties})
        return true;
      }

      default:
        return true;
    }
  };

  const handleSubmit = (value: any) => {
    const payload = {
      ...value.personalInfo,
      ...value.lesionProperties,
      patient_age_unit: ageType,
      lesion_duration_unit: durationType,
      front_view_path: frontImage,
      side_view_path: backImage,
    }

    const formData = toFormData(payload)
    setLoading(true)
    submitResponse(formData)
    .then((res) => {
      if(res.status === 200 || res.status === 201) {
        setLoading(false);
        modal.success({
          title: "Success",
          content: "Your submission is successful!",
          onOk: () => {
            setLoading(false);
            localStorage.removeItem("dermaFormProgress");
            setSubmitted(true);
            setSteps(0);
            setIndex(0);
            setTitle(titleArray[0]);
            resetFields();
            setProgress(0);
            // router.push("/");
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
  }

  if(!isAuthenticated) return null;
  return (
    <Card 
      className='font-sans! pt-[50px]! md:pt-0!  min-h-screen' 
      classNames={{ body: "relative md:p-5! px-0! min-h-[75vh] flex flex-col  justify-center", header: "md:pb-6! md:pt-8!"}}
      actions={[
        !submitted ? <div className='flex justify-between items-center mt-8 px-6 '>
          <RoundBtn 
            onClick={() => handleBack(steps)}
            title='Back'
            width={117}
            icon={<ArrowLeftOutlined />}
            type='default'
            back
            className={`${steps === 0 ? 'opacity-0' : 'opacity-100'}`}
          />

          <div className='fixed left-0 right-0 flex justify-center bottom-30 md:static w-full'>
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
            loading={loading}
          />
        </div> : (
        <footer className="w-full text-center  text-sm text-[#6F6F6F]">
          {/* <Divider style={{ height: 1 }} /> */}
          <p>*Tandermis keeps your data safe and secured. We do not</p>
          <p>share your data with any third party, it is use to train our Ai</p>
          <p>model alone*</p>
        </footer>
        )
      ]}
      title={<p className='text-[#121212] text-2xl font-extrabold'>Tandermis</p>}
      extra={
        <div className='flex items-center justify-center relative'>
          
          <div className='md:block hidden'>
            <RoundBtn 
              onClick={() => startTransition(() => router.push("/profile"))}
              title={user?.first_name + " " + user?.last_name}
              width={157}
              icon={<UserOutlined />}
              type='default'
              back
              loading={isPending}
              // className="absolute top-6! right-6!"
            />
          </div>

          <span onClick={() => startTransition(() => router.push("/profile"))} className='md:hidden text-[#1E1E1E] font-semibold text-lg h-10 w-10 rounded-full bg-[#F5D2FC] flex items-center justify-center'>{getNickNames("John Doe")}</span>
        </div>
      }
    >
      {!submitted && <>
        <div className='flex flex-col items-center md:gap-4 gap-2 relative! mt-4'>
          <p className='md:text-2xl text-xl font-medium'>Data Collection Form</p>
          <div className='text-center md:text-base text-xs'>
            <p className='text-[#4F4F4F]'>We're building a next-generation AI system trained to identify skin</p>
            <p className='text-[#4F4F4F]'>conditions early and accurately. </p>
          </div>
        </div>

        <Card className='rounded-[40px]! md:mx-20! md:mt-0 mt-8! bg-[#F5F5F5]!' classNames={{ body: "border-t border-t-[#C4C4C4]! !mx-0 md:m-4 md:p-5! p-2!" }} title={<p className='text-pri font-medium text-center md:text-left text-lg'>{title}</p>}>
          <Form layout="vertical" form={form} className='font-sans!'>
            {renderSteps()}
          </Form>
        </Card>
      </>}

      {submitted && (
        <div className='w-full flex flex-col items-center justify-center'>
            <div className='flex items-center justify-center mb-5'>
              <Image src="/succes.svg" alt='success icon' width={100} height={100} />
            </div>

            <div style={{ lineHeight: '1' }}>
              <p className='text-[#121212] text-[28px] font-semibold text-center mb-0!'>Patient data successfully </p>
              <p className='text-[#121212] text-[28px] font-semibold text-center mb-4'>submitted</p>
            </div>
            
            <p className='text-base text-[#4F4F4F] text-center'>Thank you for contributing to the training of</p>
            <p className='text-base text-[#4F4F4F] text-center'>Tandermis’ diagnostic AI.</p>
            <Button // 
              type="primary"
              className="text-white text-lg! w-full rounded-[40px]! h-14! mt-4 md:w-[405px]"
              // loading={isPending}
              onClick={() => setSubmitted(false)}
            >
                Submit Another Case
              </Button>
          </div>
      )}
     

      {openModal && <CloseModal 
        open={openModal} 
        onCancel={() => setOpenModal(false)} 
        onClick={() => router.push("/")}
      />}
    </Card>
  )
}

export default Page