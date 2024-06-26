'use client'
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import http from '../utils/http';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { UserContext } from '../context/CustomerContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Card} from "antd"
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
                        toast("Tài khoản không tồn tại", {type:"error"})
                        break
                    }
                    case 403: {
                        toast("Sai mật khẩu", {type:"error"})
                        break
                    }
                }
            }
        }
    };
      
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    
    return (
        <div className='flex flex-col items-center justify-center' style={{padding: 100}}>
            <ToastContainer></ToastContainer>
            <div style={{fontWeight: "bold", marginBottom: 10}}>
                Đăng nhập
            </div>
            <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600}}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
            >
            <Form.Item<FieldType>
                    label="Email"
                    name="username"
                    rules={[{ type:"email", required: true, message: 'Email không đúng định dạng' }]}
            >
                    <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Mật khẩu không được để trống' }]}
            >
                <Input.Password />
            </Form.Item>

   

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" style={{marginTop: 10}}>
                    Đăng nhập
            </Button>
            {/* <Button type='primary' onCLick = {() => {}}>
                Quên mật khẩu
            </Button> */}
            </Form.Item>   
    </Form>
            <div className='underline cursor-pointer' style={{fontSize: 13, color: "gray"}} onClick={() => {router.push("/forgotPassword")}}>
                Quên mật khẩu
            </div>
        </div>
    )
}