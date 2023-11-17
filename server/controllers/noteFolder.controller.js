const Folder = require("../models/noteFolder.model");
const User = require("../models/user.model");
const Note = require("../models/note.model");
const cryptoJsService = require("../services/crypto.service");

const noteFolderController = {
    createFolder:async (req,res) => {
        try {
            const newFolder = new Folder({
                title: cryptoJsService.encrypt(req.body.title),
                owner: req.user._id
            });

            const folder = await newFolder.save();
            const user = await User.findById(req.user._id);
            user.listFolder.push(folder._id);
            await user.save();

            res.status(200).json(folder);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateFolder: async(req,res) => {
        try {
            const folder = await Folder.findById(req.params.idFolder);
            folder.title = cryptoJsService.encrypt(req.body.title);
            await folder.save();
            res.status(200).json(folder);
        } catch (error) {   
            res.status(500).json(error);
        }
    },
    getAllFolder: async (req,res) => {
        try {
            const folders = await Folder.find({
                owner: req.user._id
            }) 
            const newfolders = folders.map(folder => {
                folder.title = cryptoJsService.decrypt(folder.title);
                return folder;
            });
            res.status(200).json(newfolders);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    deleteFolder: async (req,res) => {
        try {
            const user = await User.findById(req.user._id);

            await Folder.findByIdAndDelete(req.params.idFolder);
            user.listFolder = user.listFolder.filter((folder)=> {
                return folder._id != req.params.idFolder;
            } );

            const notes = await Note.find({folder: req.params.idFolder});

            notes.forEach((note)=>{
                user.listNote = user.listNote.filter((note1)=> {
                    return ! note1._id.equals(note._id);
                } );
            })

            await Note.deleteMany({folder: req.params.idFolder});
            await user.save();

            res.status(200).json("success");
        } catch (error) {   
            res.status(500).json(error);
        }
    },
}

module.exports = noteFolderController;
