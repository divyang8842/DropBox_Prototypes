/*
 * GET users listing.
 */

var express = require('express');
var router = express.Router();

router.post('/doCompute', function(req, res, next) {
	
	try {
		
		var data1 = req.body.num1;
		var data2 = req.body.num2;
		var operationToPerform = req.body.operation;
		
		data1 = parseFloat(data1);
		data2 = parseFloat(data2);
		
		if (isNaN(data1) || isNaN(data2)) {
			res.status(401).json({
				message : "Invalid Numbers.",
				status:"401"
			});
		} else {
			var data = 0;
			
			if (operationToPerform == '+') {
				data = data1 + data2;
			} else if (operationToPerform == '-') {
				data = data1 - data2;
			} else if (operationToPerform == '*') {
				data = data1 * data2;
			} else if (operationToPerform == '/') {
				if (data2 == 0) {
					res.status(401).json({
						message : "Can not devide by Zero.",
						status:"401"
					});
				}
				data = data1 / data2;
			} else {
				res.status(401).json({
					message : "Invalid operation to perform.",
					status:"401"
				});
			}
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