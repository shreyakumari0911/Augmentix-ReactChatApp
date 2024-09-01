const { body } = require('express-validator');
const User = require('../models/User');
const Conversation = require("../models/Conversation");

const router = require('express').Router();


router.put('/:id',(req, res, next) => {
    User.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            res.json(data)
            console.log('User successfully updated!')
        }
    })
})

router.delete('/:id',(req, res, next) => {
    User.findByIdAndDelete(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

// get a user
router.get('/',async (req, res) => {
    const userId=req.query.userId;
    const username=req.query.username;
    if(userId || username){
    try{
        const user=userId ? await User.findById(userId): await User.findOne({username: username});
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    }catch(err){
        res.status(500).json(err);
    }
    }
})

// get friends
router.get("/following/:userId", async (req, res)=>{
    try{
        const user=await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.following.map(friendId=>{
                return User.findById(friendId);
            })
        )
        let friendList=[];
        friends.map(friend=>{
            const {_id, username, profilePicture}= friend;
            friendList.push({_id, username, profilePicture});
        });
        res.status(200).json(friendList);
    }catch(err){
        console.log(err);
    }
})

//followers 
router.get("/followers/:userId", async (req, res)=>{
    try{
        const user=await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followers.map(friendId=>{
                return User.findById(friendId);
            })
        )
        let friendList=[];
        friends.map(friend=>{
            const {_id, username, profilePicture}= friend;
            friendList.push({_id, username, profilePicture});
        });
        res.status(200).json(friendList);
    }catch(err){
        console.log(err);
    }
})

// follow user and following
router.put("/:id/follow", async (req, res)=>{
    if(req.body.followerId!==req.params.id){
        try{
            const currentUser = await User.findById(req.body.followerId);
            const user=await User.findById(req.body.followingId);
            if(!user.followers.includes(req.body.followingId)){
                await user.updateOne({ $push: {followers: req.body.followerId}});
                await currentUser.updateOne({ $push: { following: req.body.followingId}});
                res.status(200).json("user has been followed");
            }else{
                res.status(403).json("you are already following");
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("you cannot follow yourself");
    }
})

// unfollow user
router.put("/:id/unfollow", async (req, res)=>{
    if(req.body.followerId!==req.params.id){
        try{
            const currentUser = await User.findById(req.body.followerId);
            const user=await User.findById(req.body.followingId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({ $pull: {followers: req.body.followerId}});
                await currentUser.updateOne({ $pull: { following: req.params.followingId}});
                res.status(200).json("user has been unfollowed");
            }else{
                res.status(403).json("you are already not following");
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("you cannot unfollow yourself");
    }
});

router.patch("/conversation", async (req, res) => {
    const { senderId, receiverId, conversationId } = req.body;
    // res.json(req.body);

    // Validate input
    if (!senderId || !receiverId || !conversationId) {
        return res.status(400).json({ error: "Sender ID, Receiver ID, and Conversation ID are required" });
    }

    try {
        // Find sender and receiver users
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ error: "Sender or receiver not found" });
        }

        // Update sender's and receiver's conversations
        await User.updateOne(
            { _id: senderId },
            { $addToSet: { conversations: conversationId } } // Use $addToSet to avoid duplicates
        );
        await User.updateOne(
            { _id: receiverId },
            { $addToSet: { conversations: conversationId } }
        );

        res.status(200).json({ message: "Conversation updated successfully" });
    }catch (err) {
        console.error("Error updating conversations:", err, req.body);
        res.status(500).json({ error: "Internal server error"+error });
    }
});

router.delete("/conversation", async(req, res)=>{
    if(req.body.senderId && req.body.receiverId, req.body.conversationId){
        try{
            const sender = await user.findById(req.body.senderId);
            const receiver = await user.findById(req.body.receiverId);
            if(sender){
                await sender.updateOne({$pull: {conversations: req.body.conversationId}});
            }
            if(receiver){
                await sender.updateOne({$pull: {conversations: req.body.conversationId}});
            }
        }catch(err){
            res.status(500).json("error in saving conversation in user table");
        }
    }else{
        res.status(403).json("you cannot save empty");
    }
});

router.get("/conversation", async(req, res)=>{
    try{
        const user=await User.findById(req.body.userId);
        const conversations = await Promise.all(
            user.conversations.map(conversationId=>{
                return Conversation.findById(conversationId);
            })
        )
        let conversation=[];
        conversations.map(conversation=>{
            conversation.push(conversation);
        });
        res.status(200).json(conversations);
    }catch(err){
        console.log(err);
    }
});

module.exports = router