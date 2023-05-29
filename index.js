const express = require("express");
const mongoose = require("mongoose");
const Usermodel = require("./model/Usermodel")
const cors = require('cors')
const cookieParser = require('cookie-parser')
const {errorHandler} = require('./middleware/errorMiddleware')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser())
app.use(errorHandler)

mongoose.connect('mongodb://127.0.0.1:27017/hyev');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use('/api/users', require('./Routes/userRoutes'))



app.listen('8000')