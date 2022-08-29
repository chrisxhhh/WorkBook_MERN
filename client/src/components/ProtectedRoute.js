import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUser, reloadUserData } from '../redux/userSlice';
import { hideLoading, showLoading } from '../redux/alertsSlice';

function ProtectedRoute(props) {
    const {user, reloadUser} = useSelector(state => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getUser = async () => {
        try {
            dispatch(showLoading);
            const response = await axios.post('/api/user/get-user-info-by-id', { token: localStorage.getItem('token') }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(hideLoading);
            if (response.data.success){
                console.log(response.data);
                dispatch(setUser(response.data.data));
                dispatch(reloadUserData(false));
            }else{
                localStorage.clear();
                navigate('/login');
            }
        } catch (error) {
            localStorage.clear();
            navigate('/login');
            dispatch(hideLoading);
        }
    };

    useEffect(() => {
        
        if (!user || reloadUser) {
            getUser()
        }
        
    }, [user, reloadUser])

    if (localStorage.getItem('token')) {
        return props.children
    } else {
        console.log("here4")
        return <Navigate to="/login" />
    }
}

export default ProtectedRoute