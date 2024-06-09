'use client'
import Comments from "@/app/components/Comments";
import { UserContext } from "@/app/context/CustomerContext";
import BookInterface from "@/app/interfaces/BookInterface";
import http from "@/app/utils/http";
import { Button, InputNumber } from "antd";
import { useContext, useEffect, useState } from "react";
import type { InputNumberProps } from 'antd';
import { Card } from 'antd';
import {Image} from "antd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosError } from "axios";
export default function BookDetail({params}:{params: {bookId:string}}) {
    const bookId:string = params.bookId;
    const [bookDetail, setBookDetail] = useState<BookInterface>();
    const [numberOfBooks, setNumberOfBooks] = useState<number>(1);
    const {id} = useContext(UserContext);
    const [error, setError] = useState<number>();
    const getBookDetails = async () => {
        try {
            const data = await http.getWithAutoRefreshToken(`/getBookDetails/${bookId}`, {useAccessToken: false});
            console.log(data);
            if (data.book){
                setBookDetail({...data.book});
            }
        }
        catch (e) {
            if (e instanceof AxiosError){
                setError(curr => e.response?.status);
            }
        }
    }
    const reserve = async () => {
        try {
            if (numberOfBooks == 0) {
                toast("Cần mượn ít nhất 1 cuốn", {type: "error"});
                return;
            }
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
    if (error) {
        return (
            <>
                <div className="text-center">
                    Không tìm thấy sách
                </div>
            </>
        )
    }
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
                
                <Card title="Ảnh bìa">
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <Image alt="bìa sách" src={`https://library-back-425902.df.r.appspot.com/images/${bookDetail.image}`} style={{width: 368, height: 368}} fallback="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ_4drL9dKEWM3Xp5Fcn5mEBTD7aXG6g1D17KEIg8wKJI0tIU7Z"/>
                    </div>
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
                        <InputNumber type="number" onChange={onChange} defaultValue={1} min={1} max = {bookDetail?.quantity} style={{marginRight: 5}}></InputNumber>
                        
                        {numberOfBooks > 0 && numberOfBooks <= bookDetail.quantity ? <Button type="primary" onClick={reserve}>Đặt trước</Button> : 
                        <Button type="primary" onClick={reserve} disabled={true}>Đặt trước</Button>
                        }
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