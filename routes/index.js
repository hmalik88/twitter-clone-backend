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
router.get('/users/:username', user.show_user)


// follow routes

router.post('/follow/:username', follower.create_following);
router.delete('/follow/:username', follower.delete_following);


//  tweet routes

router.post('/tweets', tweet.create_tweet);
router.get('/timeline', tweet.show_timeline);
router.get('/users/:username/tweeths', tweet.show_tweeths);
router.get('/users/:username/tweets', tweet.show_tweets);
router.get('/users/:username/likes', tweet.show_likes);

// like routes

router.post('/likes', like.create_like);
router.delete('/likes/:id', like.remove_like);

module.exports = router;