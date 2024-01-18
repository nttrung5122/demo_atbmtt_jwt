const fs = require('fs')
const path = require('path')


// const jwt = require("jsonwebtoken");
// const accessPrivateKey = fs.readFileSync(path.join(__dirname, '../keys', 'access.key'), 'utf8')
// const accessPublicKey = fs.readFileSync(path.join(__dirname, '../keys', 'access.key.pub'), 'utf8')
// const refreshPrivateKey = fs.readFileSync(path.join(__dirname, '../keys', 'refresh.key'), 'utf8')
// const refreshPublicKey = fs.readFileSync(path.join(__dirname, '../keys', 'refresh.key.pub'), 'utf8')

const jwt = require("./JWT");
const accessPrivateKey = {
	p: 162259276829213363391578010288127n,
    q: 6864797660130609714981900799081393217269435300143305409394463459185543183397656052122559640661454554977296311391480858037121987999716643812574028291115057151n,
    a: 460323248667026721879499876121n,
}
const accessPublicKey = jwt.calPublicKey(accessPrivateKey);
const refreshPrivateKey = {
	p: 405309270405169065807684941591n	,
    q: 105595218532106138549532249980431777580242420736854332840636473317366622475698253330867965169813386467539988627303976028915696807821653760027796745211n,
    a: 485337547482138301132564243469n,
}
const refreshPublicKey = jwt.calPublicKey(refreshPrivateKey);

const JwtService = {
	generate: (data) => {
		const accessToken = jwt.sign(
			{
				exp: Math.floor(Date.now() / 1000) + (5), //second
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
	verifyRefreshToken: (refreshToken, calback) => {
		return jwt.verify(refreshToken, refreshPublicKey, (err,payload)=>{
			return calback(err, payload?.data);
		});
	},
};



module.exports = JwtService;