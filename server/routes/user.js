const router = require('express').Router();
const userController    = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

router.get("/",authMiddleware.verifyToken,userController.getAllUsers);
router.delete("/:id",authMiddleware.verifyTokenAndAdminAuth,userController.deleteUser);

module.exports = router;