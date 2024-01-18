const { response } = require("express");
const User = require("../models/user.model");
const mailService = require("../services/mail.service");
const Redis = require("ioredis");
const RedisService = new Redis();
const bcrypt = require('bcrypt');

const userController = {
    OTPrequest: async (req, res) => {
        try {
            const email = req.body?.email;
            const username = req.body?.username;
            var user;
            if(!email && !username)
                return res.status(500).json("Required email or username");
            if(email){
                user = await User.findOne({ email: email});
                if(!user){
                return res.status(500).json("Email not found");
                }
            }
            if(username){
                user = await User.findOne({username: username});
                if(!user){
                    return res.status(500).json("Username not found");
                }
            }
            if(user.timeCanGetOTP > Date.now()){
                return res.status(500).json("Too many request");
            }
            // user.timeCanGetOTP =  Date.now() + 5*60*1000;
            user.timeCanGetOTP =  Date.now() + 5*1000;
            await user.save();

            const randomNumbers = [];
            for (let i = 0; i < 6; i++) {
                randomNumbers.push(Math.floor(Math.random() * 10));
            }
            const otp = randomNumbers.join("");
            console.log(otp);

            const Email = user.email;
            const Username = user.username;
            const subject = "Mã OTP"
            const content = `<h2>Username: ${Username}</h2>
                                <h2>OTP: ${otp}</h2>`;
            const data = {
                user: Username,
                exp: Date.now() + 60*1000,
            };
            await RedisService.set(otp,JSON.stringify(data));
            const test = await RedisService.get(otp);
            console.log(test);
            
            await mailService.sendMail(Email, subject, content);
            res.status(200).json("success");
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    changePassword:async (req, res) => {
        try {
            
            const username = req.body?.username;
            const password = req.body?.password;
            const otp = req.body?.otp;
            // if(!password || !username)
            //     return res.status(500).json("Required password and username");
            const data = await RedisService.get(otp);
            if(!data){
                return res.status(500).json("OTP Wrong");
            }
            await RedisService.set(otp,null);
            const dataObj = JSON.parse(data);
            console.log(dataObj);

            if(dataObj.user !== username ){
                return res.status(500).json("User or OTP wrong");
            }

            if(dataObj.exp < Date.now()){
                return res.status(500).json("OTP expired");
            } 
            const user = await User.findOne({username: username});
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password,salt);
            user.password = hash;

            await user.save();
            res.status(200).json("success");
        } catch (error) {
            console.log(error);
            res.status(500).json(error);   
        }
    }
}

module.exports = userController;