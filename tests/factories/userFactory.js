const mongoose = require('mongoose');
const uuid = require('uuid/v1');
const User = mongoose.model('User');

module.exports = options => {
  return new User({
    username: uuid(),
    admin: options.admin,
    verified: options.verified,
    enabled: options.enabled
  }).save();
};
