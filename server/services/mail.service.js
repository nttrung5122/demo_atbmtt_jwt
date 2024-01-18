require('dotenv').config();
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_MAILER_CLIENT_ID = process.env.GOOGLE_MAILER_CLIENT_ID;
const GOOGLE_MAILER_CLIENT_SECRET = process.env.GOOGLE_MAILER_CLIENT_SECRET;
const GOOGLE_MAILER_REFRESH_TOKEN = process.env.GOOGLE_MAILER_REFRESH_TOKEN;
const ADMIN_EMAIL_ADDRESS = process.env.ADMIN_EMAIL_ADDRESS;


const mailService = {
    sendMail:async (email,subject,content)=> {
            const myOAuth2Client = new OAuth2Client(
                GOOGLE_MAILER_CLIENT_ID,
                GOOGLE_MAILER_CLIENT_SECRET
            );
            
            myOAuth2Client.setCredentials({
                refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
            });
            
            const myAccessTokenObject = await myOAuth2Client.getAccessToken();
            // console.log(myAccessTokenObject);
            const myAccessToken = myAccessTokenObject?.token;
            // const myAccessToken = "ya29.a0AfB_byBif1-6DGkT3aLT8Vab0AuCCH2NAZggXvts-ieggvX359jaGcTJw85z-FyW39h4jg1N3AiDEk_optlyFfMGzEPo11PX9J7EQLBYGRiSVayf4NeP7mudOoHhPafBjpKLNICfI33KTXW__35bQW-jv8TVng5YgvQ3aCgYKAcsSARMSFQHGX2Mi_HeY_wzXxKCQsVepcO5UHg0171";
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  type: 'OAuth2',
                  user: ADMIN_EMAIL_ADDRESS,
                  clientId: GOOGLE_MAILER_CLIENT_ID,
                  clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
                  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
                  accessToken: myAccessToken
                }
              })
              const mailOptions = {
                to: email, 
                subject: subject,
                html: content 
              }
              await transport.sendMail(mailOptions);
            //   res.status(200).json({ message: 'Email sent successfully.' })
            console.log("success");
    }
};

module.exports = mailService;