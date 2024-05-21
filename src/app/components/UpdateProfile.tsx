'use client'
import type { FormProps } from 'antd';
import { Button, Checkbox, DatePicker, Form, Input } from 'antd';
import http from '../utils/http';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import {Select} from 'antd'
import { useEffect, useState } from 'react';
import CustomerInterface from '../interfaces/CustomerInterface';
import dayjs from 'dayjs';
type FieldType = {
    name?:string;
    // email?: string;
    dateOfBirth?: Date;
    province?: string;
    district?:string;
    ward?:string;
    phonenumber?: string;
};

export default function UpdateProfile({customerInfo, setUpdatedProfile}: {customerInfo: CustomerInterface, setUpdatedProfile: any}) {
    const [cities, setCities] = useState<any>()
    const [districts, setDistricts] = useState<any>();
    const [wards, setWards] = useState<any>();
    const [selectedProvince, setSelectedProvince] = useState<string>();
    const [selectedDistrict, setSelectedDistrict] = useState<string>();
    const [selectedWard, setSelectedWard] = useState<string>()
    const router = useRouter();
    useEffect(() => {
        axios.get("https://vapi.vnappmob.com/api/province/")
        .then((response) => {
            setCities([...response.data.results])
        })
        .catch((e) => {
            console.log(e);
        })
    }, []);
    const getDistrict =  async (province_id:string) => {
        if (province_id) {
            const [provinceId, provinceName] = province_id.split('&')
            const response = await axios.get(`https://vapi.vnappmob.com/api/province/district/${provinceId}`);
            setSelectedProvince(curr => provinceName)
            setDistricts([...response.data.results])
        }
    }
    const getWards = async (distric_id: string) => {
        if (distric_id) {
            const [districId, districtName] = distric_id.split('&')
            const response = await axios.get(`https://vapi.vnappmob.com/api/province/ward/${districId}`)
            console.log(response);
            setWards([...response.data.results])
            setSelectedDistrict(curr => districtName);
        }
    }
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values.dateOfBirth?.toISOString());
        console.log(values);
        const body = {
            dateOfBirth: values.dateOfBirth?.toISOString() || new Date(customerInfo.dateOfBirth).toISOString(),
            // email: values.email,
            name: values.name || customerInfo.name,
            phonenumber: values.phonenumber || customerInfo.phone,
            address: `${selectedProvince}, ${selectedDistrict}, ${selectedWard}`
        }
        console.log(customerInfo);
        if (body.address.includes("undefined")){
            body.address = customerInfo.address;
        }
        
        setUpdatedProfile({...body})
        // try {
        //     const data = await http.postWithAutoRefreshToken(`signup`, body, {useAccessToken:false});
        //     console.log(data);
        //     router.push('/login');
        // }
        // catch (e) {
        //     if (e instanceof AxiosError){
        //         switch (e.response?.status){
        //             case 422: {
        //                 console.log(e);
        //                 break
        //             }
        //             case 409: {
        //                 alert("Tai khoan da ton tai")
        //             }
        //         }
        //     }
        // }
    };
      
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    console.log(customerInfo.address.split(', ')[0])
    return (
        <>
            <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
            >
            {/* <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[{ type:"email", required: true, message: 'Please input your username!' }]}
            >
                    <Input defaultValue={customerInfo.email}/>
            </Form.Item> */}

            <Form.Item<FieldType>
                label="Tên"
                name="name"
                rules={[{pattern: /[\p{L}\s]*$/, message: "Ten khong hop le"}]}
            >
                <Input defaultValue={customerInfo.name}/>
            </Form.Item>
            <Form.Item<FieldType>
                label="Số điện thoại"
                name="phonenumber"
                rules={[{pattern: /\d{10}/, message: "So dien thoai khong hop le"}]}
            >
                <Input defaultValue={customerInfo.phone}/>
            </Form.Item>
            <Form.Item<FieldType>
                label="Ngày sinh"
                name="dateOfBirth"
                // rules={[{ required: true, message: 'Please input your !' }]}
            >
                <DatePicker defaultValue={(dayjs(customerInfo.dateOfBirth))}></DatePicker>
            </Form.Item>

            <Form.Item<FieldType>
                label="Tỉnh"
                name="province"
                // rules={[{ required: true, message: 'Please input your !' }]}
            >
                {/* City */}
                <Select onChange={(value) => getDistrict(value)} defaultValue={customerInfo.address.split(', ')[0]}>
                    {!(cities) || cities.map((city:any) => {
                        return (
                            <Select.Option value= {`${city.province_id}&${city.province_name}`} key={city.province_id}>
                                {city.province_name}
                            </Select.Option>
                        )
                    })}
                </Select>
            </Form.Item>
            <Form.Item<FieldType>
                label="Quận"
                name="district"
                // rules={[{ required: true, message: 'Please input your !' }]}
            >
                {/* District */}
                <Select onChange={(value) => getWards(value)} defaultValue={customerInfo.address.split(', ')[1]}>
                    {!(districts) || districts.map((district:any) => {
                        return (
                            <Select.Option value= {`${district.district_id}&${district.district_name}`} key={district.district_id}>
                                {district.district_name}
                            </Select.Option>
                        )
                    })}
                </Select>
            </Form.Item>
            <Form.Item<FieldType>
                label="Phường/huyện"
                name="ward"
                // rules={[{ required: true, message: 'Please input your !' }]}
            >
                {/* Ward */}
                <Select onChange={(value) => setSelectedWard(value)} defaultValue={customerInfo.address.split(', ')[2]}>
                    {!(wards) || wards.map((ward:any) => {
                        return (
                            <Select.Option value= {`${ward.ward_name}`} key={ward.ward_id}>
                                {ward.ward_name}
                            </Select.Option>
                        )
                    })}
                </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
                    Xác nhận
            </Button>
            </Form.Item>
        </Form>
        </>
    )
}