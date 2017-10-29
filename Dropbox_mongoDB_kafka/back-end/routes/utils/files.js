var fs = require("fs");
var path = require('path');
var mime = require('mime');

var zipFolder = require('zip-folder');

var GLOBAL_FILE_PATH = "./public/uploads";
var GLOBAL_TEMP_PATH = "./public/uploads/temp";

var createDirectory = function(filepath,callback){

	fs.mkdir(GLOBAL_FILE_PATH+'/'+filepath, function (err) {
	    if (err)  {callback(err,filepath);}
	    else  {callback(err,filepath);}
	});
};

var deleteFolderRecursive = function(path,userid) {

    var filepath =  path.replace(new RegExp(GLOBAL_FILE_PATH+'/', 'g'), '');
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath,userid);
            } else { // delete file

                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);

    }
};

var deleteDir = function(filepath,userid,callback){

    console.log(filepath);
    if(fs.statSync(GLOBAL_FILE_PATH+'/'+filepath).isDirectory()){
        deleteFolderRecursive(GLOBAL_FILE_PATH+'/'+filepath,userid);
    }else{
        fs.unlinkSync(GLOBAL_FILE_PATH+'/'+filepath);
    }
    callback(false,filepath);
};

var delDir = function(req,res,next){

    try {
        var path = req.body.dirName;
        var parent = req.body.path;
        var filepath = parent + "/" + path;
        deleteDir(filepath, req.session.userid, function () {

            res.status(201).json({
                message: 'Successfully deleted File'
            });

        });
    }catch (ex){
        res.status(201).json({
            message: 'Successfully deleted File'
        });
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

var mkdir = function (data, callback) {
    var path = data.path;
    var parent = data.parent;
    createDirectory(parent+'/'+path,function() {
        callback(false, {status: 201});
    });
};
var download = function(req, res){

    var file = GLOBAL_FILE_PATH + '/'+req.body.path;
    var filename = path.basename(file);
    var mimetype = mime.lookup(file);


    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);
    res.download(file);

};

var ZipFile = function(from,to,callback){
    zipFolder(from, to, function(err) {
        if(err) {

        } else {

        }
    });
};





exports.GLOBAL_TEMP_PATH = GLOBAL_TEMP_PATH;
exports.GLOBAL_FILE_PATH = GLOBAL_FILE_PATH;
exports.createDirectory = createDirectory;
exports.checkFileIsFolder = checkFileIsFolder;
exports.checkFileIsFolder1 = checkFileIsFolder1;
exports.mkdir= mkdir;
exports.delDir= delDir;
exports.download= download;

