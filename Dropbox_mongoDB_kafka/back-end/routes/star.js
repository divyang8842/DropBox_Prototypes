
var kafka = require('./kafka/client');

var stardir = function(req,res) {
    var data = {
        "filepath": req.body.filepath,
        "userid": req.session.user.userid,
        "type": "star"
    };

    kafka.make_request('stardir_topic',data, function(err,results){
        console.log('in result');
        console.log(results);
        if(err){
            done(err,{});
        }
        else
        {

            if(results.status == '201' || results.status == 201){
                res.status(201).json(results);
            } else {
                res.status(401).json(results);
            }
        }


    });


}

var unstardir = function(req,res) {
    var data = {
        "filepath": req.body.filepath,
        "userid": req.session.user.userid,
        "type": "unstar"
    };

    kafka.make_request('stardir_topic',data, function(err,results){
        console.log('in result');
        console.log(results);
        if(err){
            done(err,{});
        }
        else
        {

            if(results.status == '201' || results.status == 201){
                res.status(201).json(results);
            } else {
                res.status(401).json(results);
            }
        }


    });


}


exports.stardir = stardir;
exports.unstardir= unstardir;