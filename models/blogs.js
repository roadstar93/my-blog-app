var mongoose = require("mongoose");

//Setting up db schema
var blogSchema = new mongoose.Schema({
    title: "String",
    image: "String",
    body: "String",
    date: { type: Date, default: Date.now() }, 
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

//DB Model
module.exports = mongoose.model("Blog", blogSchema);