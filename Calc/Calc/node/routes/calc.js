/*
 * GET users listing.
 */

var express = require('express');
var router = express.Router();

router.post('/add', function(req, res, next) {

    try {

        var data1 = req.body.num1;
        var data2 = req.body.num2;
        var operationToPerform = "+";

        data1 = parseFloat(data1);
        data2 = parseFloat(data2);

        if (isNaN(data1) ) {
            res.status(401).json({
                message : "Numbers 1 is invalid.",
                status:"401"
            });
        }else if(isNaN(data2)){
            res.status(401).json({
                message : "Numbers 2 is invalid.",
                status:"401"
            });
        }  else {
            var data = 0;
            data = data1 + data2;
        }
        res.status(201).json(
            {
                message : "" + data1 + "" + operationToPerform + ""
                + data2 + "=" + data,
                status:"201"
            });

    } catch (e) {
        res.status(401).json({
            message : e.message,
            status:"401"
        });
    }

});


router.post('/sub', function(req, res, next) {

    try {

        var data1 = req.body.num1;
        var data2 = req.body.num2;
        var operationToPerform = "-";

        data1 = parseFloat(data1);
        data2 = parseFloat(data2);

        if (isNaN(data1) ) {
            res.status(401).json({
                message : "Numbers 1 is invalid.",
                status:"401"
            });
        }else if(isNaN(data2)){
            res.status(401).json({
                message : "Numbers 2 is invalid.",
                status:"401"
            });
        } else {
            var data = 0;
            data = data1 - data2;
        }
        res.status(201).json(
            {
                message : "" + data1 + "" + operationToPerform + ""
                + data2 + "=" + data,
                status:"201"
            });

    } catch (e) {
        res.status(401).json({
            message : e.message,
            status:"401"
        });
    }

});

router.post('/mult', function(req, res, next) {

    try {

        var data1 = req.body.num1;
        var data2 = req.body.num2;
        var operationToPerform = "*";

        data1 = parseFloat(data1);
        data2 = parseFloat(data2);

        if (isNaN(data1) ) {
            res.status(401).json({
                message : "Numbers 1 is invalid.",
                status:"401"
            });
        }else if(isNaN(data2)){
            res.status(401).json({
                message : "Numbers 2 is invalid.",
                status:"401"
            });
        } else {
            var data = 0;
            data = data1 * data2;
        }
        res.status(201).json(
            {
                message : "" + data1 + "" + operationToPerform + ""
                + data2 + "=" + data,
                status:"201"
            });

    } catch (e) {
        res.status(401).json({
            message : e.message,
            status:"401"
        });
    }

});

router.post('/div', function(req, res, next) {

    try {

        var data1 = req.body.num1;
        var data2 = req.body.num2;
        var operationToPerform = "/";

        data1 = parseFloat(data1);
        data2 = parseFloat(data2);

        if (isNaN(data1) ) {
            res.status(401).json({
                message : "Numbers 1 is invalid.",
                status:"401"
            });
        }else if(isNaN(data2)){
            res.status(401).json({
                message : "Numbers 2 is invalid.",
                status:"401"
            });
        } else {
            var data = 0;


            if (data2 == 0) {
                res.status(401).json({
                    message: "Can not devide by Zero.",
                    status: "401"
                });
            }else
                data = data1 / data2;
            res.status(201).json(
                {
                    message : "" + data1 + "" + operationToPerform + ""
                    + data2 + "=" + data,
                    status:"201"
                });
            }


    } catch (e) {
        res.status(401).json({
            message : e.message,
            status:"401"
        });
    }

});
module.exports = router;