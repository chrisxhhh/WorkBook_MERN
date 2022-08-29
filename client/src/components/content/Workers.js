import { Button, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import {showLoading, hideLoading} from '../../redux/alertsSlice';

function Workers() {
    const [workers, setWorkers] = useState([])
    const dispatch = useDispatch()

    const getWorkersData=async()=>{
        try {
            dispatch(showLoading())
            const response = await axios.get('/api/admin/get-all-workers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success){
                console.log(response.data.data.list)
                setWorkers(response.data.data.list)
            }
        }catch(error){
            dispatch(hideLoading())
        }
    }

    const changeWorkerStatus = async(record, status) =>{
        try {
            dispatch(showLoading())
            console.log(record)
            const response = await axios.post('/api/admin/change-apply-status', {workerId: record._id, userId: record.userId, status: status} , {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success){
                toast.success(response.data.data.message);
                setWorkers(response.data.data.list)
            }

        }catch(error){
            dispatch(hideLoading())
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text, record)=> (
                <p>{record.firstName} {record.lastName}</p>
            )
            
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
            title: 'Status',
            dataIndex: 'status',
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            render: (text,record) => (
                <div>
                    {record.status === "pending" || record.status === "blocked" ? 
                    <Button onClick={()=>changeWorkerStatus(record, "approval") }>Accept</Button> : 
                    <Button onClick={()=>changeWorkerStatus(record, "blocked") }>Remove</Button>}
                </div>
            )
        }

    ]

    useEffect(()=>{
        getWorkersData();
    }, [])
    return (
        
        <Table rowKey={"_id"} dataSource={workers} columns={columns}/>
    )
}


export default Workers