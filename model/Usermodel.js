const mongoose = require('mongoose');


const Schema = mongoose.Schema;



const UserSchema = Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Please enter a username']
    },
    bio: {
        type: String,
        default: null,
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
    },
    userPFP: {
        type: String,
        default: null,
    },
    friends: {
        type: Array,
        default: 0,
    },
    isHost: {
        type: Boolean,
        default: false,
    }

},{
    timestamps: true,
});




const userModel = new mongoose.model("Users", UserSchema)

module.exports = userModel