const Note = require("../models/note.model");
const User = require("../models/user.model");
const Folder = require("../models/noteFolder.model");
const bcrypt = require('bcrypt');

const noteMiddleware = {
  verifyOwnerNote: async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      // console.log(user.listNote.includes(req.params.idNote));
      if (!user.listNote.includes(req.params.idNote)) {
        return res.status(406).json("you are not owner");
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  verifyPassword: async (req, res, next) => {
    try {
      const idNote = req.params?.idNote;
      const note = await Note.findById(idNote);
      const folder = await Folder.findById(note?.folder || req.body?.folder || req.params?.idFolder);
      if (!folder.havePassword) {
        return next();
      }
      if (!req.body?.password) {
        return res.status(401).json("wrong password");
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        folder.password
      );
      if (!validPassword) {
        return res.status(401).json("wrong password");
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
};

module.exports = noteMiddleware;
