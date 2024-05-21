'use client'
import Comments from "@/app/components/Comments";
import { UserContext } from "@/app/context/CustomerContext";
import BookInterface from "@/app/interfaces/BookInterface";
import http from "@/app/utils/http";
import { Button, InputNumber } from "antd";
import { useContext, useEffect, useState } from "react";
import type { InputNumberProps } from 'antd';
import { Card } from 'antd';
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosError } from "axios";

export default function BookDetail({params}:{params: {bookId:string}}) {
    const bookId:string = params.bookId;
    const [bookDetail, setBookDetail] = useState<BookInterface>();
    const [numberOfBooks, setNumberOfBooks] = useState<number>(1);
    const {id} = useContext(UserContext);
    const getBookDetails = async () => {
        try {
            const data = await http.getWithAutoRefreshToken(`/getBookDetails/${bookId}`, {useAccessToken: false});
            console.log(data);
            if (data.book){
                setBookDetail({...data.book});
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    const reserve = async () => {
        try {
           await http.postWithAutoRefreshToken('/reserveBook', {
            bookId,
            numberOfBooks
           }, {useAccessToken: true});
           toast("Thành công", {type: "success"})
        }
        catch (e){
            if (e instanceof AxiosError){
                if (e.response!.status === 400) {
                    toast("Cần đăng nhập để đặt trước sách", {type: "error"})
                }
                else if (e.response?.status === 404) {
                    toast("Không tìm thấy sách", {type: "error"})
                }
                else if (e.response?.status === 406) {
                    toast("Số lượng sách không đủ", {type: "error"})
                }
                else if (e.response?.status === 403) {
                    toast("Độ uy tín của bạn không đủ", {type: "error"})
                }
            }
            
        }
    }
    const onChange: InputNumberProps['onChange'] = (value) => {
        if (typeof value == 'number'){
            setNumberOfBooks(curr => value);
        }
    };
    useEffect(() => {
        getBookDetails();
    }, [])
    return (
        <>
            {bookDetail === undefined ? (
                <div className="text-center">
                    Loading
                </div>
            ) :
        <div style={{paddingLeft: 30, paddingRight: 30}}>
            <div className="grid grid-cols-3 gap-4 auto-rows-max">
                {/* <div>{bookDetail.name}</div> */}
                
                <Card style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <img alt="book's cover" src={bookDetail.image} width={368} height={368}></img>
                </Card>
                <div className="flex flex-col gap-4">
                    <Card title={bookDetail.name} style={{whiteSpace: "normal"}}>
                            <p><span style={{fontWeight: "bold"}}>Tác giả: </span> {bookDetail.authors.map((author) => author.name).join(", ")}</p>
                            <p><span style={{fontWeight: "bold"}}>Thể loại: </span> {bookDetail.genres.map((genre) => genre.name).join(", ")}</p>
                    </Card>
                    <Card title={"Mô tả sách"} style={{}}>
                        <pre className="w-full text-wrap overflow-y-auto overflow-x-hidden no-scrollbar" style={{height: 380}}>
                            {bookDetail.review}
                        </pre>
                    </Card>
                </div>
                <div>
                    <Card title={"Số lượng"}>
                        <p style={{marginBottom: 10}}>Còn: {bookDetail.quantity} cuốn</p>
                        <InputNumber type="number" onChange={onChange} defaultValue={1} min={1} max = {bookDetail?.quantity}></InputNumber>
                        <Button onClick={reserve}>Giữ chỗ</Button>
                    </Card>
                </div>
                {/* <div>{bookDetail.quantity}</div>
                <div>{bookDetail.authors.map((author) => {return author.name})}</div>
                <div>{bookDetail.genres.map((genre) => {return genre.name})}</div> */}
            </div>
            <div style={{marginTop: 20}}>
                <Comments bookId={bookId}></Comments>
            </div>
        </div> 
            
            }

        </>
    )
}