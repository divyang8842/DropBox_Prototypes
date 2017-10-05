var mysql = require('./../database/mysql');

var setStaredDir = function(dataJson,callback) {
	var setPermit = "INSERT INTO staredDir (userid,directoryid) VALUES(?,?)";
	var data=[dataJson.uid,dataJson.dirid];
	mysql.setData(function(err, results) {
		if (err) {
			//throw err;
			callback(err,results);
		} else {
			callback(err,results);
		}
	}, setPermit,data);
};


var getAllStaredDirectories = function(userid,callback){
	var getDirectories ="SELECT d.id,d.name,d.isfile,d.relative_path FROM staredDir sd JOIN directories d ON d.id= sd.directoryid WHERE sd.userid=? AND sd.deleteflag=0 AND d.deleteflag = 0";
	var data=[userid];
	
	mysql.fetchData(function(err, results) {
			callback(err,results);
		
	}, getDirectories,data);
};
exports.setStaredDir = setStaredDir;
exports.getAllStaredDirectories = getAllStaredDirectories;
