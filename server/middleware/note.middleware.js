const authMiddleware = require("./auth.middleware");
const User = require("../models/User.model");

const noteMiddleware = {
    verifyOwner:async (req, res, next) =>{
        try {
            const user = await User.findById(req.user._id);
            // console.log(user.listNote.includes(req.params.idNote));
            if(!user.listNote.includes(req.params.idNote)){
                return res.status(406).json("you are not owner")
            }
            next();
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
}

module.exports = noteMiddleware;