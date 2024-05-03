'use client'

import { Button, Modal } from "antd";
import RecordInterface from "../interfaces/RecordInterface";
import { useState } from "react";
import { InputNumber } from "antd";
import { InputNumberProps } from "antd";
import http from "../utils/http";
import { AxiosError } from "axios";
import { ExclamationCircleFilled } from '@ant-design/icons';
const {confirm} = Modal;
export default function Record({record, update}: {record: RecordInterface, update:any}){
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [numberOfBooks, setNumberOfBooks] = useState<number>(1);
    const showModal = () => {
        setOpen(true);
      };
      const onChange: InputNumberProps['onChange'] = (value) => {
        if (typeof value == 'number'){
            setNumberOfBooks(curr => value);
        }
    };
    const handleOk = async (record: RecordInterface) => {
        try {
            setLoading(true);
            await http.postWithAutoRefreshToken("/updateReservation", {bookId: record.book._id, numberOfBooks, recordId: record._id}, {useAccessToken: true})
            //     commentId,
            //     content: changedContent,
            // }, {useAccessToken: true});
            // setLoading(false);
            // await getComments();
            // setOpen(false);
            setLoading(false);
            // update
            update();
            setOpen(false);
        }
        catch (e){
            if (e instanceof AxiosError){
                if (e.response?.data?.status == -1){
                    alert("Het sach")
                }
            }
            console.log(e);
        }
      };
    
    const handleCancel = () => {
        setOpen(false);
    };
    const showDeleteConfirm = (record:RecordInterface) => {
        confirm({
          title: 'Are you sure delete this task?',
          icon: <ExclamationCircleFilled />,
          content: 'Delete reservation',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            http.postWithAutoRefreshToken('/deleteReservation', {bookId: record.book._id, recordId: record._id}, {useAccessToken: true})
            .then(() => {update()})
            .catch((e) => {
                if (e instanceof AxiosError){
                    if (e.response?.status == 404) {
                        alert("Not found")
                    }
                }
            });
          },
          onCancel() {
            console.log('Cancel');
          },
    });}
    return (
        <>
            <div>
                {record.book.name}
            </div>
            <div>
                {record.status}
            </div>
            <div>
                {record.numberOfBooks}
            </div>
            <div>
                {new Date(record.timeStart).toLocaleDateString()}
            </div>
            <div>
                {new Date(record.timeEnd).toLocaleDateString()}
            </div>
            {record.status == 'Đặt cọc' ? (
                <div>
                    <Button onClick={() =>{showModal(); setNumberOfBooks(curr => record.numberOfBooks)}}>Chinh sua</Button>
                    <Button onClick={() => {showDeleteConfirm(record)}}>Delete Reservation</Button> 
                </div>
            ) :
            <></>}
            <Modal
                            open={open}
                            title="Title"
                            onOk={() => {handleOk(record)}}
                            onCancel={handleCancel}
                            footer={[
                                <Button key="back" onClick={handleCancel}>
                                  Return
                                </Button>,
                                <Button disabled={(numberOfBooks == record.numberOfBooks)} key="submit" type="primary" loading={loading} onClick={() => {handleOk(record)}}>
                                  Submit
                                </Button>
                            ]}
                            
                        >
                            <InputNumber type="number" onChange={onChange} defaultValue={numberOfBooks} min={1} max = {record.book.quantity}></InputNumber>
            </Modal>
        </>
    )
}