const express = require('express');
const router  = express.Router();
const { createNewEvent } = require('../Controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createNewEvent);

module.exports = router;