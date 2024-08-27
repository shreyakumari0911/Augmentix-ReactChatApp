import React, { useEffect, useState } from 'react'
import { format } from 'timeago.js'
import './message.css';
import axios from "axios";

export default function Message({message, own,otheruser,curruser}) {
    const [users, setUser]=useState(null);
    const PF= process.env.REACT_APP_PUBLIC_FOLDER;
    useEffect(()=>{
        const u= own===true? curruser: otheruser;
        setUser(u);
        console.log(own,curruser, otheruser);
    },[own]);
    
    return (
        
        <>
        
            <div className={own === true ? "message own": "message"}>
            <div className="messageTop">
            
                <img className="messageImg" src={users?.profilePicture ? PF+users?.profilePicture : PF+'noProfile.jpg'} alt="" />
                <span className="messageSender">{users?.username}</span>
                <div>
                <div>
                {message?.imageUrl ? (message?.type=="image"? <img className='postImg' src={PF+message?.imageUrl} alt={"Uploaded media"+PF+message?.imageUrl} style={{ maxWidth: '200px', height: 'auto' }} />:  
                <video className='postImg' controls style={{ maxWidth: '200px', height: 'auto' }}>
                <source src={PF+message?.imageUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>):null}
              </div>
              <div>{message?.text?<p className="messageText">{message?.text}</p>: null}</div>
                </div>
                
            </div>
            <div className="messageBottom">
                {format(message?.createdAt)}
            </div>
            </div>
        </>
        
    )
}
