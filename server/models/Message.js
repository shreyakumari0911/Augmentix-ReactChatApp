const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
conversationId:{
    type: String
},
sender:{
type: String
},text:{
type: String
},
imageUrl: {
    type: String,
},
type:{
    type: String
}
},{
    timestamps: true
},{
    collections: 'messages'
});

module.exports = mongoose.model("Message", MessageSchema);