var fs = require('fs');
var ejs = require('ejs');
var testFolder = './routes/';
var fileUtils = require('./../utils/files');
var star = require('./../user/staring');
var mysql = require('./../database/mysql');

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
    var getDirId =  "SELECT d.id as id,d.name as name,d.isfile as isfile,d.relative_path as path,s.id as staredId FROM directories d LEFT OUTER JOIN stareddir s on (s.deleteflag=0 AND s.directoryid = d.id) where parent=(SELECT id FROM directories where relative_path=?) AND d.deleteflag=0";
    var data=[root];

   	 mysql.fetchData(function(err, results) {
		//console.log(results);

         var sendFiles=[];

         for(var i=0;i<results.length;i++)
         {
             var file = {};
             file.name = results[i].name;
             file.path = results[i].path;
             file.fullPath =fileUtils.GLOBAL_FILE_PATH +"/"+results[i].path;
             if(checkFileIsFolder(fileUtils.GLOBAL_FILE_PATH +"/"+results[i].path)){

                 file.isFolder = true;
             }else{
                 file.isFolder = false;
             }

                 file.isStared = results[i].staredId>0;


             console.log(JSON.stringify(file));

             sendFiles.push(file);


         }
        callback(err,sendFiles);
    }, getDirId,data);


}

/*
var DirectoryList=function (root,userid,callback){
	fs.readdir(fileUtils.GLOBAL_FILE_PATH +"/"+root, function (err, files)
			{
		if(err){
			callback(err,{});
		}
		var sendFiles=[];
		
				for(var i=0;i<files.length;i++)
				{
					var file = {};
					file.name = files[i];
					file.path = root+"/"+files[i];
                    file.fullPath =fileUtils.GLOBAL_FILE_PATH +"/"+root+"/"+files[i];
					if(checkFileIsFolder(fileUtils.GLOBAL_FILE_PATH +"/"+root+"/"+files[i])){
						
						file.isFolder = true;
					}else{
						file.isFolder = false;
					}
                     if(star.isDirStared(root+"/"+files[i], userid)){
                         file.isStared = true;
                     }else{
                         file.isStared = false;
                     }

					console.log(JSON.stringify(file));

                        sendFiles.push(file);


				}

				callback(err,sendFiles);
			});
};*/

var listdir = function (req,res)
{
	var root = req.param('dir');
	var sess= req.session;
	var userid = sess.userid;

	return getAllChildDirectories(root,userid,function(err,files){
		if(err){
			console.log(err);
		}else{
            star.getAllStaredDirectories(req.session.userid,function (err1,results1) {

            	if(err1){
                    res.json({status:'201',fileLst:files,stared:[]});
				}else{
            		//console.log(JSON.stringify({status:'201',fileLst:files,stared:results1}));
                    res.json({status:'201',fileLst:files,stared:results1});

                }

            });


		}
	});

};


/*
exports.DirectoryList = DirectoryList;*/
exports.getAllChildDirectories = getAllChildDirectories;
exports.listdir = listdir;
