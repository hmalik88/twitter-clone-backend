'use strict';

module.exports = (sequelize, DataTypes, Deferrable) => {
    let Follower = sequelize.define('Follower', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        follower_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },

    })
    return Follower;
}