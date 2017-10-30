var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var kafka = require('./kafka/client');
var fileoperations =  require('./utils/files');
var fs = require("fs");
var path = require('path');
var mime = require('mime');


var GLOBAL_FILE_PATH = "./public/uploads";
var GLOBAL_TEMP_PATH = "./public/uploads/temp";

var mkdir = function (req,res)
{
    var path = req.body.dirName;
    var parent = req.body.path;
    var userid= req.session.user.userid;
    var data = {"path":path,"parent":parent,"userid":userid};
    fileoperations.mkdir(data,function(err,result){
        kafka.make_request('mkdir_topic',data, function(err,results){
            console.log('in result mkdir');
            console.log(results);
            if(err){
                done(err,{});
            }
            else
            {
                if(results.status == 201 || results.status == '201'){
                    res.status(201).json(results);
                }
                else {
                    res.status(401).json(results);
                }
            }
        });
    })
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
    try {
        if (fs.statSync(GLOBAL_FILE_PATH + '/' + filepath).isDirectory()) {
            deleteFolderRecursive(GLOBAL_FILE_PATH + '/' + filepath, userid);
        } else {

            fs.unlinkSync(GLOBAL_FILE_PATH + '/' + filepath);
        }
    }catch(ex){
        console.log(ex);
    }

    callback(false,filepath);
};

var delDir = function(req,res){

    try {
        var path = req.body.dirName;
        var parent = req.body.path;
        var filepath = parent + "/" + path;

        var data = {filepath:filepath,userid:req.session.user.userid}
        kafka.make_request('deldir_topic',data, function(err,results){
            console.log('in result deldir');
            console.log(results);
            if(err){
                done(err,{});
            }
            else
            {
                if(results.status == 201 || results.status == '201'){
                    deleteDir(filepath, req.session.userid, function () {

                        res.status(201).json({
                            status:201,
                            message: 'Successfully deleted File'
                        });

                    });
                }
                else {
                    res.status(401).json(results);
                }
            }
        });

    }catch (ex){
        res.status(401).json({
            message: 'Error in delete File'
        });
    }
};

var download = function(req, res){

    var file = GLOBAL_FILE_PATH + '/'+req.body.path;
    var filename = path.basename(file);
    var mimetype = mime.lookup(file);


    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);
    res.download(file);

};

var validateEmails = function(req,res){
    var emailAddress = req.body.emails;
    var data = {emailAddress:emailAddress,type:"emails"};
    kafka.make_request('sharefile_topic',data, function(err,results){
        console.log('in result validate emails');
        console.log(results);
        if(err){
            done(err,{});
        }
        else
        {
            if(results.status == 201 || results.status == '201'){

                    res.status(201).json({
                        status:201,
                        message: 'Successfully deleted File'
                    });
            }
            else {
                res.status(401).json(results);
            }
        }
    });

}
var shareFile = function(req,res){
    var fileToShare = req.body.fileToShare;
    var emailAddress = req.body.emails;

    var data = {fileToShare:fileToShare,emailAddress:emailAddress};

    kafka.make_request('sharefile_topic',data, function(err,results){
        console.log('in result sharefile_topic');
        console.log(results);
        if(err){
            done(err,{});
        }
        else
        {
            if(results.status == 201 || results.status == '201'){
                    res.status(201).json({
                        status:201,
                        message: 'Successfully deleted File'
                    });
            }
            else {
                res.status(401).json(results);
            }
        }
    });

}

exports.shareFile = shareFile;
exports.download = download;
exports.delDir = delDir;
exports.mkdir = mkdir;
exports.validateEmails = validateEmails;