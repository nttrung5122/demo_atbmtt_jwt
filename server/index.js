
// Requiring module
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser"); 
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

dotenv.config();
const app = express(); 

mongoose.connect(process.env.mongoDB);


app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/auth",authRoute);
app.use("/user",userRoute);
// Server setup
app.listen((8000), () => {
    console.log("Server is Running ");
})