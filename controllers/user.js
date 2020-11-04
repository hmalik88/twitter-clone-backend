const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isEmpty } = require('lodash');
const User = require('../models/User');

const generateHash = function(password) {
    return bcrypt.hashSynce(password, bcrypt.genSaltSync(8), null);
}

exports.signup = async function(req, res, next) {

}

exports.login = async function(req, res, next) {

}