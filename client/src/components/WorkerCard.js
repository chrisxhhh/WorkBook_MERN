import React, { useState } from 'react'
import { Badge, Button, Card, Col, DatePicker, Descriptions, Form, Input, Modal, Row, Select } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import toast from 'react-hot-toast';


function WorkerCard(props) {
    const [start, setStart] = useState([]);
    //const [end, setEnd] = useState([]);
    const [targetDate, setTargetDate] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [timeFormVisible, setTimeFormVisible] = useState(true);


    const dispatch = useDispatch()

    const worker = props.worker;
    const startTime = new moment(worker.time[0])
    const endTime = new moment(worker.time[1])
    worker.time = [startTime, endTime]
    worker.timeDisplay = [startTime.format("HH:mm"),
    endTime.format("HH:mm")]

    const handleCancel = () => {
        setTargetDate(null)
        setStart([]);
        setTimeFormVisible(true);
        
        setIsModalVisible(false);
    };

    const enterDetail = () => {
        setIsModalVisible(true);
    }

    const disabledDate = (current) => {
        return current && (current < moment().endOf('day') || current > moment().add(7, 'days'));
    };

    const checkDate = async (payload) => {
        try{
            dispatch(showLoading())
            
            payload.workerId = worker._id
            const response = await axios.post("/api/worker/check-date-get-timeslot", payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success){
                //setWorkers(response.data.data.list)
                setTargetDate(payload.date)
                setStart(response.data.timeSlot);
                setTimeFormVisible(false);
            }
        } catch(error){
            dispatch(hideLoading())
            console.log(error)
        }
        
    }
    // const setEndTimeRange = (index) => {
    //     let i = parseInt(index.key);
    //     setEnd(start.slice(i + 1))
    // }
    const bookAppt = async(payload) => {
        try{
            dispatch(showLoading())
            payload.date = targetDate.format("MM/DD/YYYY");
            payload.workerId = worker._id
            const response = await axios.post("/api/worker/book-appointment", payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success){
                toast.success(response.data.message);
                
                handleCancel();
            }
        } catch(error){
            dispatch(hideLoading())
            toast.error("Something went wrong!");
        }
    }


    return (
        <>
            <Card bodyStyle={{ padding: '1rem', paddingBottom: '0' }}
                hoverable
                title={worker.business}
                extra={<Button type="primary" style={{ background: "orangered", borderColor: "orangered" }} onClick={() => { enterDetail() }}>Book</Button>}
            >
                <Row>
                    <Col className='card-description' span={24}>
                        <p className='card-description-text'>{worker.description}</p>
                    </Col>
                </Row>


                <Row justify="end" align="bottom">
                    <Col span={12}><p align='right'>by <b>{worker.firstName} {worker.lastName}</b></p></Col>
                </Row>
            </Card>
            <Modal title={worker.business} visible={isModalVisible} onCancel={handleCancel} footer={null} width={'1000'} destroyOnClose >
                <Descriptions bordered column={4}>
                    <Descriptions.Item label="Business Name" span={4}>{worker?.business}</Descriptions.Item>
                    <Descriptions.Item label="Name" span={1}>{worker?.firstName} {worker?.lastName}</Descriptions.Item>
                    <Descriptions.Item label="Website" span={3}>{worker?.website}</Descriptions.Item>
                    <Descriptions.Item label="Work Email" span={2}>{worker?.email}</Descriptions.Item>
                    <Descriptions.Item label="Work Phone" span={2}>{worker?.phoneNumber}</Descriptions.Item>
                    <Descriptions.Item label="Rate Per Hour" span={2}>${worker?.rate}</Descriptions.Item>
                    <Descriptions.Item label="Work Time" span={2}>{worker?.timeDisplay[0]} - {worker?.timeDisplay[1]}</Descriptions.Item>
                    <Descriptions.Item label="Address" span={4}>{worker?.address}</Descriptions.Item>
                    <Descriptions.Item label="Description" span={4}>{worker?.description}</Descriptions.Item>
                </Descriptions>
                <div className='mt-4'
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} >
                    <Form
                        id='dateForm'
                        layout="inline"
                        onFinish={checkDate}
                    >
                        <Form.Item
                            name="date"
                            rules={[
                                {
                                    required: true,
                                    message: "",
                                },
                            ]}>
                            <DatePicker
                                disabledDate={disabledDate}
                            />
                        </Form.Item>
                    </Form>
                    <Button
                        className='ms-5'
                        form="dateForm"
                        type='primary'
                        htmlType='submit'
                        style={{ background: "orangered", borderColor: "orangered" }}
                    >
                        Check Available Time
                    </Button>

                </div>
                <div style={{
                    
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Form layout='inline' disabled={timeFormVisible} onFinish={bookAppt}>
                        <Form.Item name="startTime" className='in-line-form-item'>
                            {/* <Select style={{ width: 100 }} onChange={(index,option) => { setEndTimeRange(option) }} placeholder="Start"> */}
                            <Select style={{ width: 100 }} placeholder="Start Time">
                                {start.map((time, index) => (
                                    <Select.Option key={index} value={time}>{time}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* <Form.Item name="endTime" className='in-line-form-item'>
                            <Select style={{ width: 100 }} placeholder="End">
                                {end.map((time, index) => (
                                    <Select.Option key={index} value={time}>{time}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item> */}
                        <Form.Item className='in-line-form-item'>
                            <Button htmlType='submit'>Book</Button>
                        </Form.Item>
                    </Form>


                </div>

            </Modal>
        </>
    );
};

export default WorkerCard