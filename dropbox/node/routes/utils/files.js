//var fs = require("fs");
//var path = require('path');
var mkdirp = require('mkdirp');
var GLOBAL_FILE_PATH = "./public/uploads";
var GLOBAL_TEMP_PATH = "./public/uploads/temp";

var createDirectory = function(filepath,callback){
	console.log(filepath)
	mkdirp(GLOBAL_FILE_PATH+'/'+filepath, function (err) {
	    if (err)  {callback(err,filepath);}
	    else  {callback(err,filepath);}
	});
};

exports.GLOBAL_TEMP_PATH = GLOBAL_TEMP_PATH;
exports.GLOBAL_FILE_PATH = GLOBAL_FILE_PATH;
exports.createDirectory = createDirectory;