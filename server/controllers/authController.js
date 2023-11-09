const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const authController = {

    generateAccessToken:(data)=>{
        return jwt.sign(
            data,
            process.env.accessKey,
            {
                expiresIn:process.env.accessTokenLife,
                // algorithm:process.env.jwtAlgorithm
            }
        )
    },
    generateRefreshToken:(data)=>{
        return jwt.sign(
            data,
            process.env.refreshKey,
            {
                expiresIn:process.env.refreshTokenLife,
                // algorithm:process.env.jwtAlgorithm
            }
        )
    },

    registerUser: async (req,res)=> {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password,salt);
            
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hash,
            })

            const user = await newUser.save();
            res.status(200).json(user);

        } catch (error) {
            res.status(500).json(error);
        }
    },

    logIn: async (req, res) => {
        try {
            const user = await User.findOne({username: req.body.username});

            if(!user){
                res.status(404).json("wrong username");
            }
            const validPassword = await bcrypt.compare( req.body.password,user.password);

            if(!validPassword){
                res.status(404).json("wrong password");
            }
            if(user && validPassword){
                const {password,refreshKey, ...others} = user._doc
                const accessToken = authController.generateAccessToken(others);
                const refreshToken = authController.generateRefreshToken(others);
                res.cookie("refreshToken",refreshToken,{
                    httpOnly: true,
                    secure: false,
                    sameSite:"strict",
                })
                user.refreshKey= refreshToken;
                await user.save();
                res.status(200).json({others,accessToken});
                // res.status(200).json({others});
            }

        } catch (error) {
            res.status(500).json(error);
        }
    },
    refreshToken:async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        // console.log(req.cookies.refreshToken);
        if(!refreshToken){
            return res.status(401).json("not authorized");
        }

        jwt.verify(refreshToken,process.env.refreshKey,async (err, userInfo) => {
            if(err){
                return res.status(500).json(err);
            }            
            const user = await User.findOne({username: userInfo.username});
            if(user.refreshKey !== refreshToken){
                return res.status(403).json("token invalid");
            }
            const {password,refreshKey, ...others} = user._doc

            const newAccessToken = authController.generateAccessToken(others);
            const newRefeshToken = authController.generateRefreshToken(others);

            user.refreshToken = newRefeshToken;
            user.save();
            res.cookie("refreshToken",newRefeshToken,{
                httpOnly: true,
                secure: false,
                sameSite:"strict",
            });
            res.status(200).json({accessToken:newAccessToken});
        })
    },
    logOut: async (req, res) => {
        res.clearCookie("refreshToken");
        const refreshToken = req.cookies.refreshToken;
        jwt.verify(refreshToken,process.env.refreshKey,async (err, userInfo) => {
            if(err){
                return res.status(500).json(err);
            }            
            const user = await User.findOne({username: userInfo.username});
            user.refreshToken = null;
            await user.save();
        });
        res.status(200).json("Logout: ...");
    }
}

module.exports = authController;