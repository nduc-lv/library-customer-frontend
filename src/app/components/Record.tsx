'use client'

import { Button, Modal } from "antd";
import RecordInterface from "../interfaces/RecordInterface";
import { useState } from "react";
import { InputNumber } from "antd";
import { InputNumberProps } from "antd";
import http from "../utils/http";
import { AxiosError } from "axios";
import { ExclamationCircleFilled } from '@ant-design/icons';
import {Card} from "antd";
const {confirm} = Modal;
const {Meta} = Card
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
                if (e.response?.status == 404) {
                    alert("Not found")
                }
                else if (e.response?.status == 406) {
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
        <div style={{marginBottom: 50}}>
            {/* <div>
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
                    <Button onClick={() =>{showModal(); setNumberOfBooks(curr => record.numberOfBooks)}}>Chỉnh sửa</Button>
                    <Button onClick={() => {showDeleteConfirm(record)}}>Hủy đặt trước</Button> 
                </div>
            ) :
            <></>} */}
             <Card
                hoverable
                style={{display: "flex", flexDirection: "row"}}
                cover={<img alt={record.book.name} src={record.book.image} style={{width: 200}}/>}
            >
                <Meta title={record.book.name} />
                <div style={{width: "40vw"}}>
                    <div style={{marginTop: 10, width: "60%"}} className="truncate">
                        <span style={{fontWeight: "bold"}}>Tác giả: </span> {record.book.authors.map((author) => author.name).join(", ")} aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    </div>
                    <div style={{marginTop: 10}} className="truncate">
                        <span style={{fontWeight: "bold"}}>Thể loại: </span> {record.book.genres.map((genre) => genre.name).join(", ")}
                    </div>
                    <div style={{marginTop: 10}} className="truncate">
                        <span style={{fontWeight: "bold"}}>Trạng thái: </span> {record.status == "Đặt cọc" ? "Đặt trước" : record.status}
                    </div>
                    <div style={{marginTop: 10}} className="truncate">
                        <span style={{fontWeight: "bold"}}>Số lượng đặt: </span> {record.numberOfBooks} cuốn
                    </div>
                    <div style={{marginTop: 10}} className="truncate">
                        <span style={{fontWeight: "bold"}}>Ngày đặt: </span> {new Date(record.timeStart).toLocaleDateString()}
                    </div>
                    <div style={{marginTop: 10}} className="truncate">
                        <span style={{fontWeight: "bold"}}>Hạn lấy sách: </span> {new Date(record.timeEnd).toLocaleDateString()}
                    </div>
                </div>
                {record.status == 'Đặt cọc' ? (
                <div style={{marginTop: 10}} className="flex gap-2">
                    <Button onClick={() =>{showModal(); setNumberOfBooks(curr => record.numberOfBooks)}}>Chỉnh sửa</Button>
                    <Button onClick={() => {showDeleteConfirm(record)}}>Hủy đặt trước</Button> 
                </div>
            ) :
            <></>}
            </Card>
            <Modal
                            open={open}
                            title="Sửa số lượng"
                            onOk={() => {handleOk(record)}}
                            onCancel={handleCancel}
                            footer={[
                                <Button key="back" onClick={handleCancel}>
                                  Hủy
                                </Button>,
                                <Button disabled={(numberOfBooks == record.numberOfBooks)} key="submit" type="primary" loading={loading} onClick={() => {handleOk(record)}}>
                                  Xác nhận
                                </Button>
                            ]}
                            
                        >
                            <InputNumber type="number" onChange={onChange} defaultValue={numberOfBooks} min={1} max = {record.book.quantity}></InputNumber>
            </Modal>
        </div>
    )
}