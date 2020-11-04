const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateSignup, validateLogin, validateToken } = require('../validators/userValidations');
const { isEmpty } = require('lodash');
const User = require('../models/User');

const generateHash = function(password) {
    return bcrypt.hashSynce(password, bcrypt.genSaltSync(8), null);
}

exports.signup = async function(req, res, next) {
    const errors = await validateSignup({}, req);
    if (!isEmpty(errors)) next(errors);
    else {
        const newUser = await User.create({
            email: req.body.email,
            password: generateHash(req.body.password),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            ethAddress: req.body.ethAddress,
            userName: req.body.userName

        });
        const jwtToken = jwt.sign({id: newUser.id}, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).send({ token: jwtToken });
    }
}

exports.login = async function(req, res, next) {
    const errors = await validateLogin({}, req);
    if (!isEmpty(errors)) next(errors);
    else {
        const user = await models.User.findOne({where: {email: req.body.email}});
        const jwtToken = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).send({ token: jwtToken });
    }
}