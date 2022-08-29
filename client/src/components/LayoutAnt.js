import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ProfileOutlined,
    HomeOutlined,
    ClockCircleOutlined,
    LogoutOutlined,
    NotificationOutlined,
    AuditOutlined,
    UserOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import { Layout, Menu, Badge } from 'antd';
import React, {  useEffect, useState } from 'react';
import '../layoutAnt.css';
import { useDispatch, useSelector } from 'react-redux';
import {Link} from 'react-router-dom';
import {setContent} from '../redux/contentSlice';
import ContentSwitch from './ContentSwitch';

const { Header, Sider, Content } = Layout;

const LayoutAnt = () => {
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);

    const {content} = useSelector((state=>state.content));
    const {user} = useSelector((state)=>state.user);

    const userMenu = [
        {
            key: '1',
            name: 'Home',
            path: '/',
            icon: <HomeOutlined/>,
            label: 'Home',
            contentid: "home"
            
        },
        {
            key: '2',
            name: 'Booked Service',
            path: '/bookedservice',
            icon: <ClockCircleOutlined />,
            label: 'Booked Service',
            contentid: "bookedService"
        },
        
        {
            key: '3',
            name: 'Profile',
            path: '/profile',
            icon: <ProfileOutlined />,
            label: 'Profile',
            contentid: "profile"
        },
        {
            key: '4',
            name: 'applyWorker',
            path: '/applyWorker',
            icon: <AuditOutlined />,
            label: 'Become Worker',
            contentid: 'apply-for-worker'
        },
        {
            key: '5',
            name: 'Logout',
            path: '/logout',
            icon: <LogoutOutlined />,
            label: 'Log out',
            contentid: "logout"
        }
    ]
    const adminMenu = [
        {
            key: '1',
            name: 'Home',
            path: '/',
            icon: <HomeOutlined/>,
            label: 'Home',
            contentid: "home"
            
        },
        {
            key: '2',
            name: 'Users',
            path: '/users',
            icon: <UserOutlined />,
            label: 'Users',
            contentid: "users"

        },
        {
            key: '3',
            name: 'Workers',
            path: '/workers',
            icon: <UserAddOutlined />,
            label: 'Workers',
            contentid: "workers"
        },
        {
            key: '4',
            name: 'Profile',
            path: '/profile',
            icon: <ProfileOutlined />,
            label: 'Profile',
            contentid: "home"
            
        },
        {
            key: '5',
            name: 'Logout',
            path: '/logout',
            icon: <LogoutOutlined />,
            label: 'Log out',
            contentid: "logout"
            
        }
    ]

    const workerMenu = [
        {
            key: '1',
            name: 'Home',
            path: '/',
            icon: <HomeOutlined/>,
            label: 'Home',
            contentid: "home"
            
        },
        {
            key: '2',
            name: 'Booked Service',
            path: '/bookedservice',
            icon: <ClockCircleOutlined />,
            label: 'Booked Service',
            contentid: "bookedService"
        },
        
        {
            key: '3',
            name: 'Profile',
            path: '/profile',
            icon: <ProfileOutlined />,
            label: 'Profile',
            contentid: "profile"
        },
        {
            key: '4',
            name: 'Logout',
            path: '/logout',
            icon: <LogoutOutlined />,
            label: 'Log out',
            contentid: "logout"
        }
    ]
    

    let menuToBeRendered = userMenu
    if (user?.isAdmin){
        menuToBeRendered = adminMenu;
    }else if (user?.isWorker){
        menuToBeRendered = workerMenu;
    }

    
    // const menuToBeRendered = user?.isAdmin? adminMenu: userMenu;
    

    return (
        
        <Layout style={{ minHeight: "100vh" }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                {
                    collapsed?
                    <div className="logo">
                        W
                    </div>:
                    <div className="logo">
                        WorkBook
                    </div>
                }
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={menuToBeRendered}
                    onClick={(item)=>{
                        let tab = menuToBeRendered[item.key-1]
                        dispatch(setContent(tab.contentid));
                           
                            
                        
                    }}
                />
            </Sider>
            <Layout className="site-layout">
                <Header
                    className="site-layout-background"
                    style={{
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {

                        className: 'header-icon',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                    <div className='d-flex  align-items-center px-4'>
                    <Badge size='small' count={user?.unseenNotification.length}>
                        <NotificationOutlined className='header-icon px-0' onClick={()=>{
                            dispatch(setContent("notification"));
                        }}/>
                    </Badge>
                        
                        <Link className='px-2' to='/profile'>{user?.name}</Link>
                    </div>
                    

                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >   
                    content
                    
                    <ContentSwitch contentid={content}/>
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutAnt;