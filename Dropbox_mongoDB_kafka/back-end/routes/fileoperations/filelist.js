var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var kafka = require('./../kafka/client');

var getFileList = function (req,res)
{
    var root = req.body.dir;
    var sess= req.session;
    var userid = '';
    if(sess==undefined){
        userid = req.body.userid;
    }else{
         userid  = sess.user.userid;
    }

    kafka.make_request('getdir_topic',{"root":root,"userid":userid}, function(err,results){

        if(err){
            done(err,{});
        }
        else
        {
            if(results.status == 201){
                res.status(201).json(results);
            }
            else {
                res.status(401).json(results);
            }
        }
    });
};


exports.getFileList = getFileList;