const asyncHandler = require('express-async-handler');
const {Event} = require('../model/Eventmodel');
const multer = require('multer');
const path = require('path');
const { response } = require('express');
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

const uploadMiddleware = multer({storage});

const uploadImgs = uploadMiddleware.array('imgs', 3);
const uploadBanner = uploadMiddleware.single('banner');
const createNewEvent = asyncHandler(async(req, res) => {
    console.log('event created');
    console.log(req.files)
    uploadImgs(req, res, async(err) => {
        if(err){
            console.log(err);
        }
        uploadBanner(req, res, async(err) => {
            if(err){
                console.log(err);
            }
            console.log(req.body, 'banner');
            // console.log(req.files);
            const eventTable = {
                competitions: req.body.competitions,
                price: req.body.price,
            }
            const response = await Event.create({
                hostname: req.body.name,
                hostemail: req.body.email,
                contactNumber: req.body.phone,
                company: req.body.org,


                title: req.body.title || 'hyev11',
                description: req.body.description,
                imgs: req.files.map(file => file.path),
                banner: 'banner',
                date: req.body.date,
                hour: req.body.hour,
                min: req.body.minute,
                location: req.body.location, 
                eventType: req.body.eventType,
                eventTable: [eventTable],
                // competitions: req.body.competitions,
                // user: req.user._id,
                price: req.body.price,
                socials: req.body.socials,
            }
            );
            console.log(response);
            if(response){
                res.status(201).json(response); 
            }
        });
    });
    
});

module.exports = {
    createNewEvent
}