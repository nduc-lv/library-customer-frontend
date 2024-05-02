'use client'

import {useContext, useEffect, useState} from 'react'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { UserContext } from '../context/CustomerContext';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: 'Navigation One',
    key: 'mail',
    icon: <MailOutlined />,
  },
  {
    label: 'Navigation Two',
    key: 'app',
    icon: <AppstoreOutlined />,
    disabled: true,
  },
  {
    label: 'Navigation Three - Submenu',
    key: 'SubMenu',
    icon: <SettingOutlined />,
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          { label: 'Option 1', key: 'setting:1' },
          { label: 'Option 2', key: 'setting:2' },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          { label: 'Option 3', key: 'setting:3' },
          { label: 'Option 4', key: 'setting:4' },
        ],
      },
    ],
  },
  {
    key: 'alipay',
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        Navigation Four - Link
      </a>
    ),
  },
];

export default function MenuComp() {
    const [current, setCurrent] = useState('mail');
    const {getCustomerId, id} = useContext(UserContext);
    // useEffect(() => {
    //   try {
    //     const accessToken = localStorage.get("accessToken");
    //     if (!accessToken) {
    //       console.log("AccessToken null");
    //     }
    //     else {
    //       if (!id){
    //         getCustomerId(accessToken)
    //       }
    //     }
    //   }
    //   catch (e) {
    //     console.log(e);
    //   }
    // }, [])
    console.log(id);
    const onClick: MenuProps['onClick'] = (e) => {
            console.log('click ', e);
            setCurrent(e.key);
    };

  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};
