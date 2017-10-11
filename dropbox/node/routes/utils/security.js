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
    var session = req.session;

    if(session && session.userid && session.userid>0){
        var isAuthenticated = true;
    }
    if (isAuthenticated) {
        next();
    }
    else {
        res.status(401).json({message:'invalid try.'});
    }
}

exports.encrypt=encrypt;
exports.authenticate=authenticate;
exports.compareEncrypted=compareEncrypted;
	