const models= require('../models');
const { validateFollowing } = require('../validators/followerValidations');
const { validateToken } = require('../validators/userValidations');
const { isEmpty } = require('lodash');
const jwt = require('jsonwebtoken');

// validate the token first then validate that there's a user_id and follower_id

exports.create_following = async function(req, res, next) {
    let errors = await validateToken({}, req);
    if (!isEmpty(errors)) next(errors); 
    errors = await validateFollowing(errors, req);
    if (!isEmpty(errors)) next(errors);
    else {
        const token = req.header('x-authentication-token');
        const userId = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).id;
        const following = await models.Follower.create({user_id: req.params.id, follower_id: userId});
        res.status(200).send({following: following});
    }
}

exports.delete_following = async function(req, res, next) {
    let errors = await validateToken({}, req);
    if (!isEmpty(errors)) next(errors);
    errors = await validateFollowing(errors, req);
    if (!isEmpty(errors)) next(errors);
    else {
        const token = req.header('x-authentication-token');
        const userId = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).id;
        const deletedFollowing = await models.Follower.destroy({
            where: {
                user_id: req.params.id,
                follower_id: userId
            }
        });
        res.status(200).send({deleted_following: deletedFollowing});
    }
}