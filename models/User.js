'use strict';
const Tweet = require('./Tweet');
const Follower = require('./Follower');

module.exports = (sequelize, DataTypes, Deferrable) => {
    let User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        ethAddress: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        }
    })
    User.hasMany(Tweet);
    User.belongsToMany(User, {as: 'Follower', through: Follower});
    return User;
}