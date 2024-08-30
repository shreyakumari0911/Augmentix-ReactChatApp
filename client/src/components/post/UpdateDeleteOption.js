import React, { useEffect, useState } from "react";
import "./post.css";
import axios from "axios";
import { Banner } from "../Banner/Banner";

export const UpdateDeleteOption = ({ setShowEditDelete, showEditDelete, setUpdateModal, id}) => {
    const [message, setMessage] = useState(null);
    const [postId, setPostId] = useState(id);
    useEffect(()=>{
        setPostId(id)
    },[id]);

    const deletePost = async () => {
        try {
            // Replace with the actual post ID or other parameters as needed
            const res = await axios.delete(`/posts/${postId}`);
            if (res.status === 200) {
                setMessage("Deleted Successfully!!");
                setTimeout(()=>{
                    setShowEditDelete(false);
                },[3000]);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            setMessage("Failed to delete the post.");
        }
    };

    const editPost = async () => {
        try {
            // Replace with the actual post update logic
            setUpdateModal(true);
        } catch (error) {
            console.error("Error updating post:", error);
            setMessage("Failed to update the post.");
        }
    };

    const updatePost = async ()=>{
        try{
            // axios.put()
            // if (res.status === 200) {
                setMessage("Updated Successfully!!");                
                setTimeout(()=>{
                    setShowEditDelete(false);
                },[3000]);
            // }
        }catch(err){
            console.error("Error updating post:", err);
            setMessage("Failed to update the post.");
        }
    }

    return (
        <div className="update-delete-wrapper">
            <div className="option" onClick={editPost}>Edit</div>
            <div className="option" onClick={deletePost}>Delete</div>
            {message && <Banner message={message} type={"success"} />}
        </div>
    );
};
