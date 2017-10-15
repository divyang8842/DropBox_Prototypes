var express = require('express');
var router = express.Router();
var multer = require('multer');
var glob = require('glob');

var dirlog = require('./../fileoperations/directoriesLogging');
var files = require('./../utils/files');

var fs = require('fs');

var path = "";
var copy = function(from,to){

    fs.createReadStream(from).pipe(to);
}




var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        files.createDirectory(files.GLOBAL_TEMP_PATH,function(){});
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

    dirlog.getDirectoryId(req.body.path,function (err,results) {
        dirlog.createDirectoryEntry(req.body.path+'/'+path, req.session.userid, 1, results[0].id, path,function(){
            res.status(201).json({status:'201'});
        });
    });
});



module.exports = router;


