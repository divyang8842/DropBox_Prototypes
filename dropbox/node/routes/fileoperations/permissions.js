var mysql = require('./../database/mysql');
var utils = require('./../utils/userprofile');

var GROUP = 1;
var USER = 0;
var link = 2;

var validateEmails = function(req,res){
var emailAddress = req.body.emails;

var emails = emailAddress.split(',');
var length = emails.length;
var linkShare= false;
while(length-->0 && !linkShare){
    utils.getUserIDFromEmailAddress(emails[length],function(err,results){
		if(results.length==0){
            linkShare = true;
            res.status(201).json({status:'201',linkShare:'true'});

		}
	});
}
if(!linkShare){
    res.status(201).json({status:'201',linkShare:'false'});
}


}

var setPermission = function(dataJson,callback) {
	var setPermit = "INSERT INTO Directory_Permission (directoryid,permissiontype,permit_id) VALUES(?,?,?)";
	var data=[dataJson.dirid,dataJson.type,dataJson.pid];
	mysql.setData(function(err, results) {
		if (err) {
			//throw err;
			callback(err,results);
		} else {
			callback(err,results);
		}
	}, setPermit,data);
};




var getAllPermittedDirectories = function(userid,callback){
	var getDirectories ="SELECT d.name,d.relative_path,d.isfile FROM directories d JOIN directory_permission dp ON dp.directoryid = d.id JOIN users u ON (dp.permissiontype = 0 AND u.uid = dp.permit_id AND u.uid=?) WHERE u.deleteflag= 0 AND d.deleteflag=0 AND dp.deleteflag=0";
	var data=[userid];
	
	mysql.fetchData(function(err, results) {
		if (err) {
			//throw err;
			callback(err,results);
		} else {
			var getDirectories ="SELECT * FROM directories d 	JOIN directory_permission dp ON dp.directoryid = d.id 	JOIN user_group_mapping u ON (dp.permissiontype = 1 AND u.userid = dp.permit_id AND u.userid=?) WHERE u.deleteflag= 0 AND d.deleteflag=0 AND dp.deleteflag=0";
			var data=[userid];
			mysql.fetchData(function(err, res) {
				results = results.concat(res);
				callback(err,results);
			});
		}
	}, getDirectories,data);
};



exports.setPermission = setPermission;
exports.validateEmails = validateEmails;