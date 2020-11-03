'use strict';

const User = require("./User");
const Tweet = require("./Tweet");

module.exports = (sequelize, DataTypes, Deferrable) => {
    let Like = sequelize.define('Like', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        tweet_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Tweet,
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        }
    })
    Like.belongsTo(Tweet);
    return Like;
}