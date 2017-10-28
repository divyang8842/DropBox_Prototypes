var mongo = require('../database/mongoDB');
var security = require('../utils/security');

function handle_request(msg, callback){

    var res = {};
    console.log("In handle request:"+ JSON.stringify(msg));
    var username = msg.username;
    var password = msg.password;

    try {
        mongo.findOneDoc("user",{username: username}, function(err, user){
            if (user) {

                if(security.compareEncrypted(password,user.password)){

                    res.code = "200";
                    res.value = "Valid Login.";
                    res.userid =user._id+'';
                    res.username = username;
                    res.root = user._id+'';
                    callback(false, res);

                }else{
                    res.code = "401";
                    res.value = "Failed Login";
                    callback(false, res);
                }
            } else {
                res.code = "401";
                res.value = "Failed Login";
                callback(false, res);
            }
        });
    }
    catch (e){
        console.log(e);
        res.code = "401";
        res.value = "Failed Login";
        callback(false, res);
    }



}

exports.handle_request = handle_request;