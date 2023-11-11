const jwt = require("jsonwebtoken");

const  authMiddleware = {

    verifyToken: (req, res, next) => {
        const [bearerToken, accessToken] = req.headers.authorization.split(" ");
        // console.log(accessToken);
        if (bearerToken !== "Bearer")
            return res.status(401).json("not authenticated");
        if(accessToken){
            jwt.verify(accessToken, process.env.accessKey,(err,payload) => {
                if(err){
                    return res.status(403).json(err);
                }
                req.user = payload;
                next();
            });
        }else{
            return res.status(401).json("not authenticated");
        }
    },

    verifyTokenAndAdminAuth: (req,res,next)=>{
        authMiddleware.verifyToken(req,res,() => {
            if(req.user.type == "admin" || req.user._id == req.params.id){
                next();
            }else{
                res.status(403).json("you not allowed to access this");
            }
        })
    }


}

module.exports = authMiddleware;