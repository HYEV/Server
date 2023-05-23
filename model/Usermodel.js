const mongoose = require('mongoose');


const Schema = mongoose.Schema;



const UserSchema = Schema({
    username: String,
    password: String,
    name:String,
    phnum: Number,
    age: {type:Number, min:18,require:true}

})




const userModel = new mongoose.model("Users",UserSchema)

module.exports = userModel