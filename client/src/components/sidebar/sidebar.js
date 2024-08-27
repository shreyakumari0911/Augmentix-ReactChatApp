import React, { useContext, useEffect, useState } from 'react'
import "./sidebar.css";
import {RssFeed, Bookmark, WorkOutline, HelpOutline, School, Event, PlayCircleFilledOutlined, Group,Chat} from '@material-ui/icons';
import CloseFriend from '../closefriends/closeFriend';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function Sidebar({user}) {
    const [friends, setfriends] = useState([]);
    useEffect(()=>{

        const getFriends= async () => {
          try{
            console.log("gettAllFriends")
            const following = await axios.get("/user/following/"+user?._id);
            setfriends(following.data);
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
              {friends.length>0? <h4>Following</h4>: null}
             {  friends.map((u)=>(<CloseFriend key={u._id} user={u}/>))}
             </ul>
        </div>
           
        </div>
    )
}
