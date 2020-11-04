const { Router } = require('express');
const express = require('express');
const router = express.Router();

// user routes

router.post('/signup');
router.post('/login');


// follow routes

router.post('/follow/:id');
router.delete('/follow/:id');


//  tweet routes

router.post('/tweets');
router.get('/users/:id/timeline');
router.get('/users/:id/tweeths');

// like routes

router.post('/likes');
router.delete('/likes/:id');

module.exports = router;