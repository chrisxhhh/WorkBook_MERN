import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ApplyWorker from './content/ApplyWorker';
import BookedPage from './content/BookedPage';
import HomeContent from './content/HomeContent';
import Notification from './content/Notification';
import Profile from './content/Profile';
import Users from './content/Users';
import Workers from './content/Workers';


function ContentSwitch(props) {
    const navigate = useNavigate();
    //const [logoutClick, setLogoutClick] = useState(false);

    let tab = <HomeContent/>;

    switch (props.contentid){
        case 'home':
            tab = <HomeContent/>;
            break;
        case 'bookedService':
            tab = <BookedPage/>;
            break;
        case 'apply-for-worker':
            tab = <ApplyWorker/>;
            break;
        case 'profile':
            tab = <Profile/>;
            break;
        case 'logout':
            break;
        case 'notification':
            tab = <Notification/>;
            break;
        case 'users':
            tab = <Users/>;
            break;
        case 'workers':
            tab = <Workers/>;
            break;

        default:
            tab = <HomeContent/>;
            break;
    }

    useEffect( () =>{
        
        if (props.contentid === 'logout'){
            
            localStorage.clear();
            
            toast.success("Log out successfully");
            navigate('/login');
            
        }
    })


    


  return (
    <div>
    {tab}
    </div>

  )
}

export default ContentSwitch