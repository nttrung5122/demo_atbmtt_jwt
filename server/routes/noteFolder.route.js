const router = require('express').Router();
const noteFolderController = require("../controllers/noteFolder.controller");
const noteFolderMiddleware = require("../middleware/noteFolder.middleware");



router.put("/:idFolder",noteFolderMiddleware.verifyOwnerFolder,
            noteFolderController.updateFolder);
router.delete("/:idFolder",noteFolderMiddleware.verifyOwnerFolder,
            noteFolderController.deleteFolder);
router.post("/changePassword/:idFolder",noteFolderMiddleware.verifyOwnerFolder,
            noteFolderController.changePassword);
router.get("/",noteFolderController.getAllFolder);
router.post("/",noteFolderController.createFolder);


module.exports = router;
