var mysql = require('./../database/mysql');

var CREATED = "0";
var UPDATED = "1";
var DELETED = "2";
var SHARED = "3";

var createDirectoryEntry = function(filepath,userid,isFile,parentdir,name,callback){
	var createDirectoryEntrySql = "INSERT INTO Directories (name,relative_path,parent,createdby,isFile) VALUES(?,?,?,?,?)";
	var data=[name,filepath,parentdir,userid,isFile];
	mysql.setData(function(err, results) {
		if(err){
			throw err;
		}

        logOperation({'directoryid':results.insertId,'operation':CREATED,'uid':userid},callback);

	}, createDirectoryEntrySql,data);
};

var deleteDirEntry = function(filepath,userid,callback){
    var deleteDir = "UPDATE Directories SET deleteflag = 1 WHERE relative_path=?";
    var data=[filepath];
    mysql.setData(function(err, results) {
        if(err){
            throw err;
        }
        var getDirId =  "SELECT id  FROM Directories WHERE relative_path=?";
        var data=[filepath];

        mysql.fetchData(function(err, results) {
            logOperation({'directoryid':results[0].id,'operation':DELETED,'uid':userid},callback);
            callback(err,results);
        }, getDirId,data);



    }, deleteDir,data);
};

var getDirectoryId = function(filepath,callback){

    var getDirectoryIdSql = "SELECT id FROM Directories WHERE relative_path=?";
    var data=[filepath];
    mysql.setData(function(err, results) {
        callback(err, results);
    }, getDirectoryIdSql,data);
};


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
exports.createDirectoryEntry = createDirectoryEntry;
exports.getAllFileOperationsForDir = getAllFileOperationsForDir;
exports.getDirectoryId = getDirectoryId;
exports.deleteDirEntry = deleteDirEntry;