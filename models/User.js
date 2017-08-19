var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: false},
	admin: {type: Boolean, required: true},
	email: {type: String},
	givenName: {type: String},
	familyName: {type: String},
	googleId: {type: String},
	twitterId: {type: String},
	facebookId: {type: String}
});

userSchema.methods.encryptPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);