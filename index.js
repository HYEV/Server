const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const cookieParser = require('cookie-parser')
const {errorHandler} = require('./middleware/errorMiddleware')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Allow credentials (cookies)
}));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/eventUploads', express.static(__dirname + '/eventUploads'));

app.use(cookieParser())
app.use(errorHandler)


mongoose.connect('mongodb://127.0.0.1:27017/hyev');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use('/api/users', require('./Routes/userRoutes'));
app.use('/api/events', require('./Routes/eventRoutes'));


app.listen('8000')