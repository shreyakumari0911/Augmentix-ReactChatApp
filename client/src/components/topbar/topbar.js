import React, { useContext, useEffect, useState } from 'react';
import "./topbar.css";
import { Search, ExitToApp, Person, Chat, Notifications } from '@material-ui/icons';
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import { logoutCall } from '../../apiCalls';
import {getGoogleDriveImageUrl} from "../../utils/imageType";

export default function Topbar() {
  const { user, dispatch } = useContext(AuthContext);

  const handleLogout = async () => {
    await logoutCall(null, dispatch);  // Ensure logoutCall dispatches the LOGOUT action
    console.log("User logged out");
  }

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <>
      <div className="topbarContainer">
        <div className="topbarLeft">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="logo">Facebook</span>
          </Link>
        </div>
        <div className="topbarRight">
          <div className="topbarIcons">
            <div className="topbarIconItem">
              <Person />
              <span className="topIconBadge">1</span>
            </div>
            <div className="topbarIconItem">
              <Chat />
              <span className="topIconBadge">2</span>
            </div>
            <div className="topbarIconItem">
              <Notifications />
              <span className="topIconBadge">1</span>
            </div>
            <div className="topbarIconItem" onClick={handleLogout}>
              <ExitToApp />
            </div>
          </div>
          <Link to={`/profile/${user.username}`}>
            <img
              src={user.ProfilePicture ? (user.ProfilePicture) : PF + "noProfile.jpg"}
              alt=""
              className="topbarImg"
            />
          </Link>
        </div>
      </div>
    </>
  );
}
