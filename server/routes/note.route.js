const router = require('express').Router();
const noteController = require("../controllers/note.controller");
const noteMiddleware = require("../middleware/note.middleware");


router.get("/allNote",noteController.getAll);
router.get("/:idNote",noteMiddleware.verifyOwner,noteController.getNote);
router.put("/:idNote",noteMiddleware.verifyOwner,noteController.updateNote);
router.delete("/:idNote",noteMiddleware.verifyOwner,noteController.deleteNote);
router.post("/",noteController.createNote);


module.exports = router;
