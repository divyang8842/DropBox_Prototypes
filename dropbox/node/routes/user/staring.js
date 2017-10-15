var mysql = require('./../database/mysql');
var fileUtils = require('./../utils/files');
var dirlog = require('./../fileoperations/directoriesLogging');

var setStaredDir = function(req,res) {
	var setStar = "INSERT INTO staredDir (userid,directoryid) VALUES(?,?)";

    dirlog.getDirectoryId(req.body.filepath,function(err, results){
        var data=[req.session.userid,results[0].id];
        mysql.setData(function(err, results) {
            if (err) {
               res.status(401).json({status:'401'});
            } else {
                res.status(201).json({status:'201'});
            }
        }, setStar,data);
	});
};

var isDirStared = function(filepath,userid) {
    var setStar = "SELECT * from staredDir WHERE userid=? AND directoryid=? and deleteflag=0";
    dirlog.getDirectoryId(filepath,function(err, results){
        if(results.length<=0){
            return false;
        }
        var data=[userid,results[0].id];
        mysql.fetchData(function(err, results) {
            if (err) {
                console.log(false);
                return( false);
            } else {
                console.log(true);
                return( results.length>0?true:false);
            }
        }, setStar,data);
    });
};



var UnStarDir = function(req,res) {
    var setStar = "UPDATE staredDir SET deleteflag=1 WHERE userid=? AND directoryid=?";
    dirlog.getDirectoryId(req.body.filepath,function(err, results){
        var data=[req.session.userid,results[0].id];
        mysql.setData(function(err, results) {
            if (err) {
                res.status(401).json({status:'401'});
            } else {
                res.status(201).json({status:'201'});
            }
        }, setStar,data);
    });
};



var getAllStaredDirectories = function(userid,callback){
	var getDirectories ="SELECT DISTINCT d.id as id,d.name as name,d.isfile as isfile,d.relative_path as path FROM staredDir sd JOIN directories d ON d.id= sd.directoryid WHERE sd.userid=? AND sd.deleteflag=0 AND d.deleteflag = 0";
	var data=[userid];
	
	mysql.fetchData(function(err, results) {

		if(!err){
			var returnData = [];
			var length = results.length;
			while(length-->0){

				var filedata ={};
                filedata.name = results[length].name;
                filedata.path = results[length].path;
                filedata.fullPath =fileUtils.GLOBAL_FILE_PATH +"/"+filedata.path;
                console.log(results[length].isFile);
                console.log(JSON.stringify(results[length]));

				filedata.isFolder = (results[length].isfile == 0)?true:false;

                returnData.push(filedata);

			}
            callback(false,returnData);
		}else{
            callback(err,results);
		}

		
	}, getDirectories,data);
};
exports.setStaredDir = setStaredDir;
exports.UnStarDir = UnStarDir;
exports.getAllStaredDirectories = getAllStaredDirectories;
exports.isDirStared = isDirStared;