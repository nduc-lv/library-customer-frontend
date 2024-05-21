'use client'
import jwt from 'jsonwebtoken'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import http from '@/app/utils/http';

type FieldType = {
    password?: string;
};

export default function ResetPassword({params}:{params:{token: string}}){
    const [valid, setValid] = useState<boolean>(true)
    const [email, setEmail] = useState<string>("")
    const emailToken = params.token;
    const router = useRouter();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values);
        try {
            await http.postWithAutoRefreshToken("/setNewPassword", {
                email: email,
                password: values.password
            }, {useAccessToken:false})
            router.push("/login")              
        }
        catch (e) {
            console.log("Loi")
        }
    };
      
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_SECRET;
        if (!key) {
            setValid(curr => false)
        }
        else {
            try {
                jwt.verify(emailToken, key, (err, user) => {
                    // console.log(user);
                    if (err) {
                        console.log(err);
                        console.log(emailToken)
                        throw Error("Token khong hop le")
                    }
                    // if (user){
                    //     setEmail(curr => user.email)
                    // }
                    console.log(user)
                })
            }
            catch (e) {
                console.log(e);
                router.push("/forgotPassword")
            }
        }
    }, [])
    if (!valid) {
        return (
            <div>
                Đường dẫn không hợp lệ
            </div>
        )
    }
    return (
        <div className='flex justify-center items-center flex-col'>
            <div style={{fontWeight: "bold", marginBottom: 10}}>
                Nhập mật khẩu mới
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
                label="Mật khẩu mới"
                name="password"
                rules={[{ required: true, message: 'Mật khẩu không được để trống' },{pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, message: "It nhat 8 ky tu, 1 chu cai in hoa, 1 chu cai in thuong, 1 so, 1 ky tu dac biet"}]}
            >
                <Input.Password />
            </Form.Item>

   

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" style={{marginTop: 10}}>
                    Xác nhận
            </Button>
            {/* <Button type='primary' onCLick = {() => {}}>
                Quên mật khẩu
            </Button> */}
            </Form.Item>   
    </Form>
        </div>
    )
}