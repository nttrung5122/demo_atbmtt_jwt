const Folder = require("../models/noteFolder.model");
const User = require("../models/user.model");
const Note = require("../models/note.model");
const cryptoJsService = require("../services/crypto.service");
const bcrypt = require('bcrypt');

const noteFolderController = {
    createFolder:async (req,res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            let password = null;
            if(req.body?.password){
                password = await bcrypt.hash(req.body.password,salt);
            }
            console.log(password);
            const newFolder = await new Folder({
                title: cryptoJsService.encrypt(req.body.title),
                owner: req.user._id,
                havePassword: req.body?.password ? true : false,
                password: password || null,
            });

            const folder = await newFolder.save();
            const user = await User.findById(req.user._id);
            user.listFolder.push(folder._id);
            await user.save();
            folder.title = cryptoJsService.decrypt(folder.title);
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
    changePassword: async (req, res) => {
        try {
            const oldPassword = req.body?.oldPassword;
            const newPassword = req.body?.newPassword;
            // console.log(oldPassword, newPassword);
            
            const folder = await Folder.findById(req.params.idFolder);
            
            if(!folder.havePassword){
                return res.status(401).json("1 wrong password");
            }
            
            if(!oldPassword || !newPassword){
                return res.status(401).json("2 wrong password");
            }
            
            const validPassword = await bcrypt.compare( oldPassword,folder.password);
            if(!validPassword){
                return res.status(401).json("wrong password");
            }
            
            const notes = await Note.find({
                folder: folder._id
            })
            // console.log(notes);
            for(const note of notes){
                const newNote = await Note.findById(note._id);
                // console.log(newNote);
                const title = cryptoJsService.decrypt(newNote.title,oldPassword)
                const content = cryptoJsService.decrypt(newNote.content,oldPassword)
                // console.log(title,content);
                const newTitle = cryptoJsService.encrypt(title,newPassword)
                const newContent  = cryptoJsService.encrypt(content,newPassword)
                newNote.title = newTitle;
                newNote.content = newContent ;
                // console.log(newTitle,newContent);
                await newNote.save();
                
            }
            console.log(1);

            
            const salt = await bcrypt.genSalt(10);
            let password = await bcrypt.hash(req.body.newPassword,salt);
            folder.password = password;
            await folder.save();
            
            res.status(200).json(
                "success"
            );
            // TODO: change password
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

module.exports = noteFolderController;
