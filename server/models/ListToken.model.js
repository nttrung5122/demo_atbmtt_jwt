const mongoose = require('mongoose');

const listTokenSchema = new mongoose.Schema({
    token:{
        type: String
    }
})

module.exports = mongoose.model("ListToken",listTokenSchema)