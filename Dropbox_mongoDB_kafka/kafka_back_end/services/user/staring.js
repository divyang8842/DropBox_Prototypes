
var mongo = require('./../database/mongoDB');
var fileUtils = require('./../utils/files');
var dirlog = require('./../fileoperations/directoriesLogging');

var setStaredDir = function(data,callback) {
	dirlog.getDirectoryId(data.filepath,function(err, results){
        var data1 = {"path":data.filepath,"userid":data.userid,"directoryid":results.id,"deleteflag":0};
        mongo.insertDoc("staredDir",data1,function(err, results) {
            if (err) {
               callback(err,{status:'401'});
            } else {
                callback(false,{status:'201'});
            }
        });
	});
};

var isDirStared = function(filepath,userid) {
    var query = [{"path":filepath},{"userid":userid},{"deleteflag":0}];
    query = {$and:query};
        mongo.findOneDoc("staredDir",query,function(err, result) {
            if (err) {
                return( false);
            } else {
                return( result.path);
            }
        });
};



var UnStarDir = function(data,callback) {
    var query = [{"path":data.filepath},{"userid":data.userid},{"deleteflag":0}];
    query = {$and:query};
    data = {$set: {deleteflag:1}};
    mongo.update("staredDir",query,data,function(err,data){
        if (err) {
            callback(err,{status:'401'});
        } else {
            callback(false,{status:'201'});
        }
    })
};

var processStaring = function (data,callback) {
    if(data.type == 'star'){
        setStaredDir(data,callback);
    }else{
        UnStarDir(data,callback);
    }
}

var getAllStaredDirectories = function(userid,callback){
    var querydata = [{"userid":userid},{"deleteflag":0}];
    var query = {$and:querydata};
    console.log(query);
    mongo.findDoc("staredDir",query,function(err,data) {
        var length =  data.length;
        query = [];
        while(length>0){
            var result = {};
            result = data[--length];
            result = {relative_path:result.path};
            query.push(result);
        }

        query = {$or : query};
        mongo.findDoc("directory",query,function(err,directories){

            if(!err){
                var returnData = [];
                var length = directories.length;

                while(length-->0){
                    var filedata ={};

                    filedata.name = directories[length].name;
                    filedata.relative_path = directories[length].relative_path;
                    filedata.fullPath =fileUtils.GLOBAL_FILE_PATH +"/"+filedata.relative_path;

                    filedata.isFile = directories[length].isFile;

                    returnData.push(filedata);

                }
                console.log(JSON.stringify(returnData));
                callback(false,returnData);
            }else{
                callback(err,results);
            }

        })
    });
};
exports.setStaredDir = setStaredDir;
exports.getAllStaredDirectories = getAllStaredDirectories;
exports.processStaring = processStaring;
/*
exports.UnStarDir = UnStarDir;

exports.isDirStared = isDirStared;*/
