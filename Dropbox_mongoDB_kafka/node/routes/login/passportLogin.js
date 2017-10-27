var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require("./../database/mongoDB");
var security = require('./../utils/security');

module.exports = function(passport) {

    passport.use('login', new LocalStrategy(function(username, password, done) {
        try {
            mongo.findOneDoc("user",{username: username}, function(err, user){
                    if (user) {

                        if(security.compareEncrypted(password,user.password)){

                            done(null, {userid:user._id,username: username, password: password,root:user._id+''});

                        }else{
                            done(null, false);
                        }
                    } else {
                        done(null, false);
                    }
                });
        }
        catch (e){
            console.log(e);
            done(e,{});
        }
    }));
};