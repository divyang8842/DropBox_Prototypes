//var crypto = require('crypto');
var bcrypt = require('bcrypt');

var encrypt = function(pwd) {
	// Generate a salt
	var salt = bcrypt.genSaltSync(10);
	// Hash the password with the salt
	var hash = bcrypt.hashSync(pwd, salt);
//	var sha256 = crypto.createHash('sha256');
//	var hash =sha256.update(pwd).digest('base64');
	return hash;
};

var compareEncrypted = function(pwd,hash){
	return bcrypt.compareSync(pwd, hash); 
};

exports.encrypt=encrypt;
exports.compareEncrypted=compareEncrypted;
	