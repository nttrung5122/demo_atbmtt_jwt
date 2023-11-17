const User = require("../models/user.model");

const noteFolderMiddleware = {
    verifyOwnerFolder:async (req, res, next) =>{
        try {
            const user = await User.findById(req.user._id);
            if(!user.listFolder.includes(req.params.idFolder)){
                return res.status(406).json("you are not owner")
            }
            next();
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
}

module.exports = noteFolderMiddleware;