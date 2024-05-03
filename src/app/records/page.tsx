'use client'

import { useContext, useEffect, useState } from "react"
import RecordInterface from "../interfaces/RecordInterface"
import http from "../utils/http";
import { Tabs } from 'antd';
import { UserContext } from "../context/CustomerContext";
import Record from "../components/Record";
import {Pagination} from "antd";
import type { PaginationProps } from 'antd';
export default function RecordsPage() {
    // const [records, setRecords] = useState<Array<RecordInterface>>();
    const records = [useState<Array<RecordInterface>>(), useState<Array<RecordInterface>>(), useState<Array<RecordInterface>>()]
    const [loading, setLoading] = useState<boolean>(false);
    const {id} = useContext(UserContext)
    const Records = ({type}:{type:number}) => {
        const [page, setPage] = useState<number>(1);
        const [totalPages, setTotalPages] = useState<number>(1);
        const onChangePage: PaginationProps['onChange'] = (pageNumber:number) => {
            setPage(current => pageNumber)
        };
        const getAllReservation = async () => {
            try {
                setLoading(true);
                const data = await http.getWithAutoRefreshToken(`/getAllReservation?type=${type}&page=${page}&limit=10`, {useAccessToken: true})
                setLoading(false);
                records[type - 1][1]([...data.reservation])
            }
            catch (e) {
                setLoading(false);
                alert("Loi");
            }
        }
        useEffect(() => {
            getAllReservation();
        }, [page])
        if (!(records[type - 1][0])) {
            return <>
                Loading
            </>
        }
        if (records[type - 1][0]?.length == 0 ){
            return <>
                Chua co ban ghi nao
            </>
        }
        return (
            <>
                {records[type - 1][0]!.map((record) => {
                    return (
                        <div key={record._id}>
                            <Record record={record} update={getAllReservation}></Record>
                        </div>
                        
                    )
                })}
                 {(!records[type - 1][0]) || <Pagination current={page} total={totalPages * 10} onChange={onChangePage}></Pagination>}
            </>
        )
    }
    return (
        <Tabs
        defaultActiveKey="1"
        centered
        items={[
            {key: "1",
            label: "Tất cả",
            children: Records({type: 1})
            },
            {
                key: "2",
                label: "Dat coc",
                children: Records({type: 2})
            },
            {
                key: '3',
                label: "Da tra",
                children: Records({type: 3})
            },
            {
                key: '4',
                label: 'Dang muon',
                children: (
                    <>
                        Dang muon
                    </>
                )
            }
        ]}
      />
    )
}