import React, { useEffect, useState } from "react";
import "./post.css";
import axios from "axios";
import { Banner } from "../Banner/Banner";

export const UpdateDeleteOption = ({ setShowEditDelete, showEditDelete, setUpdateModal, id,userId}) => {
    const [message, setMessage] = useState(null);
    const [postId, setPostId] = useState(id);
    const [deleteId, setDeletedid] = useState(userId);
    useEffect(()=>{
        setPostId(id);
    },[id]);
    useEffect(()=>{
        console.log("userid", userId)
        setDeletedid(userId);
    },[userId]);
    const deletePost = async () => {
        try {
            // Replace with the actual post ID or other parameters as needed
            console.log("deleted by user", deleteId);
            const res = await axios.delete(`/posts/${postId}`, {
                data: { userId: deleteId }
            });

            if (res.status == 200) {
                setMessage("Deleted Successfully!!");
                setTimeout(()=>{
                    setShowEditDelete(false);
                },[2000]);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            setMessage("Failed to delete the post.");
            setTimeout(()=>{
                setShowEditDelete(false);
            },[2000]);
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
