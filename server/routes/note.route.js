const router = require('express').Router();
const noteController = require("../controllers/note.controller");
const noteMiddleware = require("../middleware/note.middleware");
const noteFolderMiddleware = require("../middleware/noteFolder.middleware");

// note/

router.get("/getNoteInFolder/:idFolder",noteFolderMiddleware.verifyOwnerFolder,
            noteController.getNoteInFolder);
router.get("/:idNote",noteMiddleware.verifyOwnerNote,
            noteController.getNote);
router.put("/:idNote",noteMiddleware.verifyOwnerNote,
            noteController.updateNote);
router.delete("/:idNote",noteMiddleware.verifyOwnerNote,
            noteController.deleteNote);
router.post("/",noteController.createNote);


module.exports = router;
