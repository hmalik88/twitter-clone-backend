'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Tweets', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            createdAt: {
                alloweNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            content: {
                allowNull: false,
                type: Sequelize.STRING
            },
            user_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    key: 'id',
                    model: 'Users'
                }
            },
            isRetweet: {
                allowNull: false,
                type: Sequelize.BOOLEAN
            },
            isTweeth: {
                allowNull: false,
                type: Sequelize.BOOLEAN
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Users');
    }
};