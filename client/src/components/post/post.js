import React, { useState, useEffect, useContext, useRef } from 'react'
import './post.css';
import {MoreVert, Favorite, ThumbUp, Comment, Edit, Check, PermMedia} from  '@material-ui/icons';
import axios from "axios";
import { format } from "timeago.js";
import {Link} from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import {isImage, isVideo} from "../../utils/imageType"; 
import { UpdateDeleteOption } from './UpdateDeleteOption';
import {getGoogleDriveImageUrl} from "../../utils/imageType";

export default function Post({post}) {
    const [like, setlike]=useState(post.likes.length);
    const [imageUrl, setImageUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState("");
    const desc=useRef();
    const [file, setFile]=useState(null);
    const [updateModal, setUpdateModal] = useState(false);
    const [isliked, setisliked]=useState(false);
    const [user, setUser]=useState(null); //user of each post
    const [currentUser, setCurrentUser] = useState(null); //login user
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [showEditDelete, setShowEditDelete] = useState(false);
    useEffect(()=>{
      if(localStorage.getItem("user")){
        setCurrentUser(JSON.parse(localStorage.getItem("user")));
      }
    },[localStorage.getItem("user")]);
    useEffect(() => {
        const fetchUsers = async ()=>{
          const res=await axios.get(`/user?userId=${post.userId}`);
          setUser(res.data);
          console.log("post image", post);
        }
        fetchUsers();
      },[post.userId]);
      useEffect(()=>{
        if(post?.img){
          if(post?.type=="image"){
            const fetchimage = async ()=>{
              try {
                const res = await axios.get(`/image/${post?.img}`, { responseType: 'blob' }); // Specify response type as 'blob'
                
                // Create a URL from the blob
                const imageUrl = URL.createObjectURL(res.data);
                setImageUrl(imageUrl);
                
                console.log(res);
              } catch (error) {
                console.error('Error fetching image:', error);
              }
            }
            fetchimage();
          }
          if(post?.type=="video"){
            const fetchVideo = async () => {
              try {
                setLoading(true);
                // Fetch the video from the backend API
                const response = await axios.get(`/image/${post?.img}`, {
                  responseType: 'blob' // Set the response type to blob for binary data
                });
                // Create a URL for the video
                const videoObjectUrl = URL.createObjectURL(response.data);
                setVideoUrl(videoObjectUrl);
              } catch (error) {
                // setError('Failed to fetch video');
              } finally {
                setLoading(false);
              }
            };
        
            fetchVideo();
            return () => {
              if (videoUrl) {
                URL.revokeObjectURL(videoUrl);
              }
        
          }
        }
      }
},[post?.img]);
      useEffect(()=>{
        if(user?.ProfilePicture){
          const fetchimage = async ()=>{
            try {
              const res = await axios.get(`/image/${user?.ProfilePicture}`, { responseType: 'blob' }); // Specify response type as 'blob'
              
              // Create a URL from the blob
              const imageUrl = URL.createObjectURL(res.data);
              setProfileImage(imageUrl);
              
              console.log(res);
            } catch (error) {
              console.error('Error fetching image:', error);
            }
          }
          fetchimage();
        }
      },[user?.ProfilePicture]);
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
      let fileId;
      if(file){
        const data=new FormData();
        const filename = Date.now()+file.name;
        data.append("name", filename);
        data.append("file", file);
        newPost.type=isImage(filename)?"image": "video"; 
        try{
            const res = await axios.post("/upload", data);
            if(res.data.message=="Image uploaded and saved successfully" && res.status==200){
              newPost.img=res.data.fileId;;
            }
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
             <div className="postTopLeft"><Link to={`profile/${user?.username}`} style={{textDecoration: "none"}}>
             <img src={profileImage?profileImage : PF+"noProfile.jpg"} alt={profileImage?profileImage : PF+"noProfile.jpg"} className="postProfileImg"/>
             </Link>
             <span className="postUsername">{user?.username} </span> 
             <span className="postDate"> {format(post?.createdAt)}</span></div>
             <div className="postTopRight"> <MoreVert onClick={()=>{setShowEditDelete((showEditDelete)=>{
              if(showEditDelete){
                setUpdateModal(false);
              }
              return !showEditDelete})}}/>
             {showEditDelete && <UpdateDeleteOption 
             id={post?._id}
             setShowEditDelete={setShowEditDelete} 
             showEditDelete={showEditDelete} 
             setUpdateModal={setUpdateModal} userId={post?.userId}/>}
             
             </div>
             </div>
             
             <div className='postMainSection'>
             <div className="postCenter">
              <span className="postText"> {post?.desc}
               {updateModal && <span><input placeholder={post?.desc}  ref={desc} className="shareInput"/></span> }
                </span>

            <div className='postImgWrapper'> {post?.type=="image" && imageUrl&&  (
              <img className='postImg' src={imageUrl} alt={"unsupported image"} style={{ maxWidth: '100%', height: 'auto' }} />
              )}
              {(post?.type)=="video" && videoUrl && (
                <video className='postImg' controls style={{ maxWidth: '100%', height: 'auto' }}>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              )}
              {
                post?.type=="video" && loading ? <div>loading....</div>: null
              }
            </div>
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
