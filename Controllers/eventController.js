const asyncHandler = require('express-async-handler');
const { Event } = require('../model/Eventmodel');
const multer = require('multer');
const path = require('path');
// const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'eventUploads/');
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExt = path.extname(file.originalname);
        cb(null, req.user.id + '-' + unique + fileExt);
    }
});

const uploadMiddleware = multer({ storage });


const uploadFields = uploadMiddleware.fields([
    { name: 'imgs', maxCount: 3 },
    { name: 'banner', maxCount: 1 },
]);

const createNewEvent = asyncHandler(async (req, res) => {
    uploadFields(req, res, async (err) => {
        console.log(req.body, '6');
        if (err) {
            console.log(err);
        }
        // console.log(req.body, 'first');

        // console.log(req.body.eventType || 'nope');
        const eventsList = req.body.eventsList;
        // const eventsList = JSON.parse(req.body.eventsList);
        const eventType = req.body.eventType;
        const eventCategories = eventType.split(',')
        const socials = JSON.parse(req.body.socials);
        console.log(socials.fb , socials.insta || 'nah');

        console.log(req.files.banner[0], 'banner');

        // console.log(req.files);
        const response = await Event.create({
            hostname: req.body.name,
            hostemail: req.body.email,
            contactNumber: req.body.phone,
            company: req.body.org,

            eventTitle: req.body.eventTitle || "EVENT TITLE",
            description: req.body.desc,
            imgs: req.files?.imgs?.map(file => file.path),
            banner: req.files?.banner[0].path,
            date: req.body.date,
            // hour: req.body.hour,
            // min: req.body.min,
            time: req.body.time,
            location: req.body.location,
            eventType: eventCategories,

            eventTable: eventsList,
            seats: req.body.seats,
            socials: {
                facebook: socials.fb,
                insta: socials.insta,
                twitter: socials.twt
            },
        }
        );
        // console.log(response);
        if (response) {
            res.status(201).json(response);
        }
    });
});


const getEvents = asyncHandler(async(req, res) => {
    const response = await Event.find();
    res.status(200).json(response); 
});

const getEvent = asyncHandler(async(req, res) => {
    const {id} = req.params;
    console.log(id);
    const response = await Event.findById(id);
    res.status(200).json(response);
});

module.exports = {
    createNewEvent,
    getEvents, 
    getEvent
} 

// document.querySelector('input[placeholder="Host Name"]').value = 'John Doe';
// document.querySelector('input[placeholder="Email"]').value = 'johndoe@example.com';
// document.querySelector('input[placeholder="Phone Number"]').value = '1234567890';
// document.querySelector('input[placeholder="Company/College/Organization"]').value = 'Your Organization';
// document.querySelector('input[placeholder="Title"]').value = 'My Event Title';
// document.querySelector('textarea[placeholder="Description"]').value = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
// document.querySelector('textarea[placeholder="Location"]').value = 'New York';
// document.querySelector('input[placeholder="Date: dd/mm/yyyy"]').value = '10/12/2022';
// document.querySelector('input[type="time"]').value = '13:30';
// document.querySelector('input[placeholder="Facebook handle"]').value = 'socials';
// document.querySelector('input[placeholder="Instagram handle"]').value = 'socials';
// document.querySelector('input[placeholder="Twitter handle"]').value = 'socials';
// document.querySelector('input[placeholder="Number of seats"]').value = '2000'; 