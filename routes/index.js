const { Router } = require('express');
const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const tweet = require('../controllers/tweet');
const like = require('../controllers/like');
const follower = require('../controllers/follower');

// user routes

router.post('/signup', user.signup);
router.post('/login', user.login);


// follow routes

router.post('/follow/:id', follower.create_following);
router.delete('/follow/:id', follower.delete_following);


//  tweet routes

router.post('/tweets', tweet.create_tweet);
router.get('/users/:id/timeline', tweet.show_timeline);
router.get('/users/:id/tweeths', tweet.show_tweeths);

// like routes

router.post('/likes', like.create_like);
router.delete('/likes/:id', like.remove_like);

module.exports = router;