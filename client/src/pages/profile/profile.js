import React,{useEffect, useState} from 'react';
import './profile.css';
import Topbar from '../../components/topbar/topbar';
import Sidebar from '../../components/sidebar/sidebar';
import Feed from '../../components/feed/feed';
import Rightbar from '../../components/rightbar/rightbar';
import axios from "axios";
import { useParams } from 'react-router-dom';
import {getGoogleDriveImageUrl} from "../../utils/imageType"

export default function Profile({user}) {
    const PF=process.env.REACT_APP_PUBLIC_FOLDER;
    const [users, setUsers]=useState({});
    const [userCoverImage, setUserCoverImage] = useState("");
    const [userProfileImage, setUserProfileImage]=useState("");
    const {username}=useParams();
    console.log(username)
    useEffect(() => {
      if(username){
        const fetchUsers = async ()=>{
          const res=await axios.get(`/user?username=${username}`);
          console.log("profile ",res.data);
          setUsers(res.data);
        }
        fetchUsers();
      }
      },[username]);
      
    return (
       <>
           <Topbar/>
           <div className="profile">
            <div className='profile-sidebar'>
            <Sidebar user={users}/>
            <Rightbar user={users} />
            </div>
               <div className="profileRight">
                   <div className="profileRightTop">
                   <div className="profileCover">
                   <img src={users?.coverPicture ? userCoverImage: PF+"nocover.jpg" } alt="" className="profileCoverImg"/>
                     <img src={users.profilePicture? userProfileImage: PF+"noProfile.jpg"} alt="" className="profileUserImg" />
                   </div>
                   <div className="profileInfo">
                       <h4 className="profileInfoName">{users.username}</h4>
                       <span className="profileInfoDesc">{users.desc}</span>
                   </div>
                   </div>
                   <div className="profileRightBottom">
                    <Feed username={username} />
                   </div>
               </div>
               
           </div>
       </>
        
    )
}
