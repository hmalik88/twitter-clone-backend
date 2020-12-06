const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateSignup, validateLogin, validateToken } = require('../validators/userValidations');
const { isEmpty } = require('lodash');
const models = require('../models');
const { Op } = require('sequelize');

const generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

exports.signup = async function(req, res, next) {
    const errors = await validateSignup({}, req);
    if (!isEmpty(errors)) next(errors);
    else {
        const newUser = await models.User.create({
            email: req.body.email,
            password: generateHash(req.body.password),
            name: req.body.name,
            ethAddress: req.body.ethAddress,
            userName: req.body.userName
        });
        const jwtToken = jwt.sign({id: newUser.id}, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).send({ token: jwtToken, userName: newUser.userName });
    }
}

exports.login = async function(req, res, next) {
    const errors = await validateLogin({}, req);
    if (!isEmpty(errors)) next(errors);
    else {
        const user = await models.User.findOne({where: {email: req.body.email}});
        const jwtToken = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).send({ token: jwtToken, userName: user.userName });
    }
}

exports.show_user = async function (req, res, next) {
    const errors = await validateToken({}, req);
    if (!isEmpty(errors)) next(errors);
    else {
        const token = req.header('x-authentication-token')
        const userId = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).id;
        const { username }  = req.params;
        const userInfo = {};
        const user = await models.User.findOne({where: {userName: username}});
        userInfo['joined-date'] = user.createdAt;
        userInfo['name'] = user.name;
        const followers = await models.Follower.findAll({where: {user_id: user.id}});
        userInfo['followers'] = followers.length;
        const following = await models.Follower.findAll({where: {follower_id: user.id}});
        userInfo['following'] = following.length;
        const isFollowed = !!followers.filter(follower => follower.follower_id == userId).length;
        userInfo['isFollowed'] = isFollowed;
        res.status(200).send(userInfo);
    }
}

exports.show_users = async function (req, res, next) {
    const errors = await validateToken({}, req);
    if (!isEmpty(errors)) next(errors);
    else {
        console.log(req.query.match);
        const users = req.query.match ? 
        await models.User.findAll({
            where: {
                userName: {
                    [Op.like]: req.query.match + '%'
                }
            }
        }) :
        await models.User.findAll();
        const userInfo = users.map(user => {
            return {name: user.name, userName: user.userName}
        });
        res.status(200).send(userInfo);
    }
}