const express = require('express');
const router  = express.Router();
const { createNewEvent, getEvents, getEvent } = require('../Controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createNewEvent);
router.get('/eventsList', getEvents);
router.get('/getEvent/:id', getEvent);

module.exports = router;