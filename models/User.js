'use strict';
const Tweet = require('./Tweet');

module.exports = (sequelize, DataTypes, Deferrable) => {
    let User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
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
    return User;
}