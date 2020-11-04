const User = require('../models/User');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isEmpty } = require('lodash');
const Web3 = require('web3');
const web3 = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/01793541d74c433696d6b46058298237');


/*
We want to check for the following things

1. If the email portion is actually an email
2. If the eth address is actually an eth address

*/

const validateCreateUserFields = async function(errors, req) {
    if (!validator.isEmail(req.body.email)) {
        errors["status"] = 400;
        errors["messages"] = ["Please use a valid email."]
    }
    if (!web3.utils.isAddress(req.body.ethAddress)) {
        errors["status"] = 400;
        if (errors["messages"]) errors["messages"].push("Please use a valid ethereum address.")
        else errors["messages"] = ["Please use a valid ethereum address."]
    }
}

/*

update logic to:

1. include a call to User.findOne() with a ethAddress where parameter
we only want 1 unique email mapped to 1 unique ethAddress if the user 
wants multiple emails they'll have to create another ethereum address

2. include another call to User.findOne() with a userName where parameter
we want a unique username for our account.


*/

exports.validateSignup = async function(errors, req) {
    await validateCreateUserFields(errors, req);
    const emailFound = await User.findOne({where: {email: req.body.email}});
    const userNameFound = await User.findOne({where: {userName: req.body.userName}});
    const ethAddFound = await User.findOne({where: {ethAddress: req.body.ethAddress}});
    if (emailFound || userNameFound || ethAddFound) {
        errors["status"] = 400;
        errors["messages"] = [];
        if (emailFound) errors["messages"].push("Email is already in use. Please login or use another email to signup.");
        if (userNameFound) errors["messages"].push("Username is already in use. Please use another username to signup.");
        if (ethAddFound) errors["messages"].push("Ethereum address is already in use. Please use another address to signup.");
    }
    return errors;
}

exports.validateLogin = async function(errors, req) {
    const user = await User.findOne({where: {email: req.body.email}});
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
        const user = await User.findOne({where: {id: userId}});
        if (user == null) {
            errors["status"] = 401;
            errors["message"] = "You do not have access to this resource."
        }
    }
    return errors;
}