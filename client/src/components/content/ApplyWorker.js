import React from 'react'
import { Button, Divider, Form, Input, TimePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

function ApplyWorker() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    



    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            values.userId = '123';
            values.status = "pending";
            console.log('Success:', values);
            const response = await axios.post(
                "/api/user/apply-for-worker", {
                ...values,
                userId: user._id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("Something went wrong!");
        }



    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            layout="vertical"
            name="apply"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <h3>Personal Info</h3>
            <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                    {
                        required: true,
                        message: 'Please input your first name!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                    {
                        required: true,
                        message: 'Please input your last name!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Work Email"
                name="email"
                rules={[
                    {
                        required: true,
                        type: 'email',
                        message: 'Please input your work email!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                    {
                        required: true,
                        message: 'Please input your phone number!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Divider />
            <h3>Business Info</h3>
            <Form.Item
                label="Business Title"
                name="business"
                rules={[
                    {
                        required: true,
                        message: 'Please enter what you do',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Website"
                name="website"
                rules={[
                    {
                        type: 'url',
                        message: 'Please enter a valid url',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Address"
                name="address"
            >
                <Input />
            </Form.Item>



            <Form.Item
                label="Rate"
                name="rate"
                rules={[
                    {
                        required: true,
                        type: Number,
                        message: 'Please enter expected salary per hour',
                    },
                ]}
            >
                <Input addonAfter="Per Hour" />
            </Form.Item>

            <Form.Item
                label="Description"
                name="description"
            >
                <Input.TextArea />
            </Form.Item>

            <Form.Item
                label="Work Hour"
                name="time"
                rules={[
                    {
                        required: true,
                        message: 'Please input your available work hour!',
                    },
                ]}
            >
                <TimePicker.RangePicker
                    showTime={{

                        format: "HH:mm"
                    }} />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ApplyWorker