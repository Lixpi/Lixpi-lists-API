const { User } = require('./model');
 
exports.getUserById = userId => User.findOne({
  where: { userId },
});

exports.getUserByEmail = email => User.findOne({
  where: { email },
});
