const models = require('../models');
const jwt = require('jsonwebtoken');

// we need to validate if there are user_id and follower_id fields
// we also need to check if both of these ids exist in the DB
// make sure the follower_id matches up with the id in the JWT

exports.validateFollowing = async function(errors, req) {
    if (req.params.username == null) {
        errors["status"] = 400;
        errors["message"] = "id params must be present."
        return errors;
    }
    const token = req.header('x-authentication-token');
    const userId = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).id;
    const followed = await models.User.findOne({where: {userName: req.params.username}});
    const follower = await models.User.findOne({where: {id: userId}});
    const users = [followed, follower];
    const invalidUsers = users.some(user => !user);
    if (invalidUsers) {
        errors["status"] = 400;
        errors["message"] = "Both follower and followee must be valid users."
        return errors;
    }
    return errors;
}