const models = require('../models');
const { validateTweet } = require('../validators/tweetValidations');
const { isEmpty } = require('lodash');
const { validateToken } = require('../validators/userValidations');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//we want to validate the token sent in the header 
// then we want to grab the user's tweets through the association we setup

const months = ['Jan', 'Feb', 'Mar', 
                'Apr', 'May', 'Jun', 'Jul', 
                'Aug', 'Sep', 'Oct',
                'Nov', 'Dec'];

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
        const friendTweets = await models.Tweet.findAll({
            where: {user_id: userIds},
            order: [['createdAt', 'DESC']]
        });
        const timeline = await friendTweets.map(async tweet => {
            const tweetObj = {};
            const user = await models.User.findOne({where: {id: tweet.user_id}});
            const date = new Date(tweet.createdAt);
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const currDate = new Date();
            let formattedDate;
            if (currDate.getFullYear() == year) formattedDate = `${months[month]} ${day}`;
            else formattedDate = `${months[month]} ${day} ${year}`;
            tweetObj['username'] = user.userName;
            tweetObj['displayName'] = user.name;
            tweetObj['text'] = tweet.content;
            tweetObj['date'] = formattedDate;
            return tweetObj;
        })
        const resolvedTimeline = await Promise.all(timeline);
        res.status(200).send({timeline: resolvedTimeline});
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
        const userTweeths = await models.Tweet.findAll({
            where: {user_id: user.id, isTweeth: true},
            order: [['createdAt', 'DESC']]
        });
        const tweeths = userTweeths.map(tweeth => {
            const tweetObj = {};
            const date = new Date(tweeth.createdAt);
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const currDate = new Date();
            let formattedDate;
            if (currDate.getFullYear() == year) formattedDate = `${months[month]} ${day}`;
            else formattedDate = `${months[month]} ${day} ${year}`;
            tweetObj['username'] = user.userName;
            tweetObj['displayName'] = user.name;
            tweetObj['text'] = tweeth.content;
            tweetObj['date'] = formattedDate;
            return tweetObj;
        })
        res.status(200).send({tweeths: tweeths});
    }
}

exports.show_tweets = async function(req, res, next) {
    const errors = await validateToken({}, req);
    if (!isEmpty(errors)) next(errors);
    else {
        const username = req.params.username;
        const user = await models.User.findOne({where: {userName: username}});
        const userTweets = await models.Tweet.findAll({
            where: {user_id: user.id, isTweeth: false},
            order: [['createdAt', 'DESC']]
        });
        const tweets = userTweets.map(tweet => {
            const tweetObj = {};
            const date = new Date(tweet.createdAt);
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const currDate = new Date();
            let formattedDate;
            if (currDate.getFullYear() == year) formattedDate = `${months[month]} ${day}`;
            else formattedDate = `${months[month]} ${day} ${year}`;
            tweetObj['username'] = user.userName;
            tweetObj['displayName'] = user.name;
            tweetObj['text'] = tweet.content;
            tweetObj['date'] = formattedDate;
            return tweetObj;
        });
        res.status(200).send({tweets: tweets});
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
        const likedTweets = await models.Tweet.findAll({
            where: {id: tweetIds},
            order: [['createdAt', 'DESC']]
        });
        const payload = await likedTweets.map(async tweet => {
            const tweetObj = {};
            const user = await models.User.findOne({where: {id: tweet.user_id}});
            const date = new Date(tweet.createdAt);
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const currDate = new Date();
            let formattedDate;
            if (currDate.getFullYear() == year) formattedDate = `${months[month]} ${day}`;
            else formattedDate = `${months[month]} ${day} ${year}`;
            tweetObj['username'] = user.userName;
            tweetObj['displayName'] = user.name;
            tweetObj['text'] = tweet.content;
            tweetObj['date'] = formattedDate;
            return tweetObj;
        });
        const finalPayload = await Promise.all(payload);
        res.status(200).send({likes: finalPayload});
    }
}