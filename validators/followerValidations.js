const Follower = require('../models/Follower');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// we need to validate if there are user_id and follower_id fields
// we also need to check if both of these ids exist in the DB
// make sure the follower_id matches up with the id in the JWT

exports.validateFollowing = async function(errors, req) {
    if (req.params.id == null) {
        errors["status"] = 400;
        errors["message"] = "id params must be present."
        return errors;
    }
    const token = req.headers('x-authentication-token');
    const userId = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).id;
    const users = await User.findAll({where: {id: [userId, req.params.id]}});
    if (users == null || users.length !== 2) {
        errors["status"] = 400;
        errors["message"] = "Both follower and followee must be valid users."
        return errors;
    }
    return errors;
}