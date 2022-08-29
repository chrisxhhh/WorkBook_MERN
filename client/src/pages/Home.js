import React, {useEffect} from 'react';
import axios from 'axios';
import LayoutAnt from '../components/LayoutAnt';
//import Layout  from '../components/Layout';



function Home() {

    const getData = async() => {
        try {
            const response = await axios.post('/api/user/get-user-info-by-id', {},
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                });
            
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        getData()
    },[])

    return (
        
        <LayoutAnt/>
    )
}

export default Home