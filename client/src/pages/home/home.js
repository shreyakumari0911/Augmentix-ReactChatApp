import React, { useEffect, useState } from 'react'
import Topbar from '../../components/topbar/topbar';
import Sidebar from '../../components/sidebar/sidebar';
import Feed from '../../components/feed/feed';
import Rightbar from '../../components/rightbar/rightbar';
import './home.css';
import { VideoComponent } from '../video/Video';

export default function Home({user}) {
    const [users, setUsers] = useState(user);
    const [videoFilter, setVideoFilter] = useState(false);
    useEffect(()=>{
        if(window.location.href.includes("video")){
            setVideoFilter(true);
            console.log(window.location.href);
        }
    },[window.location.href]);
    useEffect(()=>{
        setUsers(user);
    },[user]);
    return (
        <>
        <Topbar/>
        <div className="homeContainer">
        <div><Sidebar user={users} videoFilter={videoFilter} setVideoFilter={setVideoFilter}/></div>
        <div>{videoFilter?  <VideoComponent/>: <Feed videoFilter={videoFilter}/>}</div>
        <div><Rightbar/></div>
        </div>
        
        </>
    )
}
