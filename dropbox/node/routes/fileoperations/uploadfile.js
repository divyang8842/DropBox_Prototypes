var express = require('express');
var router = express.Router();
var multer = require('multer');
var glob = require('glob');




var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({storage:storage});

router.post('/uploadFile', upload.single('myFile'), function (req, res, next) {
    res.status(204).end();
});

module.exports = router;

