'use client'

import {useContext, useEffect, useState} from 'react'
import { BookOutlined, FileTextOutlined, SettingOutlined, HomeOutlined , UserOutlined, DownOutlined} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { UserContext } from '../context/CustomerContext';
import Link from 'next/link';
import GenreInterface from '../interfaces/GenreInterface';
import http from '../utils/http';
import CustomerInterface from '../interfaces/CustomerInterface';
import {Popover} from 'antd';
import { useRouter } from 'next/navigation';

type MenuItem = Required<MenuProps>['items'][number];


export default function MenuComp() {
  const router =  useRouter();
  const [genres, setGenres] = useState<Array<GenreInterface>>();
  const [user, setUser] = useState<CustomerInterface>()
  const {setState, state} = useContext(UserContext);
  const getGenres = async () => {
    try {
      const data = await http.getWithAutoRefreshToken("/getAllGenres", {useAccessToken: false})
      if (data.genres) {
        setGenres([...data.genres])
      }
      else {
        throw new Error("GENRE NOT FOUND")
      }
    }
    catch (e) {
      console.log(e)
    }
  }
  const getUser = async () => {
    try {
      const data = await http.getWithAutoRefreshToken("/getCustomerProfile", {useAccessToken: true})
      console.log(data)
      if (data.customer) {
        setUser({...data.customer})
      }
      else{
        throw new Error("USER ERR")
      }
    }
    catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getGenres()
    getUser()
  }, [state])
  const guestContent = (
    <div className='min-w-14 cursor-pointer'>
      <div className='py-2' onClick={() => {router.push("/login")}}>
        Đăng nhập
      </div>
      <div className='py-2' onClick={() => {router.push("/signup")}}>
        Đăng ký
      </div>
    </div>
  )
  const userContent = (
    <div className='min-w-14 cursor-pointer'>
      <div className='py-2' onClick={() => {router.push("/profile")}}>
        Hồ sơ
      </div>
      <div className='py-2' onClick={() => {localStorage.clear(); setState((curr:boolean) => !curr); setUser(curr => undefined);router.push('/')}}>
        Đăng xuất
      </div>
    </div>
  )
  const items: MenuItem[] = [
    {
      label: (
        <Link href={"/"}>Hust Library</Link>
      ),
      key: 'home',
      icon: <HomeOutlined />,
    },
    {
      label: (
        <Link href={"/records"}>Lịch sử</Link>
      ),
      key: 'records',
      icon: <FileTextOutlined />,
    },
    {
      label: 'Thể loại',
      key: 'Genre',
      icon: <BookOutlined />,
      children: genres ? genres.map((genre, index) => {
        return (
          {
            label: (<Link href={`/genre/${genre._id}`}>{genre.name}</Link>),
            key: genre._id
          }
        )
      }) : [{label: "None", key: "-1"}]
    },
    {
      key: 'user',
      label: ( user ? (
        <Popover content={userContent} trigger="click" placement="bottom">
          <div className='cursor-pointer' ><UserOutlined className='mr-4' />{user.name}<DownOutlined className='ml-4 opacity-70' /></div>
        </Popover>
      ) : (
        <Popover content={guestContent} trigger="click" placement="bottom">
          <span className='cursor-pointer' ><UserOutlined className='mr-4' />{}<DownOutlined className='ml-4 opacity-70' /></span>
        </Popover>
      )),
      
    }
  ];
    const [current, setCurrent] = useState('home');
    const {getCustomerId, id} = useContext(UserContext);
    console.log(id);
    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        if (e.key != 'user') {
          setCurrent(e.key);
        }
    };

  return (
    <div className='flex justify-between items-center'>
      <div className='grow'>
        <Menu onClick={onClick} selectedKeys={['0']} mode="horizontal" items={items} style={{marginBottom: "20px", display:"flex", justifyContent:"space-around"}} theme="dark"/>
      </div>

    </div>
  )
};
