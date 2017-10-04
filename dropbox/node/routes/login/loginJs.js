var ejs = require("ejs");
var mysql = require('./../database/mysql');
var userprofile = require('./../utils/userprofile');
var security = require('./../utils/security');
var listdir = require('./../fileoperations/listdir');




//function signin(req,res) {
//
//	ejs.renderFile('./views/login/login.ejs',function(err, result) {
//	   // render on success
//	   if (!err) {
//	            res.end(result);
//	   }
//	   // render or error
//	   else {
//	            res.end('An error occurred');
//	            console.log(err);
//	   }   
//   });
//	
//	// res.render('signin');
//}

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
	var getUser="select homedirectory as homedirectory from users where username='"+req.param("username")+"' and password='" + security.encrypt(req.param("password")) +"'";
	console.log("Query is:"+getUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("valid Login");
				
				listdir.DirectoryList(results[0].homedirectory,function(err,filelist){
					res.status(201).json({
						status:'201',
						message : "Valid Login.",
						filelist:filelist
					});
				})
			}
			else {    
				res.status(401).json({
					status:'401',
					message : "Invalid Login."
				});
			}
		}  
	},getUser);
}



//
//function getAllUsers(req,res)
//{
//	var getAllUsers = "select * from users";
//	console.log("Query is:"+getAllUsers);
//	
//	mysql.fetchData(function(err,results){
//		if(err){
//			throw err;
//		}
//		else 
//		{
//			if(results.length > 0){
//				
//				var rows = results;
//				var jsonString = JSON.stringify(results);
//				var jsonParse = JSON.parse(jsonString);
//				
////				console.log("Results Type: "+(typeof results));
////				console.log("Result Element Type:"+(typeof rows[0].emailid));
////				console.log("Results Stringify Type:"+(typeof jsonString));
////				console.log("Results Parse Type:"+(typeof jsString));
//				
//				console.log("Results: "+(results));
////				console.log("Result Element:"+(rows[0].emailid));
////				console.log("Results Stringify:"+(jsonString));
////				console.log("Results Parse:"+(jsonParse));
//				
//				ejs.renderFile('./views/successLogin.ejs',{data:jsonParse},function(err, result) {
//			        // render on success
//			        if (!err) {
//			            res.end(result);
//			        }
//			        // render or error
//			        else {
//			            res.end('An error occurred');
//			            console.log(err);
//			        }
//			    });
//			}
//			else {    
//				
//				console.log("No users found in database");
//				ejs.renderFile('./views/failLogin.ejs',function(err, result) {
//			        // render on success
//			        if (!err) {
//			            res.end(result);
//			        }
//			        // render or error
//			        else {
//			            res.end('An error occurred');
//			            console.log(err);
//			        }
//			    });
//			}
//		}  
//	},getAllUsers);
//}

exports.signin=signin;
//exports.afterSignIn=afterSignIn;
//exports.getAllUsers=getAllUsers;
