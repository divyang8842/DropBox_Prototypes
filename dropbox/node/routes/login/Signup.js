var ejs = require("ejs");
var mysql = require('./../database/mysql');
var login = require('./loginJS');
var security = require('./../utils/security');


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
	var signup="INSERT users (ulname,ufname,emailid,username,password,dob,gender) values ('"+req.param("ufname")+"','"+req.param("ulname")+"','"+req.param("email")+"','"+req.param("email")+"','"+security.encrypt(req.param("pswrd"))+"','"+req.param("dob")+"','"+req.param("gender")+"')";
	console.log(signup);
	mysql.setData(function(err,results){
		if(!err && results.affectedRows > 0){
		
				console.log("valid Signup.");
				login.signin(req,res);
		}
			else {    
				
				console.log("Invalid Signup.");
				ejs.renderFile('./views/login/failSignup.ejs',function(err, result) {
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
		}  
	},signup);
};

exports.signup = signup;
exports.afterSignUp = afterSignUp;