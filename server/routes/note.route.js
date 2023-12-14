const router = require('express').Router();
const noteController = require("../controllers/note.controller");
const noteMiddleware = require("../middleware/note.middleware");
const noteFolderMiddleware = require("../middleware/noteFolder.middleware");

// note/
// router.use(noteFolderMiddleware.verifyPassword);

router.get("/getNoteInFolder/:idFolder",noteFolderMiddleware.verifyOwnerFolder,
            noteMiddleware.verifyPassword,
            noteController.getNoteInFolder);
router.get("/:idNote",noteMiddleware.verifyOwnerNote,
            noteMiddleware.verifyPassword,
            noteController.getNote);
router.put("/:idNote",noteMiddleware.verifyOwnerNote,
            noteMiddleware.verifyPassword,
            noteController.updateNote);
router.delete("/:idNote",noteMiddleware.verifyOwnerNote,
            noteController.deleteNote);
router.post("/",noteMiddleware.verifyPassword,
            noteController.createNote);


module.exports = router;
