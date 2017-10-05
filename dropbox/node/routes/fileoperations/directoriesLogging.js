var mysql = require('./../database/mysql');

var CREATED = "0";
var UPDATED = "1";
var DELETED = "2";
var SHARED = "3";


var getOperation = function(operation){
	if(operation === CREATED){
		return "Created";
	}else if(operation === UPDATED){
		return "Updated";
	}else if(operation === DELETED){
		return "Deleted";
	}else if(operation === SHARED){
		return "Shared";
	}
};

var logOperation = function(datajson,callback) {
	var setPermit = "INSERT INTO directory_logging (directoryid,operation,userid) VALUES(?,?,?)";
	var data=[datajson.directoryid,datajson.operation,datajson.uid];
	mysql.setData(function(err, results) {
			callback(err, results);
	}, setPermit,data);
};


var createDirectoryEntry = function(datajson,callback){
	var createDirectoryEntry = "INSERT INTO Directories (name,relative_path,parentDir,createdby,isFile) VALUES(?,?,?,?,?)";
	var data=[datajson.name,datajson.filepath,datajson.parentdir,datajson.userid,datajson.isFile];
	mysql.setData(function(err, results) {
		if(err){
			callback(err, results);
		}else{
			data = {directoryid:results.insertId,operation:CREATED,uid:datajson.userid};
			logOperation(data,function(err,result){
				callback(err, results);
			});
		}
	}, createDirectoryEntry,data);
};


var getAllFileOperationsForUser = function(userid,callback){
	var getDirectories ="SELECT operation as operation,datetime as datetime FROM directory_logging WHERE userid = ?";
	var data=[userid];
	
	mysql.fetchData(function(err, results) {
		if (err) {
			console.log(err);
		} else {
			var length = results.length;
			var result = {};
			while(length>0){
				result = results[--length];
				result.operation = getOperation(result.operation);
			}
		}
		callback(err,results);
	}, getDirectories,data);
};


var getAllFileOperationsForDir = function(dirid,callback){
	var getDirectories ="SELECT dl.operation AS operation,dl.datetime AS DATETIME,(u.ulname+','+u.ufname) AS username FROM directory_logging dl JOIN users u ON u.uid = dl.userid WHERE dl.directoryid = ?";
	var data=[dirid];
	
	mysql.fetchData(function(err, results) {
		if (err) {
			console.log(err);
		} else {
			var length = results.length;
			var result = {};
			while(length>0){
				result = results[--length];
				result.operation = getOperation(result.operation);
			}
		}
		callback(err,results);
	}, getDirectories,data);
};

exports.logOperation = logOperation;
exports.getAllFileOperationsForUser = getAllFileOperationsForUser;
exports.getAllFileOperationsForDir = getAllFileOperationsForDir;
exports.createDirectoryEntry = createDirectoryEntry;
