const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    folder:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note Folder",
        required: true,   
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,   
    }

},
{timestamps:true}
)

module.exports = mongoose.model("Note",noteSchema)