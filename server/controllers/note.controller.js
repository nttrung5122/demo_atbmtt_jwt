const Note = require("../models/note.model");
const User = require("../models/user.model");
const Folder = require("../models/noteFolder.model");
const cryptoJsService = require("../services/crypto.service");

const noteController={
    createNote: async (req,res)=>{
        try{
            const newNote = new Note({
                title: cryptoJsService.encrypt(req.body.title),
                content:cryptoJsService.encrypt(req.body.content),
                owner: req.user._id,
                folder: req.body.folder
            });

            const note = await newNote.save();
            const user = await User.findById(req.user._id);
            user.listNote.push(note._id);
            await user.save();

            res.status(200).json(note);

        }catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    },
    getNote: async (req,res)=>{
        try {
            const idNote = req.params.idNote;
            // console.log(idNote);
            const note = await  Note.findById(idNote);
            note.title = cryptoJsService.decrypt(note.title);
            note.content = cryptoJsService.decrypt(note.content);
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

            const newNotes = notes.map((note)=>{
                note.title = cryptoJsService.decrypt(note.title);
                note.content = cryptoJsService.decrypt(note.content);
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
            note.content = cryptoJsService.encrypt(req.body?.content) ||note.content;
            note.title = cryptoJsService.encrypt(req.body?.title) ||note.title;
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