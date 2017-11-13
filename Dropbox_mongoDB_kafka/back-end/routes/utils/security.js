
// Define authentication middleware BEFORE your routes
var authenticate = function (req, res, next) {
    if (req.session.user || req.body.userid) {

        return next();
    }else{
        res.status(501).json({status:'501'});
    }
};


exports.authenticate=authenticate;

	