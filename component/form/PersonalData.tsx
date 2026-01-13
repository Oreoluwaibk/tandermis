import { Col, DatePicker, Form, FormInstance, Row, Select } from 'antd';
import React, { useState } from 'react'
import UploadImage from '../UploadImage';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { fitzpatrickType, IPersonalData, partOfTheBody } from '@/savedInfo';
import InputPicker from '../InputPicker';
import { RcFile } from 'antd/es/upload';


const FormItem = Form.Item;
const titleArray = ["Personal Data", "Lesion attributes", "Diagnosis"];
const Option = Select.Option;

interface props {
    form: FormInstance<string>;
    number?: boolean;
    age: string | number | null;
    setAge: React.Dispatch<React.SetStateAction<string | number | null>>;
    ageType: string;
    setAgeType: React.Dispatch<React.SetStateAction<string>>;
    duration: string | number | null;
    setDuration: React.Dispatch<React.SetStateAction<string | number | null>>;
    durationType: string;
    setDurationType: React.Dispatch<React.SetStateAction<string>>;
    setPersonalInfo: React.Dispatch<React.SetStateAction<IPersonalData>>;
    personalInfo: IPersonalData;
    frontImage: RcFile | string;
    backImage: RcFile | string;
    setFrontImage: React.Dispatch<React.SetStateAction<RcFile | string>>;
    setBackImage: React.Dispatch<React.SetStateAction<RcFile | string>>;
}
const PersonalData = ({ 
    form,
    age,
    ageType,
    setAge,
    setAgeType,
    duration,
    durationType,
    setDuration,
    setDurationType,
    setPersonalInfo,
    personalInfo,
    frontImage,
    setFrontImage,
    backImage,
    setBackImage 
}: props) => {

  return (
    <div>
        <div className='flex flex-col gap-2 mb-4'>
          <p className='text-pri text-base'>Patient Skin Lesion</p>
          <p className="text-[#474747] text-sm">Upload a photograph of the skin lesion</p>
        </div>
        <Row gutter={[15, 15]}>
          <Col lg={12} sm={12} xs={24}>
            <FormItem  rules={[{required: true, message: "Upload a front image of the lesion"}]}>
                <UploadImage 
                  title='Front View of Lesion'
                  value={frontImage}
                  setValue={setFrontImage}
                />
            </FormItem>
          </Col>

          <Col lg={12} sm={12} xs={24}>
            <FormItem rules={[{required: true, message: "Upload a back view image of the lesion"}]}>
                <UploadImage 
                    title='Back View of Lesion'
                    value={backImage}
                    setValue={setBackImage}
                />
            </FormItem>
          </Col>

        <Col lg={12} sm={12} xs={24}>
        <FormItem name="lesion_location" rules={[{required: true}]} label="Which part of the body is the Lesion on?">
            <Select 
              value={personalInfo.lesion_location} 
              onChange={(value) => setPersonalInfo(prev => ({...prev, lesion_location: value}))} 
              placeholder="choose lesion body location">
            {partOfTheBody.map((bodyPart: string,i: number) => (
                <Option key={i} value={bodyPart}>{bodyPart}</Option>
            ))}
            </Select>
        </FormItem>
        </Col>

        <Col lg={12} sm={12} xs={24}>
        <FormItem label="Age of patient" rules={[{required: true}]} >
          <InputPicker 
            number
            value={age}
            setValue={setAge}
            selectValue={ageType}
            setSelectValue={setAgeType} 
            placeHolder='enter patient age'
          />
        </FormItem>
        </Col>

        <Col lg={12} sm={12} xs={24}>
            <FormItem  label="Duration of Lesion" rules={[{required: true}]} >
              <InputPicker 
                number
                value={duration}
                setValue={setDuration}
                selectValue={durationType}
                setSelectValue={setDurationType} 
                placeHolder='enter lesion duration'
              />
            </FormItem>
          </Col>

          <Col lg={12} sm={12} xs={24}>
            <FormItem name="fitzpatrick_skin_type" label="Fitzpatrick skin type" rules={[{required: true}]} >
              <Select value={personalInfo.fitzpatrick_skin_type} onChange={(value) => setPersonalInfo(prev => ({...prev, fitzpatrick_skin_type: value}))} placeholder="choose skin type">
                {fitzpatrickType.map((skinType: string,i: number) => (
                    <Option key={i} value={skinType}>{skinType}</Option>
                ))}
              </Select>
            </FormItem>
          </Col>
        </Row>
    </div>
  )
}

export default PersonalData