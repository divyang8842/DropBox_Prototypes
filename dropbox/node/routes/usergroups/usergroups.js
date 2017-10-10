var mysql = require('./../database/mysql');

var addUserInGroup = function(groupid,userid,callback){
	var getDirectories ="INSERT INTO user_group_mapping (groupid,userid) VALUES(?,?)";
	var data=[groupid,userid];
	
	mysql.setData(function(err, results) {
		callback(err,results);
	}, getDirectories,data);
};

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



var getAllUserInGroup = function(groupid,callback){
	var getDirectories ="SELECT u.uid AS uid,(u.ulname+','+u.ufname) AS username,ugm.groupid AS groupid FROM user_group_mapping ugm JOIN users u ON u.uid = ugm.userid WHERE groupid=?";
	var data=[groupid];
	mysql.fetchData(function(err, results) {
		callback(err,results);
	}, getDirectories,data);
};

var getAllGroupForUser = function(userid,callback){
	var getDirectories ="SELECT ug.groupname as groupname,ug.createdby as owner,ug.createdon as createdon FROM user_group_mapping ugm JOIN usergroups ug ON ugm.groupid = ug.id  WHERE ugm.userid = ?";
	var data=[userid];
	mysql.fetchData(function(err, results) {
		callback(err,results);
	}, getDirectories,data);
};


var removeUserFromGroup = function(groupid,userid,callback){
	var getDirectories ="UPDATE user_group_mapping SET deleteflag=1 WHERE groupid=? and userid=?";
	var data=[groupid,userid];
	mysql.setData(function(err, results) {
		callback(err,results);
	}, getDirectories,data);
};




exports.createUserGroup = createUserGroup;
exports.addUserInGroup = addUserInGroup;
exports.createUserGroup = createUserGroup;
