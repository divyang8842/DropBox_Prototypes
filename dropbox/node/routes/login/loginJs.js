var ejs = require("ejs");
var mysql = require('./../database/mysql');
var userprofile = require('./../utils/userprofile');
var security = require('./../utils/security');


function signin(req,res) {

	ejs.renderFile('./views/login/login.ejs',function(err, result) {
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
	
	// res.render('signin');
}

function renderUserResults(results){
	var length = results.length;
	while(length-->0){
		results[length].gender = userprofile.getGender(results[length].gender);
		results[length].dob = userprofile.gtDateStringFromObject(results[length].dob,"MMDDYYYY","/");
	}
	
	return results;
}

function afterSignIn(req,res)
{
	var getUser="select * from users where username='"+req.param("uname")+"' and password='" + security.encrypt(req.param("pswrd")) +"'";
	console.log("Query is:"+getUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("valid Login");
				ejs.renderFile('./views/login/successLogin.ejs', { data: renderUserResults(results) } , function(err, result) {
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
			else {    
				
				console.log("Invalid Login");
				ejs.renderFile('./views/login/failLogin.ejs',function(err, result) {
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
		}  
	},getUser);
}




function getAllUsers(req,res)
{
	var getAllUsers = "select * from users";
	console.log("Query is:"+getAllUsers);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				
				var rows = results;
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				
//				console.log("Results Type: "+(typeof results));
//				console.log("Result Element Type:"+(typeof rows[0].emailid));
//				console.log("Results Stringify Type:"+(typeof jsonString));
//				console.log("Results Parse Type:"+(typeof jsString));
				
				console.log("Results: "+(results));
//				console.log("Result Element:"+(rows[0].emailid));
//				console.log("Results Stringify:"+(jsonString));
//				console.log("Results Parse:"+(jsonParse));
				
				ejs.renderFile('./views/successLogin.ejs',{data:jsonParse},function(err, result) {
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
			else {    
				
				console.log("No users found in database");
				ejs.renderFile('./views/failLogin.ejs',function(err, result) {
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
		}  
	},getAllUsers);
}

exports.signin=signin;
exports.afterSignIn=afterSignIn;
exports.getAllUsers=getAllUsers;
