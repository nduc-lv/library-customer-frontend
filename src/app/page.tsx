'use client'

import Image from "next/image";
import { use, useEffect, useState } from "react";
import BookInterface from "./interfaces/BookInterface";
import http from "./utils/http";
import Books from "./components/Books";
import type { PaginationProps } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import { Input, Pagination, Form, Select, Button } from "antd";
import GenreInterface from "./interfaces/GenreInterface";
import { useRouter } from "next/navigation";
const {Search} = Input
export default function Home() {
  const [books, setBooks] = useState<Array<BookInterface>>();
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadindSearch, setLoadingSearch] = useState<boolean>(false)
  const [genres, setGenres] = useState<Array<GenreInterface>>();
  const router = useRouter();
  const onChangePage: PaginationProps['onChange'] = (pageNumber:number) => {
    setPage(current => pageNumber)
  };
  const onSearch: SearchProps['onSearch'] = async (value, _e, info) => {
    console.log(value)
    router.push(`/search?q=${value}&page=1`);
    
  };
  const getGenres = async () => {
    try {
      const data = await http.getWithAutoRefreshToken('/getAllGenres', {useAccessToken:false});
      console.log(data);
      if (data.genres){
        setGenres([...data.genres])
      }
    }
    catch (e) {
      console.log(e);
    }
  }
  const getBook = async () => {
    try{
      const data = await http.getWithAutoRefreshToken(`/getAllBooks?page=${page}&limit=10`, {useAccessToken: false});
      console.log(data);
      setLoadingSearch(e => false);
      if (data.books){
        setBooks([...data.books])
      }
      setTotalPages(current => data.totalPages);
    }
    catch (e) {
      console.log(e);
    }

  }
  useEffect(() => {
    getBook();
  }, [page])
  useEffect(() => {
    getGenres();
  }, [])
  return (
    <>
      {/* Search bar */}
      <div className="flex flex-row justify-center items-center w-screen" style={{paddingLeft: "200px", paddingRight:"200px"}}>
              <Search placeholder="input search text" enterButton="Search" size="large" loading={loadindSearch} onSearch={onSearch}/>
      </div>
      <Books books={books}></Books>
      {(!books) || <Pagination current={page} total={totalPages * 10} onChange={onChangePage}></Pagination>}
      
    </>
  );
}
