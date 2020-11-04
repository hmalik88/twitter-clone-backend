const models = require('../models');

// we need to validate if the tweet exists

exports.validateLiking = async function(errors, req) {
    const tweet = await models.Tweet.findOne({where: {id: req.body.tweetId}});
    if (tweet == null) {
        errors["status"] = 400;
        errors["message"] = "Tweet does not exist, cannot like/unlike a non-existent tweet."
    }
    return errors;
}