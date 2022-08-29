import { Button, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {showLoading, hideLoading} from '../../redux/alertsSlice';

function Users() {
    const [users, setUsers] = useState([])
    const dispatch = useDispatch()

    const getUsersData=async()=>{
        try {
            dispatch(showLoading())
            const response = await axios.get('/api/admin/get-all-users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success){
                setUsers(response.data.data.list)
            }
        }catch(error){
            dispatch(hideLoading())
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            render: () => (
                <Button>Block</Button>
            )
        }

    ]

    useEffect(()=>{
        getUsersData();
    }, [])
    return (
        
        <Table rowKey={"_id"} dataSource={users} columns={columns}/>
    )
}

export default Users