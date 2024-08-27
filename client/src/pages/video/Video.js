import React, {useEffect, useState} from "react";
import axios from "axios";
import Post from "../../components/post/post";
export const VideoComponent=()=>{
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const fetchPosts = async ()=>{
          console.log("fetching video posts");
          const res= await axios.get(`/posts/timelines/video`);
          console.log(res);
          setPosts(res.data.sort((p1, p2)=>{
            return new Date(p2.createdAt)-new Date(p1.createdAt);
          }));
        }
        fetchPosts();
      },[]);
    return(
        <div className="feed">
          <div>
          {
            posts.map((p)=>(
              <Post key={p._id} post={p}/>
            ))
          }
          </div>
        </div>
    )
}