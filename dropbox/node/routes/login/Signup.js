var ejs = require("ejs");
var mysql = require('./../database/mysql');
var login = require('./loginJS');
var security = require('./../utils/security');
var fileUtils = require('./../utils/files');
 
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
 	var signup="INSERT users (ulname,ufname,emailid,username,password) values ('"+req.param("firstname")+"','"+req.param("lastname")+"','"+req.param("email")+"','"+req.param("email")+"','"+security.encrypt(req.param("password"))+"')";
 	console.log(signup);
 	mysql.setData(function(err,results){
 		if(!err && results.affectedRows > 0){
 		
 			console.log("valid Signup");
 			var path = results.insertId;
 			fileUtils.createDirectory(path,function(err,path){
 				mysql.setData(function(err,results){
 				},"UPDATE users SET homedirectory='"+path+"' WHERE uid='"+results.insertId+"'");
 				
 			});
 			
 			res.status(201).json({
 				status:'201',
 				message : "Signup Successfull."
 			
 			});
 		}
 			else {    
 				
 				console.log("Invalid Signup.");
 				res.status(401).json({
 					status:'401',
 					message : "Error occured while Signup."
 				
 				});
 		}  
 	},signup);
 };
 
 exports.signup = signup;
 exports.afterSignUp = afterSignUp; 