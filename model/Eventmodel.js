const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    phno: {type: Number},
    content: {type: String, required:true},
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
    }
});

const EventSchema = Schema({
    hostname: {type: String},
    hostemail:{type: String},
    contactNumber: {type: Number},
    company: {type: String},
    eventTitle: {type: String},
    description:{type: String},
    imgs: {type: Array},
    banner: {type: String},
    date: {type: String},
    time: {type: String},
    location: {type: String},
    seats: {type: Number},
    eventType: {type: Array},
    eventTable: [{
        event: String,
        price: Number,
    }],
    comments: [commentSchema],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    socials: {
        facebook: { type: String, default: null },
        twitter: {type: String, default: null},
        insta: {type: String, default: null},
    },
    isFeatured: {
        type: Boolean,
        default: false,
    }
});

const Event = mongoose.model("Events", EventSchema);
const Comment = mongoose.model("Comments", commentSchema);
module.exports = {Event, Comment};