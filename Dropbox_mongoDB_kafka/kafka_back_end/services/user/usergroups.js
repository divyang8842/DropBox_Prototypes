var mongo = require('./../database/mongoDB');

/*var addUserInGroup = function(groupid,userid,callback){
	var getDirectories ="INSERT INTO user_group_mapping (groupid,userid) VALUES(?,?)";
	var data=[groupid,userid];
	
	
	mysql.setData(function(err, results) {
		callback(err,results);
	}, getDirectories,data);
};*/
var getAllUserGroups = function(callback){
	mongo.findDoc("usergroup",{},function (err,results) {
	    var data = {status:201, groups : results};
	   // console.log("USer group search data is ",data);
		callback(err,data);
    })

}

var getBulkUserInfo = function(emailids,callback){
    var query  =  [];
    var length =  emailids.length;
    while(length>0){
        query.push({emailid:emailids[--length].email});
    }

    query = {$or : query};
    console.log("query : ",query);
    mongo.findDoc("user",query,callback);
}


var createUserGroup = function(groupname,userid,memberjson,id,callback) {

    //console.log("createUserGroup");
    //console.log("id is ",id);
	getBulkUserInfo(memberjson,function(err,data){
        var data = {
            groupname : groupname,
            createdBy : userid,
            users:data,
            memberjson : memberjson,
            id:''
        }

        mongo.findOneDoc("usergroup",{groupname:groupname},function (err,result) {
            if(result && result.id){
                id = result.id;
            }

           // console.log("id is ",id);

            if(id!= undefined && id.trim()!=''){
                data.id = id;
                mongo.update("usergroup",{id:id},data,function (err,results){
                    callback(err,{status:201});
                });
            }else{
                mongo.insertDoc("usergroup",data,function(err,results){
                    var id =  results["ops"][0]["_id"];
                    data = {$set: {id:(id+'')}};
                    var query = {_id:id};
                    mongo.update("usergroup",query,data,function(err,results){
                        callback(err,{status:201});
                    });
                });
            }
        });




    })



};

var getAllUserInGroup = function(groupid,callback){
	var query = {
		id : groupid
	};
	mongo.findOneDoc("usergroup",query,function(err,results){
		callback(err,results);
	})
};
/*
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
*/

exports.createUserGroup = createUserGroup;
exports.getAllUserInGroup = getAllUserInGroup;
exports.getAllUserGroups = getAllUserGroups;
