const Tweet = require('../models/Tweet');

// in the future we can add in checks for profane language
// right now we're just validating for tweet length
exports.validateTweet = async function(errors, req) {
    if (req.body.content.length == 0 || req.body.content == null) {
        errors["staus"] = 400;
        errors["message"] = "Content must be atleast 1 character."
    } 
    if (req.body.content.length > 280) {
        errors["status"] = 400;
        errors["message"] = "Content cannot be greater than 280 characters.";
    }
    if (req.body.isRetweet == null || req.body.isTweeth == null) {
        errors["status"] = 400;
        errors["message"] = "Request must contain information on whether tweet is retweet and if it's a tweeth.";
    }
    return errors;
}