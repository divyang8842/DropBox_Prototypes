
var kafka = require('./kafka/client');

var getUserGroups = function(req,res) {
    var data = {

        "userid": req.session.user.userid,
        "type":'get'
    };
    kafka.make_request('usergroup_topic',data, function(err,results){
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

var setUserGroups = function(req,res) {
    var data = {
        "userid": req.session.user.userid,
        "group":req.body.data,
        "type":'set'
    };

    kafka.make_request('usergroup_topic',data, function(err,results){
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

exports.getUserGroups = getUserGroups;
exports.setUserGroups= setUserGroups;