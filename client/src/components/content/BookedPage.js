import { Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertsSlice';

function BookedPage() {
    const [appts, setAppts] = useState([])

    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch()

    const getUserApptInfo=async()=>{
        try {
            dispatch(showLoading())
            const response = await axios.get('/api/user/get-all-appts', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success){
                console.log(response.data.data.list)
                setAppts(response.data.data.list)
            }
        }catch(error){
            dispatch(hideLoading())
        }
    }

    const WorkerColumns = [
        {
            title: 'name',
            dataIndex: 'userName',
            
        },
        {
            title: 'email',
            dataIndex: 'userEmail',
        },
        {
            title: 'Date',
            dataIndex: 'date',
        },
        {
            title: 'Start Time',
            dataIndex: 'startTime',
        },

        // {
        //     title: 'Created At',
        //     dataIndex: 'createdAt',
        // },

    ]
    const UserColumns = [
        {
            title: 'name',
            dataIndex: 'workerName',
            
        },
        {
            title: 'email',
            dataIndex: 'workerEmail',
        },
        {
            title: 'Date',
            dataIndex: 'date',
        },
        {
            title: 'Start Time',
            dataIndex: 'startTime',
        },

        // {
        //     title: 'Created At',
        //     dataIndex: 'createdAt',
        // },

    ]

    useEffect(()=>{
        
        getUserApptInfo();
        console.log(appts);
    }, [])
    return (
        
        <Table rowKey={"_id"} dataSource={appts} columns={user.isWorker? WorkerColumns : UserColumns}/>
    )
}

export default BookedPage