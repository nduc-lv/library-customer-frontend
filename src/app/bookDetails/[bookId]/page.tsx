'use client'
import Comments from "@/app/components/Comments";
import { UserContext } from "@/app/context/CustomerContext";
import BookInterface from "@/app/interfaces/BookInterface";
import http from "@/app/utils/http";
import { Button, InputNumber } from "antd";
import { useContext, useEffect, useState } from "react";
import type { InputNumberProps } from 'antd';


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
           alert("Thanh cong")
        }
        catch (e){
            console.log(e);
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
                <div>
                    Loading
                </div>
            ) : <div>
                <div>{bookDetail.name}</div>
                <div>{bookDetail.quantity}</div>
                <div>{bookDetail.authors.map((author) => {return author.name})}</div>
                <div>{bookDetail.genres.map((genre) => {return genre.name})}</div>
            </div>
            }
            <InputNumber type="number" onChange={onChange} defaultValue={1} min={1} max = {bookDetail?.quantity}></InputNumber>
            <Button onClick={reserve}>Giữ chỗ</Button>
            <Comments bookId={bookId}></Comments>

        </>
    )
}