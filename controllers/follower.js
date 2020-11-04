const Follower = require('../models/Follower');
const { validateFollowing } = require('../validators/followerValidations');
const { validateToken } = require('../validators/userValidations');
const { isEmpty } = require('lodash');

// validate the token first then validate that there's a user_id and follower_id

exports.create_following = async function(req, res, next) {
    let errors = await validateToken({}, req);
    if (!isEmpty(errors)) next(errors); 
    errors = await validateFollowing(errors, req);
    if (!isEmpty(errors)) next(errors);
    else {
        const following = await Follower.create({user_id: req.body.user_id, follower_id: req.body.follower_id});
        res.status(200).send({following: following});
    }
}

exports.delete_following = async function(req, res, next) {
    let errors = await validateToken({}, req);
    if (!isEmpty(errors)) next(errors);
    errors = await validateFollowing(errors, req);
    if (!isEmpty(errors)) next(errors);
    else {
        const deletedFollowing = await Follower.destroy({
            where: {
                user_id: req.body.user_id,
                follower_id: req.body.follower_id
            }
        });
        res.status(200).send({deleted_following: deletedFollowing});
    }
}