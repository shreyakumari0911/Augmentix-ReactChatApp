import React, { useEffect, useState, useContext } from 'react';
import "./rightbar.css";
import { Add, Remove } from '@material-ui/icons';
import axios from 'axios';
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Unfollow, Follow } from '../../context/AuthActions';
import {getGoogleDriveImageUrl} from "../../utils/imageType";

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(currentUser?.following?.includes(user?._id));

  useEffect(() => {
    if(user){
      setFollowed(currentUser?.following?.includes(user?._id));
      // console.log("righbar follow","\n login user=",currentUser, "\n profile user = ",user, "\n",currentUser.following.includes(user?._id) );
    }
  }, [currentUser, user]);

  useEffect(() => {
    if(user){
    const getFriends = async () => {
      try {
        const followers = await axios.get(`/user/followers/${user?._id}`);
        setFriends(followers.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
    }
    
  }, [user, followed]);

  const handleFollowClick = async () => {
    try {
      if (followed && user && currentUser) {
        await axios.put(`/user/${user._id}/unfollow`, { followerId: currentUser._id, followingId: user._id });
        // dispatch({ type: "UNFOLLOW", payload: user._id  });
        dispatch(Unfollow(user._id))
      } else {
        await axios.put(`/user/${user._id}/follow`, { followerId: currentUser._id, followingId: user._id });
        // dispatch({ type: "FOLLOW", paload: user._id });
        dispatch(Follow(user._id))
      }
      setFollowed(!followed);
    } catch (err) {
      console.log(err);
    }
  };

  const ProfileRightbar = () => (
    <div className='profileRight'>
      {user.username !== currentUser.username && (
        <button className={followed?"rightbarUnfollowButton":"rightbarFollowButton"} onClick={handleFollowClick}>
          {followed ? "Unfollow" : "Follow"}
          {followed ? <Remove /> : <Add />}
        </button>
      )}
      <h4 className="rightbarTitle">User Information</h4>
      <div className="rightbarInfo">
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">City:</span>
          <span className="rightbarInfoValue">{user.city}</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">From:</span>
          <span className="rightbarInfoValue">{user.from}</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">Relationship:</span>
          <span className="rightbarInfoValue">{user.relationship}</span>
        </div>
      </div>
      <h4 className="rightbarTitle">Followers</h4>
      <div className="rightbarFollowings">
        {friends.map((friend) => (
          <Link to={`/profile/${friend?.username}`} style={{ textDecoration: "none" }} key={friend._id}>
            <div className="rightbarFollowing">
              <img
                src={friend?.profilePicture ? friend?.profilePicture : PF + "noProfile.jpg"}
                alt=""
                className="rightbarFollowingImg"
              />
              <span className="rightbarFollowingName">{friend?.username}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : null }
      </div>
    </div>
  );
}
