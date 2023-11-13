const Note = require("../models/Note.model");

const noteController={
    createNote: async (req,res)=>{
        try{
            const newNote = new Note({
                title: req.body.title,
                content: req.body.content,
                owner: req.user
            });
        }catch(err){
            res.status(500).json(error);
        }
    },
    getNote: async (req,res)=>{
        try {
            const idNote = req.params.id;
            const note = await  Note.findById(idNote);
            res.status(200).json(note);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}