const { User } = require('./model');

exports.getUserById = userId => User.findOne({
  where: { userId },
});

exports.getUserByUsername = username => User.findOne({
  where: { username },
});
