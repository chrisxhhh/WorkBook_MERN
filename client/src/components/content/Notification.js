import React from 'react';
import { Tabs, List, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import { reloadUserData } from '../../redux/userSlice';
import toast from 'react-hot-toast';
import axios from 'axios';

const { TabPane } = Tabs;

function Notification() {
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch()
    //console.log(user.unseenNotification)
    const onChange = (key) => {
        console.log(key);
    };
    const markAllAsRead = async()=>{
        try {
            dispatch(showLoading());
            
            const response = await axios.post(
                "/api/user/mark-all-as-read", {userId : user._id}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(reloadUserData(true))
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("Something went wrong!");
        }
    }
    const deleteAll = async()=>{
        try {
            dispatch(showLoading());
            
            const response = await axios.post(
                "/api/user/delete-all", {userId : user._id}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(reloadUserData(true))
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("Something went wrong!");
        }
    }

    return (
        <div>
            <h3>Notification</h3>
            <Tabs defaultActiveKey="1" onChange={onChange}>
                <TabPane tab="Unread" key="1">
                    
                    <List
                        footer={<p> </p>}
                        dataSource={user.unseenNotification}
                        renderItem={(item) => <List.Item>{item.message}</List.Item>}
                        
                    />
                    <div className='d-flex justify-content-end'>
                        <Button onClick={()=>{markAllAsRead()}}>Mark All as Read</Button>
                    </div>
                </TabPane>
                <TabPane tab="Read" key="2">
                    
                    
                    <List
                        footer={<p> </p>}
                        dataSource={user.seenNotification}
                        renderItem={(item) => <List.Item>{item.message}</List.Item>}
                        
                    />
                    <div className='d-flex justify-content-end'>
                        <Button onClick={()=>{deleteAll()}}>Delete All</Button>
                    </div>
                </TabPane>
            </Tabs>
        </div>
    )
}

export default Notification

