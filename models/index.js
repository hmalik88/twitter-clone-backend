'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes, Sequelize.Deferrable);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User.hasMany(db.Tweet, {foreignKey: 'user_id'});
db.Tweet.belongsTo(db.User, {foreignKey: 'user_id'});
db.Tweet.hasMany(db.Like, {foreignKey: 'tweet_id'});
db.Like.belongsTo(db.Tweet, {foreignKey: 'tweet_id'});
db.User.belongsToMany(db.User, {as: 'followers', through: db.Follower, foreignKey: 'user_id', otherKey: 'follower_id'});

module.exports = db;
