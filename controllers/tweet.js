const models = require('../models');
const { validateTweet } = require('../validators/tweetValidations');
const { isEmpty } = require('lodash');
const { validateToken } = require('../validators/userValidations');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//we want to validate the token sent in the header 
// then we want to grab the user's tweets through the association we setup
exports.create_tweet = async function(req, res, next) {
    let errors = await validateTweet({}, req);
    if (!isEmpty(errors)) next(errors);
    errors = await validateToken(errors, req);
    if (!isEmpty(errors)) next(errors);
    else {
        const token = req.header('x-authentication-token');
        const userId = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).id;
        const newTweet = await models.Tweet.create({
            content: req.body.content,
            user_id: userId,
            isTweeth: req.body.isTweeth,
            isRetweet: req.body.isRetweet
        });
        res.status(200).send({tweet: newTweet});
    }
}

//we want to validate the token sent in the header
// then we want to fetch all the users tweets
// then we want to fetch all he tweets of the users that our user is following

exports.show_timeline = async function(req, res, next) {
    const errors = await validateToken({}, req);
    if (!isEmpty(errors)) next(errors);
    else {
        const token = req.header('x-authentication-token');
        const userId = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).id;
        const userFriends = await models.Follower.findAll({where: {follower_id: userId}});
        const userIds = userFriends.map(friend => friend.user_id);
        const friendTweets = await models.Tweet.findAll({where: {user_id: userIds}});
        res.status(200).send({timeline: friendTweets});
    }
}

// first we validate the token
// grab all the tweets where there is a true property of isTweeth

exports.show_tweeths = async function(req, res, next) {
    const errors = await validateToken({}, req);
    if (!isEmpty(errors)) next(errors);
    else {
        const username = req.params.username;
        const user = await models.User.findOne({where: {userName: username}});
        const userTweeths = await models.Tweet.findAll({where: {user_id: user.id, isTweeth: true}});
        res.status(200).send({tweeths: userTweeths});
    }
}

exports.show_tweets = async function(req, res, next) {
    const errors = await validateToken({}, req);
    if (!isEmpty(errors)) next(errors);
    else {
        const username = req.params.username;
        const user = await models.User.findOne({where: {userName: username}});
        const userTweets = await models.Tweet.findAll({where: {user_id: user.id, isTweeth: false}});
        res.status(200).send({tweets: userTweets});
    }
}

exports.show_likes = async function(req, res, next) {
    const errors = await validateToken({}, req);
    if (!isEmpty(errors)) next(errors);
    else {
        const username = req.params.username;
        const user = await models.User.findOne({where: {userName: username}});
        const likes = await models.Like.findAll({where: {user_id: user.id}});
        const tweetIds = likes.map(like => like.tweet_id);
        const likedTweets = await models.Tweet.findAll({where: {id: tweetIds}});
        res.status(200).send({likes: likedTweets});
    }
}