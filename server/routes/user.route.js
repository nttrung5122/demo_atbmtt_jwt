const router = require('express').Router();
const userController    = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

// jwt
// router.get("/jwt",authMiddleware.verifyToken,userController.getAllUsers);
// router.delete("/jwt/:id",authMiddleware.verifyTokenAndAdminAuth,userController.deleteUser);

router.get("/OTPrequest",userController.OTPrequest);
router.post("/changePassword",userController.changePassword,);


module.exports = router;