'use client'
import type { FormProps } from 'antd';
import { Button, Checkbox, DatePicker, Form, Input } from 'antd';
import http from '../utils/http';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import {Select} from 'antd'
import { useEffect, useState } from 'react';
type FieldType = {
    name?:string;
    email?: string;
    password?: string;
    dateOfBirth?: Date;
    province?: string;
    district?:string;
    ward?:string;
    phonenumber?: string;
};

export default function Singup() {
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
    })
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
            dateOfBirth: values.dateOfBirth?.toISOString(),
            email: values.email,
            password: values.password,
            name: values.name,
            phonenumber: values.phonenumber,
            address: `${selectedProvince}, ${selectedDistrict}, ${selectedWard}`
        }
        try {
            const data = await http.postWithAutoRefreshToken(`signup`, body, {useAccessToken:false});
            console.log(data);
            router.push('/login');
        }
        catch (e) {
            if (e instanceof AxiosError){
                switch (e.response?.status){
                    case 422: {
                        console.log(e);
                        break
                    }
                    case 409: {
                        alert("Tai khoan da ton tai")
                    }
                }
            }
        }
    };
      
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

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
            <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[{ type:"email", required: true, message: 'Please input your username!' }]}
            >
                    <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!'}, {pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, message: "It nhat 8 ky tu, 1 chu cai in hoa, 1 chu cai in thuong, 1 so, 1 ky tu dac biet"}]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item<FieldType>
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name' }, {pattern: /[\p{L}\s]*$/, message: "Ten khong hop le"}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item<FieldType>
                label="Phonenumber"
                name="phonenumber"
                rules={[{ required: true, message: 'Please input your phonenumber' }, {pattern: /\d{10}/, message: "So dien thoai khong hop le"}]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Date of Birth"
                name="dateOfBirth"
                rules={[{ required: true, message: 'Please input your !' }]}
            >
                <DatePicker></DatePicker>
            </Form.Item>
            <Form.Item<FieldType>
                label="Province"
                name="province"
                rules={[{ required: true, message: 'Please input your !' }]}
            >
                {/* City */}
                <Select onChange={(value) => getDistrict(value)}>
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
                label="District"
                name="district"
                rules={[{ required: true, message: 'Please input your !' }]}
            >
                {/* District */}
                <Select onChange={(value) => getWards(value)}>
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
                label="Ward"
                name="ward"
                rules={[{ required: true, message: 'Please input your !' }]}
            >
                {/* Ward */}
                <Select onChange={(value) => setSelectedWard(value)}>
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
                    Submit
            </Button>
            </Form.Item>
    </Form>
        </>
    )
}