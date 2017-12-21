const express = require('express');
const router = express.Router();
const passport = require('passport');
const crypto = require('crypto');
const expressJwt = require('express-jwt');
const keys = require('../config/keys');
const authenticate = expressJwt({ secret: keys.tokenSecret });

const jwt = require('../middleware/jwt');
const validate = require('../middleware/validate');
const rateLimit = require('../middleware/limiter');
const account = require('../lib/account');

const User = require('../models/User');

router.post(
  '/signup',
  rateLimit('signup'),
  validate.checkUser,
  validate.checkPass,
  validate.getIPAgent,
  passport.authenticate('local.signup', {
    failureRedirect: '/auth/signup_error'
  }),
  (req, res) => {
    res.status(200).json({
      username: req.user.username,
      email: req.user.email,
      verify: true,
      token: null
    });
    req.logout();
  }
);

router.get('/signup_error', (req, res) => {
  rateLimit('signup'),
    res.json({
      error: {
        message: req.flash('error')
      },
      verify: false
    });
});

router.post(
  '/login',
  rateLimit('login'),
  validate.checkUser,
  validate.checkPass,
  validate.getIPAgent,
  passport.authenticate('local.signin', {
    failureRedirect: '/auth/login_error'
  }),
  jwt.generateToken,
  (req, res) => {
    req.session.signInAttempts = 0;
    res.status(200).json({
      username: req.user.username,
      token: req.token,
      admin: req.user.admin,
      error: {}
    });
  }
);

router.get('/login_error', (req, res) => {
  req.session.signInAttempts += 1;
  res.json({
    error: {
      message: req.flash('error'),
      attempts: req.session.signInAttempts
    }
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/current_user', authenticate, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    res.status(200).json({
      username: user.username,
      admin: user.admin
    });
  } catch (err) {
    res.status(500);
  }
});

router.get('/gentoken/:token', jwt.socialGenerateToken, (req, res, next) => {
  res.status(200).json({
    username: req.user.username,
    admin: req.user.admin,
    token: req.token
  });
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get(
  '/google/callback',
  validate.getIPAgent,
  passport.authenticate('google'),
  (req, res) => {
    req.session.genTokenHash = crypto.randomBytes(64).toString('hex');
    res.redirect(`/user/dashboard?auth=${req.session.genTokenHash}`);
  }
);

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email']
  })
);

router.get(
  '/facebook/callback',
  validate.getIPAgent,
  passport.authenticate('facebook', {
    failureRedirect: '/user/login'
  }),
  (req, res) => {
    req.session.genTokenHash = crypto.randomBytes(64).toString('hex');
    res.redirect(`/user/dashboard?auth=${req.session.genTokenHash}`);
  }
);

router.get('/twitter', passport.authenticate('twitter'));

router.get(
  '/twitter/callback',
  validate.getIPAgent,
  passport.authenticate('twitter', {
    failureRedirect: '/user/login'
  }),
  (req, res) => {
    req.session.genTokenHash = crypto.randomBytes(64).toString('hex');
    res.redirect(`/user/dashboard?auth=${req.session.genTokenHash}`);
  }
);
router.use('/recovery', require('./recoveryRoutes'));

module.exports = router;
