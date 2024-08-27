import React, { useState, useEffect, useContext, useRef } from 'react'
import './post.css';
import {MoreVert, Favorite, ThumbUp, Comment, Edit, Check, PermMedia} from  '@material-ui/icons';
import axios from "axios";
import { format } from "timeago.js";
import {Link} from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import {isImage, isVideo} from "../../utils/imageType"; 
import { UpdateDeleteOption } from './UpdateDeleteOption';

export default function Post({post}) {
    const [like, setlike]=useState(post.likes.length);
    const desc=useRef();
    const [file, setFile]=useState(null);
    const [updateModal, setUpdateModal] = useState(false);
    const [isliked, setisliked]=useState(false);
    const [user, setUser]=useState({});
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const {user:currentUser}=useContext(AuthContext);
    const [showEditDelete, setShowEditDelete] = useState(false);
    useEffect(() => {
        const fetchUsers = async ()=>{
          const res=await axios.get(`/user?userId=${post.userId}`);
          setUser(res.data);
          console.log("post image", post);
        }
        fetchUsers();
      },[post.userId]);

      const likeHandler=async()=>{
        try{
          //console.log(post._id)
          //console.log(currentUser._id);
        const res = await axios.put(`/posts/${post?._id}/like`,{userId: currentUser._id});
        console.log(res.data);
          if(res.data.includes("Post has been liked.")){
            setlike((like)=>like+1);
          }else{
            setlike((like)=>like-1);
          }
        }catch(err){
          console.log(err);
        }      
        }
    const UpdateHandler = async(e)=>{
      e.preventDefault();
      const newPost={
          userId: user._id,
          desc: desc.current.value,
      }
      if(file){
        const data=new FormData();
        const filename = Date.now()+file.name;
        data.append("name", filename);
        data.append("file", file);
        newPost.img=filename;
        newPost.type=isImage(filename)?"image": "video"; 
        try{
            await axios.post("/upload", data);
        }catch(err){
            console.log(err);
        }
      }
      try{
        await axios.put(`/posts/${post?._id}`, newPost);
        window.location.reload();
     }catch(err){
         console.log(err);
     }
    }
    return (

        <div className="post">
             <div className="postWrapper">
             <div className="postTop">
             <div className="postTopLeft"><Link to={`profile/${user.username}`} style={{textDecoration: "none"}}>
             <img src={user.ProfilePicture?PF+user.ProfilePicture : PF+"noProfile.jpg"} alt="" className="postProfileImg"/>
             </Link>
             <span className="postUsername">{user.username} </span> 
             <span className="postDate"> {format(post?.createdAt)}</span></div>
             <div className="postTopRight"> <MoreVert onClick={()=>{setShowEditDelete((showEditDelete)=>{
              if(showEditDelete){
                setUpdateModal(false);
              }
              return !showEditDelete})}}/>
             {showEditDelete && <UpdateDeleteOption 
             setShowEditDelete={setShowEditDelete} 
             showEditDelete={showEditDelete} 
             setUpdateModal={setUpdateModal}/>}
             </div>
             </div>
             
             <div className='postMainSection'>
             <div className="postCenter">
              <span className="postText"> {post?.desc}
               {updateModal && <span><input placeholder={post?.desc}  ref={desc} className="shareInput"/></span> }
                </span>

            <div className='postImgWrapper'> {isImage(post?.img) && (
              <img className='postImg' src={PF+post.img} alt="Uploaded media" style={{ maxWidth: '100%', height: 'auto' }} />
              )}
              {isVideo(post?.img) && (
                <video className='postImg' controls style={{ maxWidth: '100%', height: 'auto' }}>
                <source src={PF+post.img} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              )}
            {!isImage(post?.img) && !isVideo(post.img) && post.img && (
              <p>Unsupported media type</p> // Fallback for unsupported media types
            )}</div>
             </div>
             </div>

             {updateModal ?<div>
              <label htmlFor="file" className="shareOption"><PermMedia htmlColor="tomato" className="shareIcon"/><span className="shareOptionText">  Photos or Videos
            <input style={{display: "none"}} type="file" id="file" onChange={(e)=>setFile(e.target.files[0])}/>
            </span></label>
            <button onClick={UpdateHandler}>Update</button>
             </div>:<div className="postBottom">
             <div className="postBottomLeft">
              <ThumbUp htmlColor="purple" className="likeIcon" onClick={likeHandler}/><span className="postLikeCounter">{like} people liked it</span></div>
             <div className="postBottomRight"><Comment htmlColor="goldenrod" className="likeIcon"/><span className="postCommentText"># Comments</span></div>
             </div>}
             </div>
             </div>
    )
}
