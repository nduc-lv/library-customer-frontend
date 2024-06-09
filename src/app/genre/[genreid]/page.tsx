'use client'

import BookInterface from "@/app/interfaces/BookInterface"
import http from "@/app/utils/http"
import { useState, useEffect } from "react"
import { AxiosError } from "axios"
import Books from "@/app/components/Books"
import { Pagination } from "antd"
import { PaginationProps } from "antd"
import type { SearchProps } from 'antd/es/input/Search';
import { Input, Form, Select, Button } from "antd";
import GenreInterface from "@/app/interfaces/GenreInterface"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchBook from "@/app/components/SearchBook"
const {Search} = Input
export default function GenrePage({params}: {params:{genreid:string}}){
    const router = useRouter()
    const [loadindSearch, setLoadingSearch] = useState<boolean>(false)
    const [books, setBooks] = useState<Array<BookInterface>>();
    const [page, setPage] = useState<number>(1);
    const [total, setTotalPages] = useState<number>(1);
    const [genre, setGenre] = useState<GenreInterface>();
    const onSearch: SearchProps['onSearch'] = async (value, _e, info) => {
        console.log(value)
        router.push(`/search?q=${value}&page=1`);
        
      };
    const getBooksByGenres = async (genreid:string) => {
        try {
            const {genre} = await http.getWithAutoRefreshToken(`/getGenre/${genreid}`, {useAccessToken: false}); 
            setGenre({...genre});
            const data = await http.postWithAutoRefreshToken(`/getBooksByGenres?page=${page}&limit=10`, {genres: [genreid]}, {useAccessToken:false});
            console.log(data);
            if (data.books) {
                setBooks([...data.books]);
            }
            if (data.totalPages)
            setTotalPages(curr => data.totalPages)
        }
        catch (e) {
            if (e instanceof AxiosError){
                switch (e.response?.status){
                    case 404: {
                        toast("Thể loại không hợp lệ", {type: "error"});
                        break
                    }
                }
            }
        }
    };
    const handleChange: PaginationProps['onChange'] = (page:number) => {
        setPage(curr => page);
    }
    useEffect(() => {
        getBooksByGenres(params.genreid);
    }, [page]);
    return (
        <>
            <ToastContainer></ToastContainer>
            {/* <div className="flex flex-row justify-center items-center w-full" style={{marginBottom: "20px", paddingLeft: "200px", paddingRight:"200px"}}>
                <Search placeholder="Nhập tên sách, tên tác giả" enterButton="Tìm kiếm" size="large" loading={loadindSearch} onSearch={onSearch}/>
            </div> */}
            <SearchBook></SearchBook>
            <div className="text-center" style={{fontWeight: "bold"}}>Thể loại: {genre?.name}</div>
            <Books books={books}></Books>
            <div className="flex justify-center items-center">
                {(!books) || ((books.length == 0)) || <Pagination current={page} total={total * 10} onChange={handleChange}></Pagination>}
            </div>
        </>
    )
}