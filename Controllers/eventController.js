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

// const uploadImgs = uploadMiddleware.array('imgs', 3);
// const uploadBanner = uploadMiddleware.single('banner');
// const createNewEvent =  (req, res) => {
//     console.log(req.body);
// }

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
        console.log(req.body, 'first');

        // console.log(req.body.eventType || 'nope');
        const eventsList = req.body.eventsList;
        // const eventsList = JSON.parse(req.body.eventsList);
        const eventType = req.body.eventType;
        const socials = JSON.parse(req.body.socials);
        console.log(socials.fb || 'nah');
        const { name, email, phone, org} = req.body;
        console.log(name, 'test');
        console.log(req.body, 'banner');
        // console.log(req.files);
        const response = await Event.create({
            hostname: name,
            hostemail: req.body.email,
            contactNumber: req.body.phone,
            company: req.body.org,

            eventTitle: req.body.eventTitle || "EVENT TITLE",
            description: req.body.desc,
            imgs: req.files?.imgs?.map(file => file.path),
            banner: req.file?.path,
            date: req.body.date,
            hour: req.body.hour,
            min: req.body.min,
            location: req.body.location,
            eventType: eventType,

            eventTable: eventsList,
            seats: req.body.seats,
            socials: {
                facebook: socials.fb,
                instagram: socials.insta,
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

// document.querySelector('input[placeholder="Title"]').value = 'FirstEvent79';
// document.querySelector('textarea[placeholder="Description"]').value = '11th hyev event';
// document.querySelector('input[placeholder="Date: dd/mm/yyyy"]').value = '07/07/2023';
// document.querySelector('textarea[placeholder="Location"]').value = 'Volta hotel Moghalpura';
// document.querySelector('input[placeholder="Name"]').value = 'muz';
// document.querySelector('input[placeholder="Email"]').value = 'muz@gmail.com';
// document.querySelector('input[placeholder="Phone Number"]').value = '7897897899';
// document.querySelector('input[placeholder="Company/College/Organization"]').value = 'mj';
// document.querySelector('input[placeholder="Number of seats"]').value = '100';
// document.querySelector('input[placeholder="Facebook handle"]').value = 'muzfb';
// document.querySelector('input[placeholder="Instagram handle"]').value = 'muzinsta';
// document.querySelector('input[placeholder="Twitter handle"]').value = 'muztwt';document.querySelector('input[class^="time-input"]').value = '12';
// document.querySelectorAll('input[class^="time-input"]')[1].value = '56'; 

module.exports = {
    createNewEvent
} 