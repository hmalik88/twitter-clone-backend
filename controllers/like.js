const Like = require('../models/Like');
const { validateToken } = require('../validators/userValidations');
const { validateLiking } = require('../validators/likeValidations');
const { isEmpty } = require('lodash');
const jwt = require('jsonwebtoken');



exports.create_like = async function(req, res, next) {
    let errors = await validateToken({}, req);
    if (!isEmpty(errors)) next(errors);
    errors = await validateLiking(errors, req);
    if (!isEmpty(errors)) next(errors);
    else {
        const token = req.headers('x-authentication-token');
        const userId = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).id;
        const newLike = await Like.create({
            user_id: userId,
            tweet_id: req.body.tweetId
        });
        res.status(200).send({like: newLike});
    }

}

exports.remove_like = async function(req, res, next) {
    let errors = await validateToken({}, req);
    if (!isEmpty(errors)) next(errors);
    errors = await validateLiking(errors, req);
    if (!isEmpty(errors)) next(errors);
    else {
        const token = req.headers('x-authentication-token');
        const userId = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).id;
        const deletedLike = await Like.destroy({
            where: {
                user_id: userId,
                tweet_id: req.body.tweetId
            }
        });
        res.status(200).send({deletedlike: deletedLike});
    }
}