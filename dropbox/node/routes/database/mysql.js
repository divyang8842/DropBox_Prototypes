var ejs= require('ejs');
var mysql = require('mysql');

var getConnection=function(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : 'root',
	    database : 'cmpe273',
	    port	 : 3306
	});
	return connection;
};


var fetchData = function (callback,sqlQuery){
	
	//console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			//console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	//console.log("\nConnection closed..");
	connection.end();
};	

var setData = function (callback,sqlQuery){
	
	var connection=getConnection();
	
	connection.query(sqlQuery, function(err, result) {
	try{
		if(err){
			console.log("ERROR: " + err.message);
		}
			callback(err, result);
		
	}finally{
		connection.end();
	}
	});
	
};


exports.fetchData=fetchData;
exports.setData=setData;