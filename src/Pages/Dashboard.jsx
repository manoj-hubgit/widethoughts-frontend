import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardProfile from '../Components/DashboardProfile';
import DashboardSidebar from '../Components/DashboardSidebar';

const Dashboard = () => {
    const location = useLocation();
    const [tab,setTab]=useState('')
    useEffect(()=>{
        const urlParams =new URLSearchParams(location.search);   //this returns params
        const tabUrl = urlParams.get('tab');               // this returns what is in the tab in our case tab=profile
        if(tabUrl){
            setTab(tabUrl)
        }
    },[location.search])

    return (
        <div className='min-h-screen flex flex-col md:flex-row'>
            <div className='md:w-58'>
                <DashboardSidebar/>
            </div>
            {tab==='profile' && <DashboardProfile/>}
        </div>
    );
};

export default Dashboard;