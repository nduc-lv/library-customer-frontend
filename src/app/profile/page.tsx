'use client'

import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/CustomerContext";
import http from "../utils/http";
import { AxiosError } from "axios";
import CustomerInterface from "../interfaces/CustomerInterface";
import { Button } from "antd";
import { Modal, Space } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import UpdateProfile from "../components/UpdateProfile";
import {Card} from 'antd'
export default function ProfilePage(){
    const router = useRouter();
    const [customerInfo, setCustomerInfo] = useState<CustomerInterface>();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState<CustomerInterface>();
    const showModal = () => {
        setOpen(true);
      };
      const getCustomerInfo = async () => {
        try{
            const data = await http.getWithAutoRefreshToken('/getCustomerProfile', {useAccessToken: true});
            console.log(data);
            setCustomerInfo({...data.customer});
        }
        catch (e) {
            if (e instanceof AxiosError) {
                if (e.response?.status == 404) {
                    alert("Tai khoan khong ton tai")
                }
            }
            console.log(e);
        }
    }
    const handleOk = async () => {
        try {
            // setLoading(true);
            // await http.postWithAutoRefreshToken("/changeComment", {
            //     commentId,
            //     content: changedContent,
            // }, {useAccessToken: true});
            // setLoading(false);
            // await getComments();
            // setOpen(false);
            setLoading(true);
            await http.postWithAutoRefreshToken('/updateProfile', updatedProfile, {useAccessToken: true});
            setLoading(false);
            await getCustomerInfo();
            setOpen(false);
        }
        catch (e){
            console.log(e);
        }
      };
    
    const handleCancel = () => {
        setOpen(false);
    };
    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            router.push("/login");
        }
        else{
            getCustomerInfo();
        }
    }, [])
    useEffect(() => {
        console.log(updatedProfile);
    }, [updatedProfile])
    if (!customerInfo){
        return <>
            Loading...
        </>
    }
    return (
        <div className="flex justify-center items-center">
            
            <Card title="Hồ sơ của tôi" bordered={false} style={{ width: "70vw", height: "80vh" }}>
            <div style={{padding: 30, fontSize: 16}}>
                <div style={{marginTop: 20}}>
                    <div><span style={{fontWeight: "bold"}}>Tên: </span> {customerInfo?.name}</div>
                </div>
                <div style={{marginTop: 20}}>
                    <div><span style={{fontWeight: "bold"}}>Số điện thoại: </span> {customerInfo?.phone}</div>
                </div>
                <div style={{marginTop: 20}}>
                    <div><span style={{fontWeight: "bold"}}>Email: </span> {customerInfo?.email}</div>
                </div>
                <div style={{marginTop: 20}}>
                    <div><span style={{fontWeight: "bold"}}>Địa chỉ nhà: </span> {customerInfo?.address}</div>
                </div>
                <div style={{marginTop: 20}}>
                    <div><span style={{fontWeight: "bold"}}>Ngày sinh: </span>{new Date(customerInfo!.dateOfBirth).toLocaleDateString()}</div>
                </div>
                <div style={{marginTop: 20}}>
                    <div><span style={{fontWeight: "bold"}}>Độ uy tín </span>{customerInfo.reputation}</div>
                </div>
            </div>
            
            <div className="flex justify-center items-center">
                <Button onClick={showModal}>Chỉnh sửa</Button>
            </div>
            <Modal
                            open={open}
                            title="Chỉnh sửa hồ sơ"
                            onOk={handleOk}
                            onCancel={handleCancel}
                            footer={[
                                <Button key="back" onClick={handleCancel}>
                                  Quay lại
                                </Button>,
                                // <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                                //   Xác nhận
                                // </Button>
                            ]}
                            
                        >
                            {/* <TextArea
                                value={changedContent}
                                onChange={(e) => setChangedContent(e.target.value)}
                                autoSize={{ minRows: 3, maxRows: 5 }}                            
                            >
                            </TextArea> */}
                            <UpdateProfile customerInfo={customerInfo} setUpdatedProfile = {setUpdatedProfile}></UpdateProfile>
            </Modal>
            </Card>
        </div>
    )
}