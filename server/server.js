const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser"); 
const bodyParser = require('body-parser');
const router = require("./routes/router");
const helmet = require('helmet');

module.exports = {
	async start() {
		const app = express();
		
        dotenv.config();

		// const urimongodb = process.env.mongoDB || "mongodb://127.0.0.1:27017";
		const urimongodb = "mongodb://127.0.0.1:27017";
    
    	await mongoose.connect(urimongodb).then(()=>{
        	console.log("connect to data ",urimongodb);
		});

        
        // app.use(bodyParser.urlencoded({ extended: false }));
        // app.use(bodyParser.json())
        const allowedDomains = ['http://localhost:8000', 'http://localhost:3000'];
        app.use(cors( {
          origin: function (origin, callback) {
            // bypass the requests with no origin (like curl requests, mobile apps, etc )
            if (!origin) return callback(null, true);
         
            if (allowedDomains.indexOf(origin) === -1) {
              var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
              return callback(new Error(msg), false);
            }
            return callback(null, true);
          }, // specify the origin, not '*'
        
          credentials: true, // this allows the server to accept requests with credentials (cookies, HTTP auth)
        
        }));
        
        app.use(cookieParser());
        app.use(express.json());
        // cài đặt bảo mật cho ứng dụng
        app.use(helmet())
        app.use(
            helmet.contentSecurityPolicy({
              directives: {
                'default-src': ["'self'"],
                'base-uri': ["'self'"],
                'block-all-mixed-content': [],
                'font-src': ["'self'", 'https:', 'data:'],
                'frame-ancestors': ["'self'"],
                'img-src': ["'self'", 'data:'],
                'object-src': ["'none'"],
                'script-src': ["'self'"],
                'script-src-attr': ["'none'"],
                'style-src': ["'self'", ' https:'],
                'upgrade-insecure-requests': [],
              },
            })
          )
        app.use(function(req, res, next) {
          res.header('Content-Type', 'application/json;charset=UTF-8')
          res.header('Access-Control-Allow-Credentials', true)
          res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
          )
          next()
        })
        // add route
        app.use("/",router)


        // app.set('view engine', 'pug');
        // app.set('views', './views');
        // app.use(express.static(__dirname + '/public'))


        // start listen serve
        app.listen((8000), () => {
          console.log("Server is Running ");
      })
    }
}
