const express = require("express");
const mongoose = require("mongoose");
const Usermodel = require("./model/Usermodel")

const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/hyev');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.post('/',async (req,res) => {
    const user = new Usermodel({username:"sandeepnaik",password:'sandeep',name:'R Sai Sandeep',phnum:8885450415,age:23})
    // res.send(user.validate())
    const val = await user.validate()
    console.log(req.body)
    res.send("Hello")
})

app.listen('8000')