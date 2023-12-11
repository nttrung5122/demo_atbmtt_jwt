const CryptoJS = require("crypto-js");

const secretKey = process.env.SECRET_KEY || "secretKey";
const cryptoJsService={
    encrypt:(originalText,key)=>{
        key = key || secretKey;
        if(!originalText)
            return null;
        return CryptoJS.AES
            .encrypt(originalText, key)
            .toString();
    },
    decrypt:(ciphertext,key)=>{
        key = key || secretKey;
        if(!ciphertext)
            return null;
        return CryptoJS.AES
            .decrypt(ciphertext, key)
            .toString(CryptoJS.enc.Utf8);
    }
}

module.exports = cryptoJsService;