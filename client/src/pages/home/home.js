import React, { useContext, useEffect, useState } from 'react'
import Topbar from '../../components/topbar/topbar';
import Sidebar from '../../components/sidebar/sidebar';
import Feed from '../../components/feed/feed';
import Rightbar from '../../components/rightbar/rightbar';
import './home.css';
import { VideoComponent } from '../video/Video';
import { AuthContext } from '../../context/AuthContext';

export default function Home() {
    const {user} = useContext(AuthContext);
    const [videoFilter, setVideoFilter]= useState(false);
    useEffect(()=>{
        if(window.location.href.includes("video")){
            setVideoFilter(true);
            console.log(window.location.href);
        }
    },[window.location.href]);
    return (
        <>
        <Topbar/>
        <div className="homeContainer">
        <div><Sidebar user={user}/></div>
        <div>{videoFilter?  <VideoComponent/>: <Feed videoFilter={videoFilter}/>}</div>
        <div><Rightbar/></div>
        </div>
        
        </>
    )
}
