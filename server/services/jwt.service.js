const fs = require('fs')
const path = require('path')
const jwt = require("jsonwebtoken");

const accessPrivateKey = fs.readFileSync(path.join(__dirname, '../keys', 'access.key'), 'utf8')
const accessPublicKey = fs.readFileSync(path.join(__dirname, '../keys', 'access.key.pub'), 'utf8')
const refreshPrivateKey = fs.readFileSync(path.join(__dirname, '../keys', 'refresh.key'), 'utf8')
const refreshPublicKey = fs.readFileSync(path.join(__dirname, '../keys', 'refresh.key.pub'), 'utf8')

const JwtService = {
	generate: (data) => {
		const accessToken = jwt.sign(
			{
				exp: Math.floor(Date.now() / 1000) + (60*5),
				data: data
			},
			accessPrivateKey,
			{
				algorithm: "RS256"
			}
		);
		const refreshToken = jwt.sign(
			{
				exp: Math.floor(Date.now() / 1000) + (60 * 60*24),
				data: data
			},
			refreshPrivateKey,
			{
				algorithm: "RS256"
			}
		);
		return { accessToken, refreshToken };
	},
	verifyAccessToken: (accessToken, calback) => {
		return jwt.verify(accessToken, accessPublicKey, (err,payload)=>{
			return calback(err, payload?.data);
		});
	},
	verifyRefreshToken: (accessToken, calback) => {
		return jwt.verify(accessToken, refreshPublicKey, (err,payload)=>{
			return calback(err, payload?.data);
		});
	},
};



module.exports = JwtService;