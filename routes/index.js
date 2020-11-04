const { Router } = require('express');
const express = require('express');
const router = express.Router();

// user routes

router.post('/signup');
router.post('/login');
router.post('/follow/:id');
router.post('/unfollow/:id');


//  tweet related routes

router.post('/tweets');
router.post('/likes');
router.get('/users/:id/timeline');
router.get('/users/:id/tweeths');


module.exports = router;