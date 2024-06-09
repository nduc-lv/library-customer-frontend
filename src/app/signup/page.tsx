'use client'
import type { FormProps } from 'antd';
import { Button, Checkbox, DatePicker, Form, Input } from 'antd';
import http from '../utils/http';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import {Select} from 'antd'
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    const [isSent, setIsSent] = useState<boolean>(false);
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
            setIsSent(curr => true);
        }
        catch (e) {
            if (e instanceof AxiosError){
                switch (e.response?.status){
                    case 422: {
                        toast("Thử lại", {type: "error"});
                        break
                    }
                    case 409: {
                        toast("Tài khoản đã tồn tại", {type: "error"});
                    }
                }
            }
        }
    };
      
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    if (isSent) {
        return (
        <div className="flex justify-center items-center">
            Vui lòng kiểm tra email của bạn.
        </div>
        )
    }
    return (
        <div className='flex flex-col justify-center items-center' style={{minHeight: "90vh"}}>
            <ToastContainer></ToastContainer>
            <div style={{fontWeight: "bold", marginBottom: 10}}>
                Tạo tài khoản
            </div>
            <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600, width: "40vw" }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
            >
            <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[{ type:"email", required: true, message: 'Email không được để trống' }]}
            >
                    <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Mật khẩu không được để trông'}, {pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, message: "Ít nhất 8 ký tự, 1 chữ cái in hoa, 1 chữ cái in thường, 1 chữ số, 1 ký tự đặc biệt"}]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item<FieldType>
                label="Tên"
                name="name"
                rules={[{ required: true, message: 'Tên không được để trống' }, {pattern: /[\p{L}\s]*$/, message: "Tên không hợp lệ"}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item<FieldType>
                label="Ngày sinh"
                name="dateOfBirth"
                rules={[{ required: true, message: 'Ngày sinh không được để trống' }]}
            >
                <DatePicker></DatePicker>
            </Form.Item>
            <Form.Item<FieldType>
                label="Số điện thoại"
                name="phonenumber"
                rules={[{ required: true, message: 'Số điện thoại không được để trống' }, {pattern: /^(\d{10}|\d{11})$/, message: "Số điện thoại không hợp lệ"}]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Tỉnh / Thành phố"
                name="province"
                rules={[{ required: true, message: 'Không được để trống mục này' }]}
            >
                {/* City */}
                <Select onChange={(value) => getDistrict(value)}>
                    {!(cities) || cities.map((city:any) => {
                        if (city.province_id == "01" || city.province_id == '79'){
                            return (
                                <Select.Option value= {`${city.province_id}&${city.province_name}`} key={city.province_id}>
                                    {city.province_name}
                                </Select.Option>
                            )
                        }
                    })}
                </Select>
            </Form.Item>
            <Form.Item<FieldType>
                label="Quận / Huyện"
                name="district"
                rules={[{ required: true, message: 'Không được để trống mục này' }]}
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
                label="Phường / Xã"
                name="ward"
                rules={[{ required: true, message: 'Không được để trống mục này' }]}
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
                    Đăng ký
            </Button>
            </Form.Item>
    </Form>
        </div>
    )
}