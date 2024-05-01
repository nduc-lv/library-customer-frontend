'use client'

import BookInterface from "@/app/interfaces/BookInterface"
import http from "@/app/utils/http"
import { useState, useEffect } from "react"
import { AxiosError } from "axios"
import Books from "@/app/components/Books"
import { Pagination } from "antd"
import { PaginationProps } from "antd"
import GenreInterface from "@/app/interfaces/GenreInterface"
export default function GenrePage({params}: {params:{genreid:string}}){
    const [books, setBooks] = useState<Array<BookInterface>>();
    const [page, setPage] = useState<number>(1);
    const [genre, setGenre] = useState<GenreInterface>();
    const getBooksByGenres = async (genreid:string) => {
        try {
            const {genre} = await http.getWithAutoRefreshToken(`/getGenre/${genreid}`, {useAccessToken: false}); 
            setGenre({...genre});
            const data = await http.postWithAutoRefreshToken(`/getBooksByGenres?page=${page}&limit=10`, {genres: [genreid]}, {useAccessToken:false});
            console.log(data);
            if (data.books) {
                setBooks([...data.books]);
            }
        }
        catch (e) {
            if (e instanceof AxiosError){
                switch (e.response?.status){
                    case 404: {
                        alert("The loai khong hop le")
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
            <div>The loai: {genre?.name}</div>
            <Books books={books}></Books>
            {(!books) || <Pagination current={page} onChange={handleChange}></Pagination>}
        </>
    )
}