//var fs = require("fs");
//var path = require('path');
var mkdirp = require('mkdirp');
var GLOBAL_FILE_PATH = "./public/uploads";

var createDirectory = function(filepath,callback){
	console.log(filepath)
	mkdirp(GLOBAL_FILE_PATH+'/'+filepath, function (err) {
	    if (err)  {callback(err,filepath);}
	    else  {callback(err,filepath);}
	});
};


exports.GLOBAL_FILE_PATH = GLOBAL_FILE_PATH;
exports.createDirectory = createDirectory;