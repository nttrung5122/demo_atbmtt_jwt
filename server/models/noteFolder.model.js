const mongoose = require('mongoose');

const noteFolderSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,   
    }
},
{timestamps:true}
)

module.exports = mongoose.model("Note Folder",noteFolderSchema)