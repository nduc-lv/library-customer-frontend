'use client'
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import http from '../utils/http';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { UserContext } from '../context/CustomerContext';

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };

export default function Login() {
    const router = useRouter();
    const {setState} = useContext(UserContext);
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values);
        try {
            const data = await http.postWithAutoRefreshToken("/login", {email: values.username, password: values.password}, {useAccessToken:false});
            console.log(data);
            if (localStorage){
                localStorage.setItem("accessToken", data.accessToken)
                localStorage.setItem("refreshToken", data.refreshToken)
                setState((state:boolean) => !state);
                router.push("/");
            }
        }
        catch (e) {
            if (e instanceof AxiosError){
                switch (e.response?.status){
                    case 404: {
                        alert("Tai khoan khong ton tai")
                        break
                    }
                    case 403: {
                        alert("Sai mat khau")
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
                    label="Username"
                    name="username"
                    rules={[{ type:"email", required: true, message: 'Please input your username!' }]}
            >
                    <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
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