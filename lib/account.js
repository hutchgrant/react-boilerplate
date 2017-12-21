const crypto = require('crypto');
const smtp = require('../services/smtp/smtp');

const Token = require('../models/Token');
const User = require('../models/User');

const _this = this;

exports.createToken = (user, req, res) => {
  const generatedToken = _this.genToken(true, user, req.ipAgent);

  if (generatedToken) {
    res.status(200).json({
      success: 'Password reset has been sent to ' + user.email,
      token: null
    });
  } else {
    res.status(500).json({ error: "couldn't create reset token", token: null });
  }
};

exports.validateToken = async (req, res) => {
  try {
    const token = await Token.findOne({
      token: req.body.token
    });

    if (token) {
      if (req.body.type === 'verify_email') {
        await User.update({ _id: token.user }, { verified: true });
        token.remove();
      }
      res.status(200).json({ success: 'Email address verified' });
    } else {
      res.status(403).json({ error: 'Invalid/expired token' });
    }
  } catch (err) {
    res.status(403).json({ error: 'Invalid/expired token' });
  }
};

exports.genToken = async (reset, user, ipAgent) => {
  const generatedToken = crypto.randomBytes(64).toString('hex');

  try {
    let token = null;
    let social = null;
    if (user.googleId) {
      social = 'Google+';
    }
    if (user.facebookId) {
      social = 'Facebook';
    }
    if (user.twitterId) {
      social = 'Twitter';
    } else {
      // remove old token, if exists
      token = await Token.findOne({
        user: user._id
      });
      if (token) {
        await token.remove();
      }
      token = await new Token({
        user: user._id,
        token: generatedToken,
        created: ipAgent
      }).save();
    }
    if (reset) {
      smtp.UserPasswordRecovery(
        user.username,
        user.email,
        generatedToken,
        social
      );
    } else {
      smtp.UserConfirmation(user.username, user.email, generatedToken);
    }
    return true;
  } catch (err) {
    return false;
  }
};

exports.changePassword = async (req, res) => {
  try {
    const token = await Token.findOne({
      token: req.body.token
    });

    const user = await User.findOne({ _id: token.user });
    user.password = user.encryptPassword(req.body.password);

    await user.save();
    await token.remove();
    res.status(200).json({ success: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error resetting password' });
  }
};
