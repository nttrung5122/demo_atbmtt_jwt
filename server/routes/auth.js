const router = require('express').Router();
const authController    = require("../controllers/authController");


router.post('/register',authController.registerUser );
router.post('/login',authController.logIn );
router.post('/logout',authController.logOut );
router.post('/refresh',authController.refreshToken );


module.exports = router;
