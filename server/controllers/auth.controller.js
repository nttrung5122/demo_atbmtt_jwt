const User = require('../models/user.model');
const ListToken = require('../models/note.model');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const jwtService = require("../services/jwt.service");
// const RedisService = require("../services/redis.service");
const Redis = require("ioredis");
const RedisService = new Redis();
// const blackListToken=[];
const authController = {

    registerUser: async (req,res)=> {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password,salt);
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash,
            })

            const user = await newUser.save();
            const {password,refreshKey, ...others} = user._doc;
            res.status(200).json(others);

        } catch (error) {
            res.status(500).json(error);
        }
    },

    logIn: async (req, res) => {
        // return res.status(200).json(req.body.password);
        try {
            const user = await User.findOne({username: req.body.username});

            if(!user){
                return res.status(401).json("wrong username");
            }
            const validPassword = await bcrypt.compare( req.body.password,user.password);

            if(!validPassword){
                return res.status(401).json("wrong password");
            }
            if(user && validPassword){
                const {password,refreshKey,listNote,listFolder, ...others} = user._doc;
                const {accessToken, refreshToken} = jwtService.generate(others);
                // const token = new ListToken({ 
                //     token: refreshToken
                // })
                // await token.save();
                // console.log(accessToken, refreshToken);
                // await User.updateOne({username:req.body.username},{
                //     refreshKey:refreshToken
                // });
                res.cookie("refreshToken",refreshToken,{
                    httpOnly: true,
                    secure: true,
                    // httpOnly: false, // test api
                    // secure: false,
                    sameSite:"None",
                    maxAge: 60 * 60*24 * 1000
                })

                return res.status(200).json({
                    user:others,
                    accessToken: accessToken
                });
                // res.status(200).json({others});
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    refreshToken:async (req, res) => {
        const refreshTokenOld = req?.cookies?.refreshToken;
        // console.log(refreshTokenOld);
        if(!refreshTokenOld){
            return res.status(401).json("not authorized1");
        }

        jwtService.verifyRefreshToken(refreshTokenOld,async (err, userInfo) => {
            if(err){
                return res.status(401).json(err);
            }
            //luu bang redis
            const checkRefreshToken = await RedisService.get(refreshTokenOld);
            // console.log(checkRefreshToken);
            if (checkRefreshToken) 
                return res.status(401).json("Refresh token was already used");

            const {exp,iat, ...data} = userInfo;
            const {accessToken, refreshToken} = jwtService.generate(data);

            await RedisService.set(refreshTokenOld,"1");
            // const test = await RedisService.get(refreshTokenOld);
            // console.log(test,1);
            res.cookie("refreshToken",refreshToken,{
                httpOnly: true,
                secure: true,
                // httpOnly: false, // test api
                // secure: false,
                sameSite:"None",
                maxAge: 60 * 60*24 * 1000
            });
            res.status(200).json({accessToken:accessToken});
        })
    },
    logOut: async (req, res) => {
        res.clearCookie("refreshToken",{
            sameSite:"None",
            secure: true,
        });
        return res.status(200).json("Logout: ...");
    }
}

module.exports = authController;