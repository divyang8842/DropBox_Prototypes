var mysql = require('./../database/mysql');
var utils = require('./../utils/userprofile');
var email = require('./../utils/email');
var dirlog = require('./../fileoperations/directoriesLogging');


var GROUP = 1;
var USER = 0;
var link = 2;

var validateEmails = function(req,res){
var emailAddress = req.body.emails;
var emails = emailAddress.split(',');

    utils.checkValidUserEmails(emailAddress,function(err,results){
		if(results.length!= emails.length){
            res.status(201).json({status:'201',linkShare:'true'});
		}else{
            res.status(201).json({status:'201',linkShare:'false'});
		}
	});

}

var shareFile = function(req,res){
	var fileToShare = req.body.fileToShare;
    var emailAddress = req.body.emails;
    var emails = emailAddress.split(',');

    dirlog.getDirectoryId(fileToShare,function (err,results1) {
        var dirId =  results1[0].id;

        utils.checkValidUserEmails(emailAddress,function(err,results){
            if(results.length!= emails.length){
				setPermission({'dirid':dirId,'type':link,'pid':'-1'},function(){
                    res.status(201).json({status:'201',linkShare:'true'});
				});
            }else{
                var length = results.length;
                    while(length-->0){
                        setPermission({'dirid':dirId,'type':USER,'pid':results[length].uid},function(){
                        });
                    }
                res.status(201).json({status:'201',linkShare:'false'});
            }
            email.setMailOptions(emailAddress,"File is shared with you.")
            email.sendEmail();
        });

    });


}
var setMessage = function(dirid,type){
		var data = "A File is shared with you by a Dropbox User.";
		if(type==li)
		data += "";
}


var setPermission = function(dataJson,callback) {
	var setPermit = "INSERT INTO Directory_Permission (directoryid,permissiontype,permit_id) VALUES(?,?,?)";
	var data=[dataJson.dirid,dataJson.type,dataJson.pid];
	mysql.setData(function(err, results) {
		if (err) {
			//throw err;
			callback(err,results);
		} else {
			callback(err,results);
		}
	}, setPermit,data);
};




var getAllPermittedDirectories = function(userid,callback){
	var getDirectories ="SELECT d.name,d.relative_path,d.isfile FROM directories d JOIN directory_permission dp ON dp.directoryid = d.id JOIN users u ON (dp.permissiontype = 0 AND u.uid = dp.permit_id AND u.uid=?) WHERE u.deleteflag= 0 AND d.deleteflag=0 AND dp.deleteflag=0";
	var data=[userid];
	
	mysql.fetchData(function(err, results) {
		if (err) {
			//throw err;
			callback(err,results);
		} else {
			var getDirectories ="SELECT * FROM directories d 	JOIN directory_permission dp ON dp.directoryid = d.id 	JOIN user_group_mapping u ON (dp.permissiontype = 1 AND u.userid = dp.permit_id AND u.userid=?) WHERE u.deleteflag= 0 AND d.deleteflag=0 AND dp.deleteflag=0";
			var data=[userid];
			mysql.fetchData(function(err, res) {
				results = results.concat(res);
				callback(err,results);
			});
		}
	}, getDirectories,data);
};

exports.setPermission = setPermission;
exports.validateEmails = validateEmails;
exports.shareFile = shareFile;