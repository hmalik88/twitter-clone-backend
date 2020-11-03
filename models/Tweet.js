'use strict';

const User = require("./User");

module.exports = (sequelize, DataTypes, Deferrable) => {
    let Tweet = sequelize.define('Tweet', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
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
    return Tweet;
}