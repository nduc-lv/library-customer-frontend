'use client'

import { useReducer, useState } from "react"
import { Button, Checkbox, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import http from "../utils/http";
import { AxiosError } from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
type FieldType = {
    email?: string;
};
export default function ForgotPassword () {
    const [isSentEmail, setSentEmail] = useState<boolean>(false);
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        // console.log("send to backend, backend generate a link with path == token with limit time == 15 mins => set new password here")
        try {
          await http.postWithAutoRefreshToken("/resetPassword", {email: values.email}, {useAccessToken: false})
          setSentEmail(curr => true);
        }
        catch (e) {
          if (e instanceof AxiosError) {
            if (e.response?.status == 404) {
              toast("Không tìm thấy tài khoản", {type: "error"});
            }
          }
        }
    };
      
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
    if (!isSentEmail) {
      return (
          <div className="flex flex-col justify-center items-center" style={{padding: 100}}>
            <ToastContainer></ToastContainer>
              <div style={{fontWeight: "bold", marginBottom: 10}}>
                Nhập email để khôi phục mật khẩu
            </div>
               <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600, marginTop: 20 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Email"
        name="email"
        rules={[{type: "email", required: true, message: 'Email không đúng định dạng' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
          </div>
      )
    }
    return (
      <div className="flex justify-center items-center">
          Link khôi phục mật khẩu đã được gửi tới email của bạn, vui lòng kiểm tra email.
      </div>
    )
}