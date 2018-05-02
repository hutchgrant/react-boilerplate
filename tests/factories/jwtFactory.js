const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

module.exports = user => {
  return jwt.sign({ id: user._id }, keys.tokenSecret, { expiresIn: '24h' });
};
