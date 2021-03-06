var ejs = require("ejs");
var mysql = require('./../database/mysql');
var login = require('./loginJS');
var security = require('./../utils/security');
var fileUtils = require('./../utils/files');
var dirlog = require('./../fileoperations/directoriesLogging');
var userprofile = require('./../utils/userprofile');
 
 var signup = function (req,res) {
 
 	ejs.renderFile('./views/login/signup.ejs',function(err, result) {
 	   // render on success
 	   if (!err) {
 	            res.end(result);
 	   }
 	   // render or error
 	   else {
 	            res.end('An error occurred');
 	            console.log(err);
 	   }   
    });
 };
 
 
 var afterSignUp = function(req,res){


     var signup="INSERT into users (ufname,ulname,emailid,username,password) values ('"+req.body.firstname+"','"+req.body.lastname+"','"+req.body.email+"','"+req.body.email+"','"+security.encrypt(req.body.password)+"')";

 	mysql.setData(function(err,results){
 		if(!err && results.affectedRows > 0){
 		
 			var path = results.insertId;
 			fileUtils.createDirectory(path,function(err,path){
 				mysql.setData(function(err,results1){
                    dirlog.createDirectoryEntry(path,results.insertId,0,1,results.insertId,function(){

                        var data ={work:'',sports:'',mobile:'',education:'',music:'',shows:'',userid:results.insertId};

                        userprofile.setUserProfileData(data,function(err,results){
                        	if(results.affectedRows>0){
                                res.status(200).json({
                                    status:'200',
                                    message : "Signup Successfull."
                                });
							}else{
                                res.status(401).json({
                                    status:'401',
                                    message : "Error occured."
                                });
							}

						});

					});

 				},"UPDATE users SET homedirectory='"+path+"' WHERE uid='"+results.insertId+"'");
 				
 			});
 		}
 			else {    
 				
 				res.status(401).json({
 					status:'401',
 					message : "Error occured while Signup."
 				
 				});
 		}  
 	},signup);
 };
 
 exports.signup = signup;
 exports.afterSignUp = afterSignUp; 