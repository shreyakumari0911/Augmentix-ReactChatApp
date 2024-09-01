import React, { useEffect, useState } from 'react'
import './closeFriend.css';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import {getGoogleDriveImageUrl} from "../../utils/imageType";

export default function CloseFriend({user, setSelectedFriend=()=>{}, selectedFriend=null}) {
    const PF=process.env.REACT_APP_PUBLIC_FOLDER;
    const [users, setUsers] = useState(user);
    useEffect(()=>{
        console.log(user);
        setUsers(user);
    },[user]);
    
    return (
        <div onClick={()=>{
            if(selectedFriend==users){setSelectedFriend(null)} 
            else{setSelectedFriend(users)}
            }}>
            {/* <Link to={`/profile/${users?.username}`} style={{ textDecoration: "none" }}> */}
            <li className="sidebarFriend"><img src={users?.profilePicture? "": PF+"noProfile.jpg"}  className="sidebarFriendImg" alt=""/>
             <span className="sidebarFriendName">{users?.username}</span>
             </li>
            {/* </Link> */}
        </div>
    )
}
