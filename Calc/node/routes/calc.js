
/*
 * GET users listing.
 */

var express = require('express');
var router = express.Router();

router.post('/doCompute', function (req, res, next) {
	var data1 = req.body.data1;
	var data2 = req.body.data2;
	var operationToPerform = req.body.operation;
	try {
		if (isNaN(data1) || isNaN(data2)) {
			throw "Invalid Numbers.";
		} else {
			var data = 0;
			data1 = parseInt(data1);
			data2 = parseInt(data2);
			if (operationToPerform == '+') {
				data = data1 + data2;
			} else if (operationToPerform == '-') {
				data = data1 - data2;
			} else if (operationToPerform == '*') {
				data = data1 * data2;
			} else if (operationToPerform == '/') {
				if (data2 == 0) {
					throw "Can not devide by Zero.";
				}
				data = data1 / data2;
			} else {
				throw "Invalid operation to perform.";
			}
			res.status(201).json(
					{
						message : "" + data1 + "" + operationToPerform + ""
								+ data2 + "=" + data
					});
		}
	} catch (e) {
		res.status(401).json({
			message : e.message
		});
	}
	
});
module.exports = router;