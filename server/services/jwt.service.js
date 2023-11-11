const jwt = require("jsonwebtoken");

const JwtService = {
    generate: (data)=> {
      const accessToken = jwt.sign(
        data,
        process.env.accessKey,
        {
          expiresIn: process.env.accessTokenLife
        }
      );
      const refreshToken = jwt.sign(
        data,
        process.env.refreshKey,
        {
          expiresIn: process.env.refreshTokenLife
        }
      );
      return { accessToken, refreshToken };
    }
  };
  module.exports =  JwtService;