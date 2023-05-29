const mongoose = require('mongoose');


const Schema = mongoose.Schema;



const UserSchema = Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Please enter a password']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password']
    },
    name:{
        type: String,
        required: [true, 'Please add a name']
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'Please add an email']
    },
    phnum: Number,
    age: {
        type:Number,
        min:18,
        required:true
    }

},{
    timestamps: true,
})




const userModel = new mongoose.model("Users",UserSchema)

module.exports = userModel