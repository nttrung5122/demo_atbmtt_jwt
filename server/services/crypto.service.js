const CryptoJS = require("crypto-js");

const secretKey = process.env.SECRET_KEY || "secretKey";
const cryptoJsService={
    encrypt:(originalText)=>{
        if(!originalText)
            return null;
        return CryptoJS.AES
            .encrypt(originalText, secretKey)
            .toString();
    },
    decrypt:(ciphertext)=>{
        if(!ciphertext)
            return null;
        return CryptoJS.AES
            .decrypt(ciphertext, secretKey)
            .toString(CryptoJS.enc.Utf8);
    }
}

module.exports = cryptoJsService;