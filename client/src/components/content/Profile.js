import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import { Button, Divider, Form, Input, TimePicker, Badge, Descriptions, Modal } from 'antd';
import toast from 'react-hot-toast';
import moment from 'moment';

function Profile() {

    const [userInfo, setUserInfo] = useState(null);
    const [workerInfo, setWorkerInfo] = useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch()




    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            console.log(values);
            setConfirmLoading(true);

            const response = await axios.post(
                "/api/user/updateProfile", {
                ...values,

            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setConfirmLoading(false);
            setIsModalVisible(false);

            if (response.data.success) {
                getWorkerData()
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            setConfirmLoading(false);
            toast.error("Something went wrong!");
        }

    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };



    const getWorkerData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get('/api/worker/get-profile-info-by-userId', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                const createTime = new Date(response.data.userInfo.createdAt);
                response.data.userInfo.createdAt = createTime.toDateString();

                // setWorkerInfo(response.data.workerInfo)
                if (response.data.workerInfo) {
                    let badgeStatus = 'success';
                    switch (response.data.workerInfo.status) {
                        case "approval":
                            badgeStatus = "success";
                            break;
                        case "Pending":
                            badgeStatus = "warning";
                            break;
                        case "Blocked":
                            badgeStatus = "error";
                            break;
                        default:
                            badgeStatus = "success";
                            break;
                    }
                    response.data.workerInfo.badgeStatus = badgeStatus;

                    const startTime = new moment(response.data.workerInfo.time[0])
                    const endTime = new moment(response.data.workerInfo.time[1])
                    console.log(response.data.workerInfo)
                    response.data.workerInfo.time = [startTime, endTime]
                    response.data.workerInfo.timeDisplay = [startTime.format("HH:mm"),
                    endTime.format("HH:mm")]


                }
                setUserInfo(response.data.userInfo);
                setWorkerInfo(response.data.workerInfo)

            }
        } catch (error) {
            dispatch(hideLoading())
            console.log(error)
        }
    }

    useEffect(() => {
        getWorkerData();

    }, [])

    return (
        <div>
            <Descriptions title="User Info" bordered >
                <Descriptions.Item label="Username">{userInfo?.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{userInfo?.email}</Descriptions.Item>
                <Descriptions.Item label="Work Eligibility">{userInfo?.isWorker ? "Yes" : "No"}</Descriptions.Item>
                <Descriptions.Item label="Joined Since" span={3}>{userInfo?.createdAt.slice(0)}</Descriptions.Item>
            </Descriptions>

            <br />
            <Descriptions title="Business Info" bordered column={4}>
                <Descriptions.Item label="Business Name" span={4}>{workerInfo?.business}</Descriptions.Item>
                <Descriptions.Item label="Name" span={1}>{workerInfo?.firstName} {workerInfo?.lastName}</Descriptions.Item>
                <Descriptions.Item label="Website" span={3}>{workerInfo?.website}</Descriptions.Item>
                <Descriptions.Item label="Work Email" span={2}>{workerInfo?.email}</Descriptions.Item>
                <Descriptions.Item label="Work Phone" span={2}>{workerInfo?.phoneNumber}</Descriptions.Item>
                <Descriptions.Item label="Rate Per Hour" span={2}>${workerInfo?.rate}</Descriptions.Item>
                <Descriptions.Item label="Status" span={2}>
                    <Badge status={workerInfo?.badgeStatus} text={workerInfo?.status} />
                </Descriptions.Item>
                <Descriptions.Item label="Work Time" span={4}>{workerInfo?.timeDisplay[0]} - {workerInfo?.timeDisplay[1]}</Descriptions.Item>
                <Descriptions.Item label="Address" span={4}>{workerInfo?.address}</Descriptions.Item>
                <Descriptions.Item label="Description" span={4}>{workerInfo?.description}</Descriptions.Item>
            </Descriptions>

            <Button type="primary" onClick={showModal} style={{ marginTop: '1rem', float: 'right' }}>
                Update Information
            </Button>
            <Modal title="Update Profile"
                visible={isModalVisible}
                onCancel={handleCancel}

                footer={[
                    <Button key="cancel" onClick={handleCancel} >
                        Cancel
                    </Button>,
                    <Button key="submit" form='updateForm' htmlType='submit' type='primary' loading={confirmLoading} >
                        Submit
                    </Button>,
                ]}

            >
                <Form
                    id="updateForm"
                    layout="vertical"
                    name="update profile"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    autoComplete="off"
                    onFinish={handleSubmit}
                >
                    <h3>Personal Info</h3>

                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                        initialValue={userInfo?.name}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Login Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                type: 'email',
                                message: 'Please input your work email!',
                            },
                        ]}
                        initialValue={userInfo?.email}
                    >
                        <Input />
                    </Form.Item>


                    <div hidden={!userInfo?.isWorker}>

                        <Divider />


                        <h3>Business Info</h3>
                        <Form.Item
                            label="First Name"
                            name="firstName"
                            rules={[
                                {
                                    required: userInfo?.isWorker,
                                    message: 'Please input your first name!',
                                },
                            ]}
                            initialValue={workerInfo?.firstName}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Last Name"
                            name="lastName"
                            rules={[
                                {
                                    required: userInfo?.isWorker,
                                    message: 'Please input your last name!',
                                },
                            ]}
                            initialValue={workerInfo?.lastName}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Business Title"
                            name="business"
                            rules={[
                                {
                                    required: userInfo?.isWorker,
                                    message: 'Please enter what you do',
                                },
                            ]}
                            initialValue={workerInfo?.business}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Phone Number"
                            name="phoneNumber"
                            rules={[
                                {
                                    required: userInfo?.isWorker,
                                    message: 'Please input your phone number!',
                                },
                            ]}
                            initialValue={workerInfo?.phoneNumber}
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
                            initialValue={workerInfo?.website}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            name="address"
                            initialValue={workerInfo?.address}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Rate"
                            name="rate"
                            rules={[
                                {
                                    required: userInfo?.isWorker,
                                    type: Number,
                                    message: 'Please enter expected salary per hour',
                                },
                            ]}
                            initialValue={workerInfo?.rate}
                        >
                            <Input addonAfter="Per Hour" />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            initialValue={workerInfo?.description}
                        >
                            <Input.TextArea />
                        </Form.Item>

                        <Form.Item
                            label="Work Hour"
                            name="time"
                            rules={[
                                {
                                    required: userInfo?.isWorker,
                                    message: 'Please input your available work hour!',
                                },
                            ]}
                            initialValue={workerInfo?.time}

                        >
                            {/* {console.log(typeof workerInfo?.time[0])} */}
                            <TimePicker.RangePicker

                                showTime={{

                                    format: "HH:mm"
                                }}
                            />

                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default Profile