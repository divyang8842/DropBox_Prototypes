var mysql = require('./../database/mysql');

var createUserGroup = function(groupname,userid,memberjson,callback) {
	var setPermit = "INSERT INTO usergroups (groupname,createdby) VALUES(?,?)";
	var data=[groupname,userid];
	mysql.setData(function(err, results1) {
		if(err){
			callback(err,results1);
		}else{
			var length = memberjson.length;
			while(length>0){
				var groupid = results1.insertId;
				addUserInGroup(groupid,memberjson[length-1].uid,function(err,result){
					if(err){
						callback(err,result);
					}else{
						length--;
						if(length===0){
							callback(err,results1);
						}
					}
				});
				
			}
		}
	}, setPermit,data);
};


var addUserInGroup = function(groupid,userid,callback){
	var getDirectories ="INSERT INTO user_group_mapping (groupid,userid) VALUES(?,?)";
	var data=[groupid,userid];
	
	mysql.setData(function(err, results) {
		callback(err,results);
	}, getDirectories,data);
};


var getAllUserInGroup = function(groupid,userid,callback){
	var getDirectories ="INSERT INTO user_group_mapping (groupid,userid) VALUES(?,?)";
	var data=[groupid,userid];
	
	mysql.setData(function(err, results) {
		callback(err,results);
	}, getDirectories,data);
};



var removeUserFromGroup = function(groupid,userid,callback){
	var getDirectories ="INSERT INTO user_group_mapping (groupid,userid) VALUES(?,?)";
	var data=[groupid,userid];
	
	mysql.setData(function(err, results) {
		callback(err,results);
	}, getDirectories,data);
};


exports.createUserGroup = createUserGroup;
exports.addUserInGroup = addUserInGroup;
exports.createUserGroup = createUserGroup;
