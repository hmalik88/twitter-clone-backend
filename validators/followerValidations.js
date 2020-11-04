const Follower = require('../models/Follower');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// we need to validate if there are user_id and follower_id fields
// we also need to check if both of these ids exist in the DB
// make sure the follower_id matches up with the id in the JWT

exports.validateFollowing = async function(errors, req) {
    if (req.params.id == null || req.body.follower_id == null) {
        errors["status"] = 400;
        errors["message"] = "user_id and follower_id fields must both be present"
        return errors;
    }
    const token = req.headers('x-authentication-token');
    const userId = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).id;
    if (userId !== req.body.follower_id) {
        errors["status"] = 401;
        errors["message"] = "You do not have access to this resource."
        return errors;
    }
    const users = await User.findAll({where: {id: [userId, req.params.id]}});
    if (users == null || users.length !== 2) {
        errors["status"] = 400;
        errors["message"] = "Both follower and followee must be valid users."
        return errors;
    }
    return errors;
}