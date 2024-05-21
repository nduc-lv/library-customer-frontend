'use client'

import { useRouter, useSearchParams } from "next/navigation"
import http from "../utils/http";
import { useEffect, useState } from "react";
import BookInterface from "../interfaces/BookInterface";
import type { PaginationProps } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import { Input, Pagination, Form, Select, Button } from "antd";
import Books from "../components/Books";

const {Search} = Input
export default function SearchPage(){
    const router = useRouter();
    const searchParams = useSearchParams()
    const page = searchParams.get("page") || 1
    const q = searchParams.get("q");
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
            const data = await http.getWithAutoRefreshToken(`/search?q=${query}&page=${currPage}&limit=10`, {useAccessToken: false});
            console.log(data)
            setLoading(curr => false);
            setBooks([...data.books]);
            setTotalPages(curr => data.totalPages);
        }
        catch (e) {
            console.log(e);
        }
    }
    const onSearch = (value:string) => {
        if (value != query){
            setLoading(curr => true)
            router.push(`/search?q=${value}&page=1`);
            setQuery(curr => value);
        }
    }
    useEffect(() => {
        getBooks();
    }, [currPage, query]);
    return (
        <>
            {/* Search bar */}
            <div className="flex flex-row justify-center items-center w-screen" style={{paddingLeft: "200px", paddingRight:"200px"}}>
              <Search placeholder="input search text" enterButton="Search" size="large" loading={loading} onSearch={onSearch}/>
            </div>
            {/* Display results */}
            <Books books={books}></Books>
            {/* pagination */}
            <div className="flex justify-center items-center">
                {(!books) || (books.length == 0) || <Pagination current={currPage} total={totalPages * 10} onChange={onChangePage}></Pagination>}
            </div>
        </>
    )
}