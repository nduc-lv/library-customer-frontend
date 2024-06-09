'use client'

import { UserOutlined } from '@ant-design/icons';
import { AutoComplete, Input } from 'antd';
import { useEffect, useState } from 'react';
import BookInterface from '../interfaces/BookInterface';
import http from '../utils/http';
import type { SelectProps } from 'antd';
import { useRouter } from 'next/navigation';



export default function SearchBook(){
    const router = useRouter();
    const [options, setOptions] = useState<Array<any>>();
    const searchResult = async (query: string) =>{
        try {
            const data = await http.getWithAutoRefreshToken(`/search?q=${query}`, {useAccessToken: false});
            if (data.books){
                return data.books.map((book:BookInterface, index: number) => {
                    return {
                        value: book.name,
                        label: (
                            <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                            >
                            
                            {book.name}
                            </div>
                        ),
                    }
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    const handleSearch = async (value: string) => {
        const options = await searchResult(value);
        setOptions(value ? options : []);
    };
    const onSelect = (value: string) => {
        router.push(`/search?q=${value}&page=1`);
        router.refresh();
    }
    return (
    <div className="flex flex-row justify-center items-center w-full" style={{paddingLeft: "200px", paddingRight:"200px"}}>
        <AutoComplete
      popupMatchSelectWidth={452}
      style={{ width: 500 }}
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
    >
    
      <Input.Search placeholder="Nhập tên sách, tác giả" enterButton onSearch={onSelect} />
    
    </AutoComplete>
    </div>
    )
} 

