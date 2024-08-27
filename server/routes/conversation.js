const router = require('express').Router();
const Conversation = require('../models/Conversation');

//new conversation

router.post("/", async (req, res) => {
    const { senderId, receiverId } = req.body;

    // Validate the input
    if (!senderId || !receiverId) {
        return res.status(400).json({ error: "Sender and receiver IDs are required" });
    }
    
    // Create a new conversation
    const newConversation = new Conversation({
        members: [senderId, receiverId] // Use destructured variables for clarity
    });
    console.log("starting conversation", senderId, receiverId, newConversation)
    try {
        // Save the new conversation to the database
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        console.error("Error saving conversation:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// get conv of a user
router.get("/:userId", async (req, res) => {
    console.log("search a conversation for userId",req.params.userId);
    try {
        // Find conversations where userId is in the members array
        const conversations = await Conversation.find({
            members: { $in: [req.params.userId] }
        });
        res.status(200).json(conversations); // Return the found conversations
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' }); // Send error response
    }
});

module.exports = router;