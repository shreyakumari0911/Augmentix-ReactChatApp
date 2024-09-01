import React, { useContext, useEffect, useRef, useState } from 'react'
import "./share.css";
import {PermMedia, Label, Room, EmojiEmotions, Cancel} from '@material-ui/icons';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { isImage, isVideo, getGoogleDriveImageUrl } from '../../utils/imageType';

export default function Share() {
    // const {user}=useContext(AuthContext);
    const [user, setUser] = useState(null);
    const PF=process.env.REACT_APP_PUBLIC_FOLDER;
    const desc=useRef();
    const [file, setFile ]= useState(null);
    useEffect(()=>{
        if(localStorage.getItem("user")){
            setUser(JSON.parse(localStorage.getItem("user")));
        }
    },[localStorage.getItem("user")]);
    const submitHandler=async (e)=>{
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
                const res = await axios.post("/upload", data);
                if(res.data.message=="Image uploaded and saved successfully" && res.status==200){
                    newPost.img=res.data.fileId;
                    // newPost.type=res.data.mimetype;
                }

            }catch(err){
                console.log(err);
            }
        }
        try{
           await axios.post("/posts", newPost);
           window.location.reload();
        }catch(err){
            console.log(err);
        }
    }

    return (
        <div className="share">
            <div className="shareWrapper">
            <div className="shareTop">
            <img className="shareProfileImg" src={user?.profilePicture? user.profilePicture: PF+"noProfile.jpg"} alt=""/>
            <input placeholder={"What's in your mind "+user?.username+" ?"}  ref={desc} className="shareInput"/>
            </div>
            <hr className="shareHr"/>
            {file && <div>
                <div className="shareImgContainer">
                    <img className="shareImg" src={URL.createObjectURL(file)} alt=""/>
                    <Cancel className="shareCancelImg" onClick={()=>setFile(null)}/>
                </div>
            </div>}
            <form className="shareBottom" onSubmit={submitHandler}>
        
            <div className="shareOptions">
            <label htmlFor="file" className="shareOption"><PermMedia htmlColor="tomato" className="shareIcon"/><span className="shareOptionText">  Photos or Videos
            <input style={{display: "none"}} type="file" id="file" onChange={(e)=>setFile(e.target.files[0])}/>
            </span></label>
            <div className="shareOption"><Label htmlColor="blue" className="shareIcon"/>  <span className="shareOptionText"> Tag</span></div>
            <div className="shareOption"> <Room htmlColor="green" className="shareIcon"/>  <span className="shareOptionText"> Location</span></div>
            <div className="shareOption"><EmojiEmotions htmlColor="goldenrod" className="shareIcon"/> <span className="shareOptionText"> Feelings</span></div>
            </div>
            <button className="shareButton" type="submit">Share</button>
            </form> 
            </div>
        </div>
    )
}
