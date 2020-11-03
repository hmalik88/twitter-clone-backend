'use strict';

const User = require("./User");

module.exports = (sequelize, DataTypes, Deferrable) => {
    let Follower = sequelize.define('Follower', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
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
        follower_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },

    })
    return Follower;
}