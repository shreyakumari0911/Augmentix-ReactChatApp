const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');


router.get("/timelines/video", async(req, res)=>{
    try {
        // Fetch all posts where the type is "video"
        const videoPosts = await Post.find({ type: "video" });
    
        // Return the posts in the response
        res.status(200).json(videoPosts);
      } catch (err) {
        console.error(err); // Log the error for debugging purposes
        res.status(500).json({ error: "An error occurred while fetching video posts." });
      }
});

// Get all posts
router.get("/timelines", async (req, res) => {
    try {
      // Fetch all posts without any filtering
      const posts = await Post.find({}); // This retrieves all posts without applying a filter
  
      // Return the posts in the response
      res.status(200).json(posts);
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json({ error: "An error occurred while fetching posts." });
    }
  });
  

// create a post
router.post("/", async (req, res)=>{
    const newPost = Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }
    catch(err){
        res.status(500).json(err);
    }
})

// update a post
router.put("/:id", async (req, res)=>{
    const post = await Post.findById(req.params.id);
    console.log(post.userId);
    try{
    if(post.userId===req.body.userId){
        await post.updateOne({$set: req.body});
        res.status(200).json("post has been updated");
    }else{
        res.status(403).json("You can update only your posts");
    }}
    catch(err){
        res.status(500).json(err);
    }
})

// delete a post
router.delete("/:id", async (req, res)=>{
    const post = await Post.findById(req.params.id);
    console.log(post.userId);
    try{
    if(post.userId===req.body.userId){
        await post.deleteOne({$set: req.body});
        res.status(200).json("post has been deleted");
    }else{
        res.status(403).json("You can delete only your posts");
    }}
    catch(err){
        res.status(500).json(err);
    }
})

// like a post
router.put("/:id/like", async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
    
        if (!post) {
          return res.status(404).json({ message: "Post not found." });
        }
    
        if (!post.likes.includes(req.body.userId)) {
          // Like the post
          await post.updateOne({ $push: { likes: req.body.userId } });
          res.status(200).json("Post has been liked.");
        } else {
          // Dislike the post
          await post.updateOne({ $pull: { likes: req.body.userId } });
          res.status(200).json("Post has been disliked.");
        }
      } catch (err) {
        console.error(err);
        res.status(500).json(err);
      }
});

// get a post
router.get("/:id", async (req, res)=>{
    
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }
    catch(err){
        res.status(500).json(err);
    }
})

// get timeline posts
router.get("/timeline/:userId", async (req, res)=>{
    try{
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({userId: currentUser._id});
        const friendsPosts=await Promise.all(
            currentUser.following.map((friendId)=>{
                return Post.find({userId: friendId});
            })
        );
        res.status(200).json(userPosts.concat(...friendsPosts));
    }
    catch(err){
        res.status(500).json(err);
    }
})

// get user all posts
router.get("/profile/:username", async (req, res)=>{
    try{
        const user= await User.findOne({username:req.params.username});
        const posts=await Post.find({userId: user._id});
        res.status(200).json(posts);
    }
    catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;