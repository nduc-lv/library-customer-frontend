'use client'

import { useContext, useEffect, useState } from "react"
import RecordInterface from "../interfaces/RecordInterface"
import http from "../utils/http";
import { Tabs } from 'antd';
import { UserContext } from "../context/CustomerContext";
import Record from "../components/Record";
import {Pagination} from "antd";
import type { PaginationProps } from 'antd';
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function RecordsPage() {
    // const [records, setRecords] = useState<Array<RecordInterface>>();
    const records = [useState<Array<RecordInterface>>(), useState<Array<RecordInterface>>(), useState<Array<RecordInterface>>(), useState<Array<RecordInterface>>()]
    const [loading, setLoading] = useState<boolean>(false);
    const {id} = useContext(UserContext)
    const router = useRouter();
    const [reload, setReload] = useState<boolean>(false);
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
                router.push("/login")
                setLoading(false);
                
            }
        }
        useEffect(() => {
            getAllReservation();
        }, [reload, page])
        if (!(records[type - 1][0])) {
            return <div className="flex justify-center items-center">
                Loading...
            </div>
        }
        if (records[type - 1][0]?.length == 0 ){
            return <div className="flex justify-center items-center">
                Chưa có bản ghi nào
            </div>
        }
        return (
            <div>
                <div className="flex flex-col justify-center items-center">
                {records[type - 1][0]!.map((record) => {
                    return (
                        <div key={record._id}>
                            <Record toast={toast} record={record} update={setReload}></Record>
                        </div>
                        
                    )
                })}

                </div>
                 {/* {(!records[type - 1][0]) || 
                 <div className="flex flex-col justify-center items-center" style={{paddingBottom: 20}}>
                      <Pagination current={page} total={totalPages * 10} onChange={onChangePage}></Pagination>  
                </div>} */}
            </div>
        )
    }
    return (
        <>
        <ToastContainer></ToastContainer>
        <div className="text-center" style={{fontWeight: "bold"}}>
            LỊCH SỬ MƯỢN SÁCH
        </div>
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
                label: "Đặt trước",
                children: Records({type: 2})
            },
            {
                key: '3',
                label: "Đã trả",
                children: Records({type: 3})
            },
            {
                key: '4',
                label: 'Đang mượn',
                children: Records({type: 4})
            }
        ]}
      />
        </>
    )
}