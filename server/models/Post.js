const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
        userId:{
            type: String,
            required: true
        },
        desc: {
            type: String,
            max: 500   
        },
        type: {
            type: String,
        },
        img:{
            type: String
        },
        likes:{
            type: Array,
            default: []
        },
        comments:{
            type: Array,
            default: []
        },
        createdAt:{
            type: Date
        },
        updatedAt:{
            type: Date
        }
},
{
    timestamps: true
},  {
   collection : 'posts' 
})

module.exports = mongoose.model("Post", PostSchema);
