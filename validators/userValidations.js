const User = require('../models/User');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isEmpty } = require('lodash');

/*
We want to check for the following things

1. If the email portion is actually an email
2. If there is an eth address that it is actually an eth address

*/

const validateCreateUserFields = function(errors, req) {
    if (!validator.isEmail(req.body.email)) {
        errors["status"] = 400;
        errors["message"] = "Please use a valid email."
    }
}

exports.validateSignup = function(errors, req) {
    return new Promise(function(resolve, reject) {
        validateCreateUserFields(errors, req);
        return User.findOne({
            where: {
                email: req.body.email
            }
        }).then(u => {
            if (u !== null) {
                errors["status"] = 400;
                errors["message"] = "Email is already in use. Please login or use another email to signup."
            }
            resolve(errors);
        })
    })
}

exports.validateLogin = async function(errors, req) {
    const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
    if (user == null) {
        errors["status"] = 400;
        errors["message"] = "No such user found for this email. Please use a valid email.";
    } else {
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            errors["status"] = 401;
            errors["message"] = "Incorrect password."
        }
    }
    return errors;
}

exports.validateToken = async function(errors, req) {
    const token = req.header('x-authentication-token');
    let userId;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (!err) userId = decoded.id
        else {
            errors["message"] = "You have not supplied a valid JWT."
            errors["status"] = 401;
        }
    });
    if (isEmpty(errors)) {
        const user = await User.findOne({
                where: {
                    id: userId
                }
            })
        if (user == null) {
            errors["status"] = 401;
            errors["message"] = "You do not have access to this resource."
        }
    }
    return errors;
}