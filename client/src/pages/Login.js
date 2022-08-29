import React from 'react';
import {
  Button,
  Form,
  Input,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {  useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import store from '../redux/store';



function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async(values) => {
    try{
      dispatch(showLoading());
      store.dispatch({type: 'USER_LOGOUT'});
      const response = await axios.post('/api/user/login',values);
      dispatch(hideLoading())
      if (response.data.success){
          toast.success(response.data.message);
          toast("redicrected to home page")
          //console.log(response.data.data);
          localStorage.setItem("token", response.data.data);
          navigate('/');
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
        <h1 className='welcome-title'>Welcome Back to </h1>
        <h1 className='brand'>WorkBook</h1>
        <Form layout='vertical' onFinish={onFinish}>
          
          <Form.Item label='Email' name='email'>
            <Input type='email' placeholder='email' />
          </Form.Item>
          <Form.Item label='Password' name='password'>
            <Input type='password' placeholder='password' />
          </Form.Item>
          <Button className='primary-button my-2' htmlType='submit' >Login</Button>
          <Link to='/register' className='anchor mt-2' >CLICK TO REGISTER</Link>
        </Form>
      </div>
    </div>
  )
}

export default Login