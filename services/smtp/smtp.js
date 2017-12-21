var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');

const keys = require('../../config/keys');

var options = {
  viewEngine: {
    extname: '.hbs',
    layoutsDir: 'services/smtp/template/',
    defaultLayout: 'template',
    partialsDir: 'services/smtp/partials/'
  },
  viewPath: 'services/smtp/template/',
  extName: '.hbs'
};
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: keys.smtp.email,
    pass: keys.smtp.password
  }
});
/* let transporter = nodemailer.createTransport({
	host: keys.smtp.host,
	port: keys.smtp.port,
	secure: keys.smtp.secure,
	auth: {
		user: keys.smtp.user,
		pass: keys.smtp.password
	}
}); */
transporter.use('compile', hbs(options));

exports.UserPasswordRecovery = (fullname, email, token, social) => {
  var mail = {
    from: keys.sitename + ' <' + keys.smtp.email + '>',
    to: email,
    subject: 'password recovery request | ' + keys.sitename,
    template: 'password_recovery',
    context: {
      sitename: keys.sitename,
      logo: keys.redirectDomain + '/logo.svg',
      link: keys.redirectDomain,
      fullname,
      email,
      social,
      token
    }
  };
  return transporter.sendMail(mail);
};

exports.UserConfirmation = (fullname, email, token) => {
  var mail = {
    from: keys.sitename + ' <' + keys.smtp.email + '>',
    to: email,
    subject: 'Confirm your email address | ' + keys.sitename,
    template: 'account_validate',
    context: {
      sitename: keys.sitename,
      logo: keys.redirectDomain + '/logo.svg',
      link: keys.redirectDomain,
      fullname,
      email,
      token
    }
  };
  return transporter.sendMail(mail);
};
