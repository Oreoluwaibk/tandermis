import React, { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { message } from 'antd';

type MaterialData = {
    id: number;
    title: string;  
}
const Tutorial = () => {
    const [ data, setData ] = useState<MaterialData[] | null>([]);
    const [ loading, setLoading ] = useState<boolean>(false);

    const handleGetMaterials = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await axios.get<MaterialData[]>('https://api.example.com/materials');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleGetMaterialsWithFetch = async (): Promise<void> => {
        setLoading(true);
        try {
            const response =  await fetch('https://api.example.com/materials');

            if(response.ok) {
                const data = await response.json() as MaterialData[];
                setData(data);
            }
        }catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            message.error(error.response?.data.message || error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }
  return (
    <div>Tutorial</div>
  )
}

export default Tutorial