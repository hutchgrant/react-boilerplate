const jwt = require('jsonwebtoken');
const keys = require('../config/keys.js');

exports.generateToken = (req, res, next) => {
  req.token = genToken(req);
  return next();
};

exports.socialGenerateToken = (req, res, next) => {
  if (req.params.token === req.session.genTokenHash) {
    req.session.genTokenHash = null;
    req.token = genToken(req);
    next();
  } else {
    res.status(401).send('unauthorized');
  }
};

function genToken(req) {
  return jwt.sign(
    {
      id: req.user.id
    },
    keys.tokenSecret,
    {
      expiresIn: '24h'
    }
  );
}
