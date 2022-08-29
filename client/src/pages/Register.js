import React from 'react';
import { 
    Button, 
        Form,
        Input,
     } from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async(values) => {
        
        try{
            dispatch(showLoading());
            const response = await axios.post('/api/user/register',values);
            dispatch(hideLoading());
            if (response.data.success){
                toast.success(response.data.message);
                navigate('/login');
            }else{
                toast.error(response.data.message);
            }
        }catch(error){
            dispatch(hideLoading());
            toast.error("Something went wrong!");
        }
    };



  return (
    <div className='auth'>
        <div className='auth-form card p-3'>
            <h1 className='welcome-title'>Welcome to </h1> 
            <h1 className='brand'>WorkBook</h1>
            <Form layout='vertical' onFinish={onFinish}>
                <Form.Item label='Name' name='name'>
                    <Input placeholder='name'/>
                </Form.Item>
                <Form.Item label='Email' name='email'>
                    <Input type='email' placeholder='email'/>
                </Form.Item>
                <Form.Item label='Password' name='password'>
                    <Input type='password' placeholder='password'/>
                </Form.Item>
                <Button className='primary-button my-2' htmlType='submit' >REGISTER</Button>
                <Link to='/login' className='anchor mt-2' >CLICK TO LOGIN</Link>
            </Form>
        </div>
    </div>
  )
}

export default Register