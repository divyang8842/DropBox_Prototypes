var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var kafka = require('./kafka/client');

var listdir = function (req,res)
{
    var root = req.body.dir;
    var sess= req.session;
    var userid = sess.user.userid;
    kafka.make_request('getdir_topic',{"root":root,"userid":userid}, function(err,results){
        console.log('in result');
        console.log(results);
        if(err){
            done(err,{});
        }
        else
        {
            if(results.code == 201){
                res.status(201).json(results);
            }
            else {
                res.status(401).json(results);
            }
        }
    });
};


var uploadfile = function (req,res)
{

    kafka.make_request('upload_file',{"req":req}, function(err,results){
        console.log('in result');
        console.log(results);
        if(err){
            done(err,{});
        }
        else
        {
            if(results.code == 201){
                res.status(201).json(results);
            }
            else {
                res.status(401).json(results);
            }
        }
    });
};




exports.listdir= listdir;