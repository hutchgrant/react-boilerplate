const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const rateLimit = require('../middleware/limiter');
const account = require('../lib/account');
const User = require('../models/User');

router.use(rateLimit('recovery'));
router.use(validate.getIPAgent);
router.post(
  '/',
  validate.checkEmail,
  validate.checkCaptcha,
  async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        account.createToken(user, req, res);
      } else {
        req.flash('error', ['Invalid Email Address']);
        res.redirect('/auth/recovery/error');
      }
    } catch (err) {
      req.flash('error', ['Invalid Email Address']);
      res.redirect('/auth/recovery/error');
    }
  }
);

router.get('/error', (req, res) => {
  req.session.recoveryAttempts += 1;
  res.status(403).json({
    error: {
      message: req.flash('error'),
      attempts: req.session.recoveryAttempts
    }
  });
});

router.post('/resend_token', async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
      verified: false
    });
    if (user) {
      const generatedToken = account.genToken(false, user, req.ipAgent);

      if (generatedToken) {
        res
          .status(200)
          .json({ success: 'Email verification resent to ' + user.email });
      } else {
        res.status(401).json({
          error: { message: 'Error: could not resend email verification' }
        });
      }
    } else {
      req.flash('error', ['Invalid Username']);
      res.redirect('/auth/recovery/error');
    }
  } catch (err) {
    req.flash('error', ['Invalid Username']);
    res.redirect('/auth/recovery/error');
  }
});

router.post('/confirm_token', validate.checkToken, (req, res) => {
  account.validateToken(req, res);
});

router.post('/changepass', validate.checkPass, (req, res) => {
  req.getValidationResult().then(errors => {
    if (!errors.isEmpty()) {
      var messages = [];
      errors.array().forEach(function(error) {
        messages.push(error.msg);
      });
      req.flash('error', messages[0]);
      res.redirect('/auth/recovery/error');
    } else {
      account.changePassword(req, res);
    }
  });
});

module.exports = router;
