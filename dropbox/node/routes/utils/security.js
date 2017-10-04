var crypto = require('crypto');

var encrypt = function(pwd) {
	var sha256 = crypto.createHash('sha256');
	var hash =sha256.update(pwd).digest('base64');
	return hash;
};

exports.encrypt=encrypt;
	