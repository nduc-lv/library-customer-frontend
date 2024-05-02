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
        <>
            <div>
                <div>Ten: {customerInfo?.name}</div>
            </div>
            <div>
                <div>So dien thoai: {customerInfo?.phone}</div>
            </div>
            <div>
                <div>Dia chi email: {customerInfo?.email}</div>
            </div>
            <div>
                <div>Dia chi nha: {customerInfo?.address}</div>
            </div>
            <div>
                <div>Ngay sinh: {new Date(customerInfo!.dateOfBirth).toLocaleDateString()}</div>
            </div>
            <Button onClick={showModal}>Chinh sua</Button>
            <Modal
                            open={open}
                            title="Title"
                            onOk={handleOk}
                            onCancel={handleCancel}
                            footer={[
                                <Button key="back" onClick={handleCancel}>
                                  Return
                                </Button>,
                                <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                                  Submit
                                </Button>
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
        </>
    )
}