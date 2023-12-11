const Note = require("../models/note.model");
const User = require("../models/user.model");
const Folder = require("../models/noteFolder.model");
const cryptoJsService = require("../services/crypto.service");
const bcrypt = require('bcrypt');


const noteController={
    createNote: async (req,res)=>{
        try{
            const newNote = new Note({
                title: cryptoJsService.encrypt(req.body.title,req.body?.password),
                content:cryptoJsService.encrypt(req.body.content,req.body?.password),
                owner: req.user._id,
                folder: req.body.folder
            });

            const note = await newNote.save();
            const user = await User.findById(req.user._id);
            user.listNote.push(note._id);
            await user.save();

            note.title = cryptoJsService.decrypt(note.title,req.body?.password);
            note.content = cryptoJsService.decrypt(note.content,req.body?.password);
            
            res.status(200).json(note);

        }catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    },
    getNote: async (req,res)=>{
        try {
            const idNote = req.params.idNote;
            const note = await  Note.findById(idNote);
            
            const folder = await Folder.findById(note.folder);

            if(folder.havePassword && !req.body?.password) {
                if(!req.body?.password){
                    return res.status(401).json("wrong password");
                }

                const validPassword = await bcrypt.compare( req.body.password,folder.password);
                if(!validPassword){
                    return res.status(401).json("wrong password");
                }
            }
            // console.log(note);
            // console.log(req.body?.password);
            // console.log(cryptoJsService.decrypt(note.title,req.body?.password));

            note.title = cryptoJsService.decrypt(note.title,req.body?.password);
            note.content = cryptoJsService.decrypt(note.content,req.body?.password);
            res.status(200).json(note);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getNoteInFolder: async (req, res) => {
        try {
            const notes = await  Note.find({
                folder: req.params.idFolder
            });

            const folder = await Folder.findById(req.params.idFolder);

            if(folder.havePassword && !req.body?.password) {
                if(!req.body?.password){
                    return res.status(401).json("wrong password");
                }

                const validPassword = await bcrypt.compare( req.body.password,folder.password);
                if(!validPassword){
                    return res.status(401).json("wrong password");
                }
            }

            const newNotes = notes.map((note)=>{
                note.title = cryptoJsService.decrypt(note.title,req.body?.password);
                note.content = cryptoJsService.decrypt(note.content,req.body?.password);
                return note;
            })
            res.status(200).json(newNotes);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateNote: async (req,res)=>{
        try{
            const idNote = req.params.idNote;
            const note = await  Note.findById(idNote);
            
            const folder = await Folder.findById(note.folder);

            if(folder.havePassword && !req.body?.password) {
                if(!req.body?.password){
                    return res.status(401).json("wrong password");
                }

                const validPassword = await bcrypt.compare( req.body.password,folder.password);
                if(!validPassword){
                    return res.status(401).json("wrong password");
                }
            }

            note.content = cryptoJsService.encrypt(req.body?.content,req.body?.password) ||note.content;
            note.title = cryptoJsService.encrypt(req.body?.title,req.body?.password) ||note.title;
            const newNote = await note.save();
            res.status(200).json(newNote);
        }catch(error){
            res.status(500).json(error);
        }
    },
    deleteNote: async (req, res) => {
        try {
            const user = await User.findById(req.user._id);

            const idNote = req.params.idNote;
            await Note.findByIdAndDelete(idNote);
            
            user.listNote = user.listNote.filter((note)=> {
                return note._id != idNote;
            } );
            
            await user.save();
            res.status(200).json("success");
        } catch (error) {
            res.status(500).json(error);
        }
    }


}

module.exports = noteController;