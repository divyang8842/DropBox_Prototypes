var mysql = require('./../database/mysql');

var GROUP = 1;
var USER = 0;
var link = 2;

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
