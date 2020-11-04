'use strict';

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
                model: 'Tweets',
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        }
    })
    return Like;
}