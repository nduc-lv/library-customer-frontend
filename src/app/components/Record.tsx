'use client'

import { Button, Image, Modal } from "antd";
import RecordInterface from "../interfaces/RecordInterface";
import { useState } from "react";
import { InputNumber } from "antd";
import { InputNumberProps } from "antd";
import http from "../utils/http";
import { AxiosError } from "axios";
import { ExclamationCircleFilled } from '@ant-design/icons';
import {Card} from "antd";
import { useRouter } from "next/navigation";
const {confirm} = Modal;
const {Meta} = Card
export default function Record({record, update, toast}: {record: RecordInterface, update:any, toast: any}){
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [numberOfBooks, setNumberOfBooks] = useState<number>(1);
    const router = useRouter();
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
            //@ts-ignore
            update(curr => !curr)
            setOpen(false);
        }
        catch (e){
            if (e instanceof AxiosError){
                if (e.response?.status == 404) {
                    toast("Không tìm thấy", {type: "error"});
                }
                else if (e.response?.status == 406) {
                    toast("Hết sách", {type: "error"})
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
          title: 'Xóa đơn?',
          icon: <ExclamationCircleFilled />,
          content: 'Xóa đơn đặt trước',
          okText: 'Xóa',
          okType: 'danger',
          cancelText: 'Hủy',
          onOk() {
            http.postWithAutoRefreshToken('/deleteReservation', {bookId: record.book._id, recordId: record._id}, {useAccessToken: true})
            .then(() => {update((curr:any) => !curr)})
            .catch((e) => {
                if (e instanceof AxiosError){
                    if (e.response?.status == 404) {
                        toast("Không tồn tại", {type: "error"});
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
            {record.status == 'Đặt trước' ? (
                <div>
                    <Button type="primary" onClick={() =>{showModal(); setNumberOfBooks(curr => record.numberOfBooks)}}>Chỉnh sửa</Button>
                    <Button type="primary" onClick={() => {showDeleteConfirm(record)}}>Hủy đặt trước</Button> 
                </div>
            ) :
            <></>} */}
             <Card
                // onClick={() => {router.push(`/bookDetails/${record.book._id}`)}}
                hoverable
                style={{display: "flex", flexDirection: "row"}}
                cover={<div style={{padding: 20}}><Image alt={record.book.name} src={`http://localhost:3000/images/${record.book.image}`} style={{width: 200, height: 250}} fallback="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ_4drL9dKEWM3Xp5Fcn5mEBTD7aXG6g1D17KEIg8wKJI0tIU7Z"/></div>}
            >
                <Meta title={record.book.name} />
                <div style={{width: "40vw"}} onClick = {() => {router.push(`/bookDetails/${record.book._id}`)}}>
                    <div style={{marginTop: 10, width: "60%"}} className="truncate">
                        <span style={{fontWeight: "bold"}}>Tác giả: </span> {record.book.authors.map((author) => author.name).join(", ")}
                    </div>
                    <div style={{marginTop: 10}} className="truncate">
                        <span style={{fontWeight: "bold"}}>Thể loại: </span> {record.book.genres.map((genre) => genre.name).join(", ")}
                    </div>
                    <div style={{marginTop: 10}} className="truncate">
                        <span style={{fontWeight: "bold"}}>Trạng thái: </span> {record.status == "Đặt trước" ? "Đặt trước" : record.status}
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
                {record.status == 'Đặt trước' ? (
                <div style={{marginTop: 10}} className="flex gap-2">
                    <Button type="primary" onClick={() =>{showModal(); setNumberOfBooks(curr => record.numberOfBooks)}}>Chỉnh sửa</Button>
                    <Button type="primary" onClick={() => {showDeleteConfirm(record)}}>Hủy đặt trước</Button> 
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
                                <Button type="primary" key="back" onClick={handleCancel}>
                                  Hủy
                                </Button>,
                                <Button type="primary" disabled={(numberOfBooks == record.numberOfBooks)} key="submit" loading={loading} onClick={() => {handleOk(record)}}>
                                  Xác nhận
                                </Button>
                            ]}
                            
                        >
                            <InputNumber type="number" onChange={onChange} defaultValue={numberOfBooks} min={1} max = {record.book.quantity}></InputNumber>
            </Modal>
        </div>
    )
}