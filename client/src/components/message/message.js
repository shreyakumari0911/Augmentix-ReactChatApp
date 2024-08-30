import React, { useEffect, useState } from 'react'
import { format } from 'timeago.js'
import './message.css';
import axios from "axios";
import {getGoogleDriveImageUrl} from "../../utils/imageType";

export default function Message({message, own,otheruser,curruser}) {
    const [users, setUser]=useState(null);
    const [loading, setLoading] = useState(false);
    const [messageImage, setMessageImage] = useState(null);
    const PF= process.env.REACT_APP_PUBLIC_FOLDER;
    useEffect(()=>{
        const u= own===true? curruser: otheruser;
        setUser(u);
        console.log(own, message);
    },[own]);

    useEffect(()=>{
        if(message?.imageUrl){
          if(message?.type=="image"){
            const fetchimage = async ()=>{
              try {
                const res = await axios.get(`/image/${message?.imageUrl}`, { responseType: 'blob' }); // Specify response type as 'blob'
                
                // Create a URL from the blob
                const imageUrl = URL.createObjectURL(res.data);
                setMessageImage(imageUrl);
                
                console.log(res);
              } catch (error) {
                console.error('Error fetching image:', error);
              }
            }
            fetchimage();
          }
          if(message?.type=="video"){
            const fetchVideo = async () => {
              try {
                setLoading(true);
                // Fetch the video from the backend API
                const response = await axios.get(`/image/${message?.imageUrl}`, {
                  responseType: 'blob' // Set the response type to blob for binary data
                });
                // Create a URL for the video
                const videoObjectUrl = URL.createObjectURL(response.data);
                setMessageImage(videoObjectUrl);
              } catch (error) {
                // setError('Failed to fetch video');
              } finally {
                setLoading(false);
              }
            };
        
            fetchVideo();
            return () => {
              if (messageImage) {
                URL.revokeObjectURL(messageImage);
              }
        
          }
        }
      }
},[message?.imageUrl]);
    
    return (
        
        <>
        
            <div className={own === true ? "message own": "message"}>
            <div className="messageTop">
            
                <img className="messageImg" src={users?.profilePicture ? PF+users?.profilePicture : PF+'noProfile.jpg'} alt="" />
                <span className="messageSender">{users?.username}</span>
                <div>
                <div>
                {message?.imageUrl ? (message?.type=="image"? <img className='postImg' src={messageImage} alt={"Uploaded media is "+message?.imageUrl} style={{ maxWidth: '200px', height: 'auto' }} />:  
                <video className='postImg' controls style={{ maxWidth: '200px', height: 'auto' }}>
                <source src={messageImage} type="video/mp4" />
                Your browser does not support the video tag.
              </video>):null}
              {
                loading ? <div>Loading.....</div>:null
              }
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
