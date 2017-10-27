var mongo = require('./database/mongoDB');
var security = require('./utils/security');

function handle_request(msg, callback){

    var res = {};
    console.log("In handle request:"+ JSON.stringify(msg));


    try {
        mongo.findOneDoc("user",{username: username}, function(err, user){
            if (user) {

                if(security.compareEncrypted(password,user.password)){

                    res.code = "200";
                    res.value = "Success Login";

                }else{
                    res.code = "401";
                    res.value = "Failed Login";
                }
            } else {
                res.code = "401";
                res.value = "Failed Login";
            }
        });
    }
    catch (e){
        console.log(e);
        res.code = "401";
        res.value = "Failed Login";
    }

    callback(null, res);

}

exports.handle_request = handle_request;