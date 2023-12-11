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
    },
    havePassword: {
        type: Boolean,
        required: true,
        default: false
    },
    password: {
        type: String,
        default: ""
    }
},
{timestamps:true}
)

module.exports = mongoose.model("Note Folder",noteFolderSchema)