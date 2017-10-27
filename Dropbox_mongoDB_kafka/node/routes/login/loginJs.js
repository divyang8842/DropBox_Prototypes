var ejs = require("ejs");
var mysql = require('./../database/mysql');
var userprofile = require('./../utils/userprofile');
var security = require('./../utils/security');
var listdir = require('./../fileoperations/listdir');




function renderUserResults(results){
	var length = results.length;
	while(length-->0){
		results[length].gender = userprofile.getGender(results[length].gender);
		results[length].dob = userprofile.gtDateStringFromObject(results[length].dob,"MMDDYYYY","/");
	}
	return results;
}

function signin(req,res)
{

	var getUser="select uid as uid, ufname as ufname,homedirectory as homedirectory,password as password from users where username=? and deleteflag='0'";
	var data = [req.body.email];
	
	mysql.fetchData(function(err,results){

        var sess=req.session;
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0 && security.compareEncrypted(req.body.password,results[0].password)){
				    sess.userid = results[0].uid;
					res.status(200).json({
						status:'200',
						message : "Valid Login.",
						userid:results[0].uid,
						filelist:[],
						root:results[0].homedirectory,
						username:results[0].ufname
					});

			} else {    
				res.status(401).json({
					status:'401',
					message : "Invalid Login."
				});
			}
		}  
	},getUser,data);
}
var signout = function(req,res){
    var session=req.session;
    session.userid = null;
    session.destroy();
    res.status(201).json({
        status:'201',
        message : "Logged Out."
    });
};


exports.signin=signin;
exports.signout=signout;
//exports.getAllUsers=getAllUsers;
