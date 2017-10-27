var bcrypt = require('bcrypt');

var encrypt = function(pwd) {
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(pwd, salt);
	return hash;
};



var compareEncrypted = function(pwd,hash){
	return bcrypt.compareSync(pwd, hash); 
};

// Define authentication middleware BEFORE your routes
var authenticate = function (req, res, next) {
    if (req.session.user) {

        return next();
    }else{
        res.status(501).json({status:'501'});
    }
}

exports.encrypt=encrypt;
exports.authenticate=authenticate;
exports.compareEncrypted=compareEncrypted;
	