var fs = require('fs');
var ejs = require('ejs');
var testFolder = './routes/';
var fileUtils = require('./../utils/files');

var checkFileIsFolder = function (filename){
	try{
		var stats = fs.statSync(filename);
		return !stats.isFile();
	}catch(ex){
		console.log(ex);
	}
	
	return false;
};




var DirectoryList=function (root,callback){
	console.log(root);
	fs.readdir(fileUtils.GLOBAL_FILE_PATH +"/"+root, function (err, files) 
			{
		if(err){
			throw err;
		}
		var sendFiles=[];
		
				for(var i=0;i<files.length;i++)
				{
					var file = {};
					file.name = files[i];
					file.path = root+"/"+files[i];
					if(checkFileIsFolder(fileUtils.GLOBAL_FILE_PATH +"/"+root+"/"+files[i])){
						
						file.isFolder = true;
					}else{
						file.isFolder = false;
					}
					sendFiles.push(file);
				}

                console.log(JSON.stringify(sendFiles));
				callback(err,sendFiles);
			});
};

var listdir = function (req,res)
{
	var root = req.param('dir');
	var sess= req.session;

	return DirectoryList(root,function(err,files){
		if(err){
			console.log(err);
		}else{
			res.json(files);
		}
	});

};




exports.DirectoryList = DirectoryList;
exports.listdir = listdir;
