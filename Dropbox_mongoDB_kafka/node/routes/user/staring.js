
var mongo = require('./../database/mongoDB');
var fileUtils = require('./../utils/files');
var dirlog = require('./../fileoperations/directoriesLogging');

var setStaredDir = function(req,res) {
	dirlog.getDirectoryId(req.body.filepath,function(err, results){
        var data = {"path":req.body.filepath,"userid":req.session.user.userid,"directoryid":results.id,"deleteflag":0};
        mongo.insertDoc("staredDir",data,function(err, results) {
            if (err) {
               res.status(401).json({status:'401'});
            } else {
                res.status(201).json({status:'201'});
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

var UnStarDir = function(req,res) {
    var query = [{"path":filepath},{"userid":userid},{"deleteflag":0}];
    query = {$and:query};
    data = {$set: {deleteflag:1}};
    mongo.update("staredDir",query,data,function(err,data){
        if (err) {
            res.status(401).json({status:'401'});
        } else {
            res.status(201).json({status:'201'});
        }
    })

};



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
exports.UnStarDir = UnStarDir;
exports.getAllStaredDirectories = getAllStaredDirectories;
exports.isDirStared = isDirStared;