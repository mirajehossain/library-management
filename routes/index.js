const express = require('express');

const router = express.Router();


router.route('/').get((req, res) => res.json({ title: 'Hello world, Welcome to library API' }));

module.exports = router;
