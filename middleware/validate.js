const useragent = require('useragent');
useragent(true);

const moment = require('moment');
const requestIp = require('request-ip');
const recaptcha = require('../services/recaptcha');
const validate = require('../lib/validate');

exports.checkUser = (req, res, next) => {
  req.checkBody({
    username: {
      notEmpty: true,
      matches: {
        options: [/^[a-z0-9_-]{4,20}$/i]
      },
      isLength: {
        options: [{ min: 4, max: 20 }],
        errorMessage: 'Username Must be between 4 and 20 characters'
      },
      errorMessage:
        'You must enter a valid username with 4-20 characters, no special characters allowed'
    }
  });
  next();
};

exports.checkPass = (req, res, next) => {
  req.checkBody({
    password: {
      notEmpty: true,
      matches: {
        options: [
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,]).{6,20}$/,
          req.body.confirm_password
        ]
      },
      isLength: {
        options: [{ min: 6, max: 20 }],
        errorMessage: 'Password Must be between 6 and 20 characters'
      },
      errorMessage:
        'You must enter a valid password with between 6 and 20 characters, at least 1 capital, 1 number, and 1 special character'
    }
  });
  next();
};

exports.checkEmail = (req, res, next) => {
  let errors = [];
  errors = validate.emailQuery(req.body.email);
  if (errors.length > 0) {
    req.flash('error', ['Invalid Email Address']);
    res.redirect('/auth/recovery/error');
  } else {
    next();
  }
};

exports.checkToken = (req, res, next) => {
  let errors = [];
  errors = validate.tokenQuery(req.body.token);
  if (errors.length > 0) {
    req.flash('error', ['Invalid Token']);
    res.redirect('/auth/recovery/error');
  } else {
    next();
  }
};

exports.getIPAgent = (req, res, next) => {
  var agent = useragent.parse(req.headers['user-agent']);

  req.ipAgent = {
    date: moment(),
    ipaddress: req.clientIp,
    os: agent.os,
    device: agent.device,
    browser: agent.toAgent()
  };
  next();
};

exports.checkCaptcha = (req, res, next) => {
  recaptcha
    .validateRecaptcha(req.body.captcha, req.connection.remoteAddress)
    .then(async () => {
      next();
    })
    .catch(err => {
      req.flash('error', ['Invalid Captcha']);
      res.redirect('/auth/recoveryerror');
    });
};
