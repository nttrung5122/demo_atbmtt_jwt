const router = require('express').Router();
const authMiddleware = require("../middleware/auth.middleware");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const noteRoute = require("./note.route");
const noteFolderRoute = require("./noteFolder.route");

router.use("/auth",authRoute);
router.use("/note",authMiddleware.verifyToken,noteRoute);
router.use("/noteFolder",authMiddleware.verifyToken,noteFolderRoute);
router.use("/user",userRoute);
router.use("/",(req, res)=>{
    console.log("connected");
})

// router.get("/",(req,res)=>{
//     res.render("login");
// });

module.exports = router;