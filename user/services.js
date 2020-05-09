const { User } = require('./model');

exports.getUserById = id => User.findOne({
  where: { id },
});

exports.getUserByUsername = username => User.findOne({
  where: { username },
});
