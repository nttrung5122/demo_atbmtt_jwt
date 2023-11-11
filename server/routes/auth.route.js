const router = require('express').Router();
const authController    = require("../controllers/authController");


router.post('/register-jwt',authController.registerUser );
router.post('/login-jwt',authController.logIn );
router.post('/logout-jwt',authController.logOut );
router.post('/refresh-jwt',authController.refreshToken );


module.exports = router;
