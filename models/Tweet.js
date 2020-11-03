'use strict';

const User = require("./User");
const Like = require("./Like");

module.exports = (sequelize, DataTypes, Deferrable) => {
    let Tweet = sequelize.define('Tweet', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        isRetweet: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        isTweeth: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    })
    Tweet.belongsTo(User);
    Tweet.hasMany(Like);
    return Tweet;
}