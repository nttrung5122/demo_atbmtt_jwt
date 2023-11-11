const User = require("../models/User.model");

const userController = {

    getAllUsers: async (req, res) => {
        try {
            const allUser = await User.find();
            return res.status(200).json(allUser);

        } catch (error) {
            return res.status(500).json(error);
        }
    },


    deleteUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            res.status(200).json("success");
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

module.exports = userController;