'use client'

import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import http from "../utils/http";
import { useEffect, useState } from "react";
import BookInterface from "../interfaces/BookInterface";
import type { PaginationProps } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import { Input, Pagination, Form, Select, Button, AutoComplete } from "antd";
import Books from "../components/Books";
import SearchBook from "../components/SearchBook";


function useQuery() {
  return new URLSearchParams(usePathname());
}
const {Search} = Input
export default function SearchPage(){
    const router = useRouter();
    const searchParams = useSearchParams()
    const page = searchParams.get("page") || 1
    const q = searchParams.get("q");
    const path = useQuery();
    const [query, setQuery] = useState<string>(q || "");
    const [currPage, setCurrPage] = useState<number>(+page) 
    const [books, setBooks] = useState<Array<BookInterface>>();
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const onChangePage: PaginationProps['onChange'] = (pageNumber:number) => {
        setCurrPage(current => pageNumber)
    };
    const getBooks = async () => {
        try{
            const data = await http.getWithAutoRefreshToken(`/search?q=${query}&page=${currPage}&limit=8`, {useAccessToken: false});
            console.log(data)
            setLoading(curr => false);
            setBooks([...data.books]);
            setTotalPages(curr => data.totalPages);
        }
        catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        if (searchParams.get("q")){
            //@ts-ignore
            setQuery((curr)=> searchParams.get('q'));
        }
    }, [path])
    useEffect(() => {
        getBooks();
        console.log(q);
    }, [currPage, query]);
    return (
        <>
            {/* Search bar */}
            {/* <div className="flex flex-row justify-center items-center w-full" style={{paddingLeft: "200px", paddingRight:"200px"}}>
              <Search placeholder="Nhập tên sách, tên tác giả" enterButton="Tìm kiếm" size="large" loading={loading} onSearch={onSearch}/>
            </div> */}
            <SearchBook></SearchBook>
            {/* Display results */}
            <Books books={books}></Books>
            {/* pagination */}
            <div className="flex justify-center items-center">
                {(!books) || (books.length == 0) || <Pagination current={currPage} total={totalPages * 10} onChange={onChangePage}></Pagination>}
            </div>
        </>
    )
}