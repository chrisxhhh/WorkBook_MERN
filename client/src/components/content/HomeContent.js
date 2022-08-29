import { Col, Row } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../../redux/alertsSlice'
import WorkerCard from '../WorkerCard'

function HomeContent() {
    const [workers, setWorkers] = useState([])
    const dispatch = useDispatch()

    const getAllWorkers = async()=>{
        try {
            dispatch(showLoading())
            const response = await axios.get('/api/admin/get-all-workers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success){
                //console.log(response.data.data.list)
                
                setWorkers(response.data.data.list)
                
            }
        }catch(error){
            dispatch(hideLoading())
        }
    }

    useEffect(() => {
        getAllWorkers()
    }, [])
    return (
        <>


            <div className="row gy-3">
                {workers.map (
                    (workerInfo)=>(
                        
                        <div className="col-12 col-md-6 col-xl-4" key={workerInfo._id} ><WorkerCard worker={workerInfo}  /></div>
                    )
                )}
                
            </div>
        </>
    )
}

export default HomeContent