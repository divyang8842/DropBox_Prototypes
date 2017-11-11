var fs = require("fs");
var path = require('path');
var mime = require('mime');




var mkdirp = require('mkdirp');
var dirlog = require('./../fileoperations/directoriesLogging');

var GLOBAL_FILE_PATH = "./public/uploads";
var GLOBAL_TEMP_PATH = "./public/uploads/temp";

var createDirectory = function(filepath,callback){

    try{
        if(fs.statSync(GLOBAL_FILE_PATH+'/'+filepath).isDirectory()){
            console.log("File already exist");
            callback(true,filepath);
        }else{
            mkdirp(GLOBAL_FILE_PATH+'/'+filepath, function (err) {
                if (err)  {callback(err,filepath);}
                else  {callback(err,filepath);}
            });
        }
    }catch(err){
        mkdirp(GLOBAL_FILE_PATH+'/'+filepath, function (err) {
            if (err)  {callback(err,filepath);}
            else  {callback(err,filepath);}
        });
    }

};

var deleteFolderRecursive = function(path,userid) {
    var filepath =  path.replace(new RegExp(GLOBAL_FILE_PATH+'/', 'g'), '');
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath,userid);
            } else { // delete file

                dirlog.deleteDirEntry(curPath.replace(new RegExp(GLOBAL_FILE_PATH+'/', 'g'), ''),userid,function(){});
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
        dirlog.deleteDirEntry(filepath,userid,function(){});
    }
};

var deleteDir = function(filepath,userid,callback){
    try{
        if(fs.statSync(GLOBAL_FILE_PATH+'/'+filepath).isDirectory()){
            deleteFolderRecursive(GLOBAL_FILE_PATH+'/'+filepath,userid);
        }else{
            dirlog.deleteDirEntry(filepath,userid,function(){});
            fs.unlinkSync(GLOBAL_FILE_PATH+'/'+filepath);
        }

    }catch(err){
        dirlog.deleteDirEntry(filepath,userid,function(){});
    }


    callback(false,filepath);
};

var delDir = function(data,callback){

    try {
        var filepath = data.filepath;
        deleteDir(filepath, data.userid, function (err,data) {

            if(err){
                callback(true,{status:401});
            }else{
                callback(false,{status:201});
            }



        });
    }catch (ex){
        callback(true,{status:401});
    }
};

var checkFileIsFolder = function (filename){
    try{
        var stats = fs.statSync(filename);
        return !stats.isFile();
    }catch(ex){
        console.log(ex);
    }
    return false;
};

var checkFileIsFolder1 = function (filename,callback){
    try{
        var stats = fs.statSync(filename);
        callback(!stats.isFile());
    }catch(ex){
        console.log(ex);
    }
    return false;
};

var mkdir = function (data,callback) {
    console.log("data in mkdir : ",data);
    var path = data.path;
    var parent = data.parent;
    createDirectory(parent+'/'+path,function(err,data){
        if(err){
            callback(true,{status:401});
        }else {
            dirlog.getDirectoryId(parent, function (err, results) {
                dirlog.createDirectoryEntry(parent + '/' + path, data.userid, 0, results.id, path, parent, function (err, data) {
                    if (err) {
                        callback(true, {status: 401});
                    } else {
                        callback(false, {status: 201});
                    }
                });
            });
        }
    });
};

// function to encode file data to base64 encoded string
function base64_encode(file,callback) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    var bufferData =  new Buffer(bitmap).toString('base64');

    callback(bufferData);
}

var download = function(data,callback){
    console.log(" data for download is : ",data);
    var file = GLOBAL_FILE_PATH + '/'+data.path;
    var filename = file.split('/');
    filename = filename[filename.length-1];
    var mimetype = mime.lookup(file);
callback();/*
    base64_encode(file,function(bufferdata){
        var bitmap = new Buffer(bufferdata, 'base64');
        callback(false,{bufferdata:bitmap,mimetype:mimetype,status:201,filename:filename});
    });*/
};

exports.GLOBAL_TEMP_PATH = GLOBAL_TEMP_PATH;
exports.GLOBAL_FILE_PATH = GLOBAL_FILE_PATH;
exports.createDirectory = createDirectory;
exports.checkFileIsFolder = checkFileIsFolder;
exports.checkFileIsFolder1 = checkFileIsFolder1;
exports.mkdir= mkdir;
exports.delDir= delDir;
exports.download= download;

