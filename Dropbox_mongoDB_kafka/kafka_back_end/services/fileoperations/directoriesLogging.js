var mongo = require('./../database/mongoDB');
var userprofile = require('./../utils/userprofile');
var fileutils = require('./../utils/files');

var CREATED = 0;
var UPDATED = 1;
var DELETED = 2;
var SHARED = 3;

var createDirectoryEntry = function(filepath,userid,isFile,parentdir,name,parentPath,callback){

    var data={"parentPath":parentPath,"name":name,"relative_path":filepath,"parent":parentdir+'',"createdby":userid+'',"isFile":isFile,"deleteflag":0};
	mongo.insertDoc("directory",data,function(err, data) {
		if(err){
			throw err;
		}
        logOperation({'path':filepath,'directoryid':data["ops"][0]["_id"]+'','operation':CREATED,'uid':userid},callback);

	});
};

var deleteDirEntry = function(filepath,userid,callback){
    var condition = {relative_path:filepath};
    var data = {$set: {deleteflag:'1'}};
    mongo.update("directory",condition,data,function(err,data){
        if(err){
            throw err;
        }
        getDirectoryId(filepath,function(err, results) {
            logOperation({'path':filepath,'directoryid':results.id,'operation':DELETED,'uid':userid},callback);
            callback(err,results);
        }, getDirId,data);



    }, deleteDir,data);
};

var getDirectoryId = function(filepath,callback){
console.log(filepath);
    if(filepath==fileutils.GLOBAL_FILE_PATH || filepath==''){
        callback(false, 1);
    }

    var condition = {$and:[{relative_path:filepath},{deleteflag:0}]};
    mongo.findOneDoc("directory",condition,function(err,data){
 		var retData ={id:(data._id+'')};
        callback(err, retData);
    });
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
	var data = {path:datajson.path, directoryid:datajson.directoryid,operation: datajson.operation,userid:datajson.uid,deleteflag:0};
	mongo.insertDoc("directory_logging",data,function(err, results) {
			callback(err, results);
	});
};

var getUserLoggings = function(req,res){

    getAllFileOperationsForUser(req.body.userid, function (err,logs) {
		res.status(201).json({status:'201',logs:logs});
    });
}

var getAllFileOperationsForUser = function(userid,callback){
	var query ={userid:userid} ;

	mongo.findDoc("directory_logging",query,function(err,results){

		var length = results.length;
        var result = {};
        query = [];
        while(length>0) {
            result = results[--length];
            query.push({relative_path:result.path});
        }
        mongo.findDoc("directory",{$or :query},function(err,data){
            var sendData = [];
            if (err) {
                console.log(err);
            } else {
                var length = data.length;
                var result = {};
                while(length>0){
                    result = data[--length];
                    if(userid == result.relative_path){
                        continue;
                    }
                    var path = (result.relative_path).split('/');
                    result.path = "home";
                    for(var i=1;i<path.length;i++){
                        result.path += "/"+path[i];
                    }
                    result.operation = getOperation(result.operation);
                    result.operationtime = userprofile.gtDateStringFromObject(result.operationtime,"MMDDYYYY",'/');
                    sendData.push(result);
                }
            }

            callback(err,sendData);
		});
	});
};


/*
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
*/

exports.logOperation = logOperation;
exports.getUserLoggings = getUserLoggings;
exports.createDirectoryEntry = createDirectoryEntry;
/*exports.getAllFileOperationsForDir = getAllFileOperationsForDir;*/
exports.getDirectoryId = getDirectoryId;
exports.deleteDirEntry = deleteDirEntry;