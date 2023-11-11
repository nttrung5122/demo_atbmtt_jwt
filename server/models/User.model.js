const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        minLenght: 8,
        maxLenght: 20,
        unique: true
    },
    email:{
        type: String,
        required: true,
        minLenght: 10,
        maxLenght: 50,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minLenght: 8,
    },
    refreshKey:{
        type: String,
        default:null,
    },
    type:{
        type: String,
        default:"user"
    },
    
},
{timestamps:true}
)

module.exports = mongoose.model("User",userSchema)