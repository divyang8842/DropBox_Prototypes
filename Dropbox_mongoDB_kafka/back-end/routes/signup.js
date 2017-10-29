var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var kafka = require('./kafka/client');
var fileUtils = require('./utils/files');

var afterSignUp = function(req,res) {
    var data = {
        "ufname": req.body.firstname,
        "ulname": req.body.lastname,
        "emailid": req.body.email,
        "username": req.body.email,
        "password": req.body.password,
        "homedir": "",
        "profile": {
            work: '', sports: '', mobile: '', education: '', music: '', shows: ''
        }
    };

    kafka.make_request('signup_topic',data, function(err,results){
        console.log('in result');
        console.log(results);
        if(err){
            done(err,{});
        }
        else
        {

            if(results.status == '201' || results.status == 201){

                fileUtils.createDirectory(results.uid,function(err,path){
                    res.status(201).json(results);

                });
            }
            else {
                res.status(401).json(results);
            }
        }


    });


}


exports.afterSignUp = afterSignUp;