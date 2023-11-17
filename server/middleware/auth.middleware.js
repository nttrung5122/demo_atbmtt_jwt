
const jwtService = require("../services/jwt.service");

const  authMiddleware = {

    verifyToken: (req, res, next) => {
        try {
            const [bearerToken, accessToken] = req.headers?.authorization?.split(" ");
            // console.log(accessToken);
            if (bearerToken !== "Bearer")
                return res.status(401).json("not authenticated");
            if(accessToken){
                jwtService.verifyAccessToken(accessToken,(err,payload) => {
                    if(err){
                        return res.status(403).json(err);
                    }
                    req.user = payload;
                    next();
                    // return res.status(403).json(payload);
    
                });
            }else{
                return res.status(401).json("not authenticated");
            }
        } catch (error) {
            res.status(500).json(error);
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