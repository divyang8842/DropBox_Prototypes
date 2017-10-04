//var fs = require("fs");
//var path = require('path');
var mkdirp = require('mkdirp');
var GLOBAL_FILE_PATH = "D:/DROPBOX/Files/";
var createDirectory = function(filepath,callback){
	
	
	mkdirp(GLOBAL_FILE_PATH+'/'+filepath, function (err) {
	    if (err)  callback(err,filepath);
	    else  callback(err,filepath);
	});
//	var dirname = path.dirname(GLOBAL_FILE_PATH+'/'+filepath);
//	  if (fs.existsSync(dirname)) {
//	    return true;
//	  }else{
//		  fs.mkdirSync(dirname);
//	  }
	  
	
//	fs.mkdir(GLOBAL_FILE_PATH+'/'+path, function (err) {
//	    if (err) {
//	        console.log('failed to create directory', err);
//	    } else {
////	        fs.writeFile(path + "/mytemp", myData, function(err) {
////	            if (err) {
////	                console.log('error writing file', err);
////	            } else {
////	                console.log('writing file succeeded');
////	            }
////	        });
//	    	 console.log('create directory successfull.', err);
//	    }
//	});
};


exports.GLOBAL_FILE_PATH = GLOBAL_FILE_PATH;
exports.createDirectory = createDirectory;