var ejs = require('ejs');
var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit : 20,
	host : 'localhost',
	user : 'root',
	password : 'root',
	database : 'cmpe273',
	port : 3306,
	debug : false
});

var closeConnection = function(connection) {
	connection.release();
};

var fetchData = function(callback, sqlQuery) {

	pool.getConnection(function(err, connection) {
		connection.query(sqlQuery, function(err, rows) {

			if (err) {
				console.log("ERROR: " + err.message);
			} else {
				callback(err, rows);
			}
			connection.release();
		});
	});
};

var setData = function(callback, sqlQuery) {
	
	pool.getConnection(function(err, connection) {
		connection.query(sqlQuery, function(err, rows) {

			try {
				if (err) {
					console.log("ERROR: " + err.message);
				}
				callback(err, rows);

			} finally {
				connection.release();
			}
			
		});
	});

};

exports.fetchData = fetchData;
exports.setData = setData;
