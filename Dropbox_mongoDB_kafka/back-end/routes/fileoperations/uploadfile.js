var express = require('express');
var router = express.Router();
var multer = require('multer');
var glob = require('glob');

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var kafka = require('./../kafka/client');

var files = require('./../utils/files');

var fs = require('fs');

var path = "";
var copy = function(from,to){
    fs.createReadStream(from).pipe(to);
};
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        files.createDirectory("temp",function(){});
        cb(null, files.GLOBAL_TEMP_PATH);
    },
    filename: function (req, file, cb) {
        path = file.originalname;
        cb(null, file.originalname);
    }
});
var upload = multer({storage:storage});
router.post('/uploadFile', upload.single('myFile'), function (req, res, next) {

    fs.createReadStream(files.GLOBAL_TEMP_PATH+'/'+path).pipe(fs.createWriteStream(files.GLOBAL_FILE_PATH+'/'+req.body.path+'/'+path));
    fs.unlinkSync(files.GLOBAL_TEMP_PATH+'/'+path);

    var data = {
        filename : path,
        parentpath : req.body.path,
        userid: req.session.user.userid

    };
    kafka.make_request('upload_file',data, function(err,results) {

        console.log('in result');
        console.log(results);
        if(err){
            res.status(401).json({status: '401'});
        }
        else
        {
            if(results.status == '201' || results.status == 201){

                res.status(201).json({status: '201'});
            }
            else {
                res.status(401).json({status: '401'});
            }
        }
    });
});
module.exports = router;