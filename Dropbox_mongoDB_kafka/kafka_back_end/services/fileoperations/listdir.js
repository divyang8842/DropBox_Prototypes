var fs = require('fs');
const util = require('util');
var testFolder = './routes/';
var fileUtils = require('./../utils/files');
var permission = require('./../fileoperations/permissions');
var star = require('./../user/staring');
var dirlog = require('./../fileoperations/directoriesLogging');
var mongo = require('./../database/mongoDB');

var checkFileIsFolder = function (filename){
	try{
		var stats = fs.statSync(filename);
		return !stats.isFile();
	}catch(ex){
		console.log(ex);
	}
	return false;
};

var getAllChildDirectories=function(root,userid,callback){

	dirlog.getDirectoryId(root,function(err,data){
		if(data.id!= undefined){
			//console.log("data.id : "+data.id);
			var query ={$and:[{"parent":data.id},{"deleteflag":0}]};

			//console.log(JSON.stringify(query));
			mongo.findDoc("directory",query,function(err,result){
                if(!err){
                    callback(err,result);
				}else{
                    callback(err,[]);
				}
			});
		}
	})
};
var listdir = function (data,callback)
{
	var root = data.root;
	var userid = data.userid;
	var res = {};

    res.status=201;
    res.fileLst=[];
    res.stared=[];
    res.shared=[];

	getAllChildDirectories(root,userid,function(err,files){

			//console.log("files : "+JSON.stringify(files));
            if(err){
                console.log(err);
                res.status = 401;
                callback(null,res);
            }else{
                res.fileLst=files;
                star.getAllStaredDirectories(userid,function (err1,results1) {
                    if(err1){
                        res.status = 401;
                        callback(null,res);
                    }else{
                        res.stared=results1;
                    	permission.getAllPermittedDirectories(userid,function(err,results2){
                    		if(!err){
                                res.shared=results2;
							}else{
                                res.status = 401;
                            }
                            //console.log("res is ",res);
                            callback(null,res);
						})
                      }
				});
			}
		});
};
var includeStaredFlag = function(directoryList, staredlist){
	var length = directoryList.length;


}


/*
exports.DirectoryList = DirectoryList;*/
exports.getAllChildDirectories = getAllChildDirectories;
exports.listdir = listdir;
exports.checkFileIsFolder = checkFileIsFolder;