const router = require('express').Router();
const authMiddleware = require("../middleware/auth.middleware");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const noteRoute = require("./note.route");

router.use("/auth",authRoute);
router.use("/user",userRoute);
router.use("/note",authMiddleware.verifyToken,noteRoute);

// router.get("/",(req,res)=>{
//     res.render("login");
// });

module.exports = router;