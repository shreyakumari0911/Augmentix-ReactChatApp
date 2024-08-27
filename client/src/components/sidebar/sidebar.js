import React, { useEffect, useState } from 'react'
import "./sidebar.css";
import {RssFeed, Bookmark, WorkOutline, HelpOutline, School, Event, PlayCircleFilledOutlined, Group,Chat} from '@material-ui/icons';
import CloseFriend from '../closefriends/closeFriend';
// import Users from '../../User';
import axios from 'axios';

export default function Sidebar({user, videoFilter, setVideoFilter}) {
    const [friends, setfriends] = useState([]);
    useEffect(()=>{

        const getFriends= async () => {
          try{
    
            const following = await axios.get("/user/following/"+user?._id);
            const followers = await axios.get("/user/followers/"+user?._id);
            setfriends(...[...[following.data], ...[followers.data]]);
            //console.log(friendList.data);
        }catch(err){
          console.log(err);
        }
      }
        getFriends();  
      },[user]);
    return (
        <div className="sidebar">
        <div className="sidebarWrapper">
             <ul className="sidebarList">
                <li className="sidebarListItem">
                <RssFeed className="sidebarIcon"/>
                <span><a href='/'>Feed</a></span>
                </li>
                <li className="sidebarListItem">
                <Chat className="sidebarIcon"/>
                <span><a href='/messenger'>Chats</a></span>
                </li>
                <li className="sidebarListItem">
                <PlayCircleFilledOutlined className="sidebarIcon"/>
                <span><a href='/video'>Videos</a></span>
                </li>
             </ul>
             <hr className="sidebarHr"/>
             <ul className="sidebarFriendList">
             {  friends.map((u)=>(<CloseFriend key={u._id} user={u}/>))}
             </ul>
        </div>
           
        </div>
    )
}
