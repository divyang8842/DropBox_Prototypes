var mysql = require('./../database/mysql');



//gender constants
var MALE = 1;
var FEMALE = 2;
var OTHER = 0;
//End


var getUserIdFromEmail = function(userid,callback){


}

var getGender = function(gender){
	gender = parseInt(gender);
	if(gender===MALE){
		return "Male";
	}else if(gender===FEMALE){
		return "Female";
	}else {
		return "Other";
	}
};

var gtDateStringFromObject = function(dateObj,format,separator){
	var date = new Date(dateObj);
	if(!separator){
		separator = "/";
	}
	if(format==="MMDDYYYY"){
		return (date.getMonth()+1)+separator+date.getDate()+separator+date.getFullYear();
	}else if(format==="YYYYMMDD"){
		return date.getFullYear()+separator+date.getMonth()+separator+date.getDate();
	}
	
};

var shareFile = function(emailId){

    console.log(emailId);
};


var updateUserProfileDataReq = function(req,res){
	var dataJSON = {'userid':req.session.userid, 'work': req.body.work,'sports' : req.body.sports,'mobile':req.body.mobile,'education':req.body.education,'shows':req.body.show,'music':req.body.music};
        updateUserProfileData(dataJSON,function(err,results){
            if(results.affectedRows>0){
                res.status(201).json({status:'201'});
            }
        });



};

var setUserProfileData = function(dataJson,callback){

var setData = "INSERT INTO userprofile (uid,work,sports,mobile,education,music,shows) values(?,?,?,?,?,?,?)";
var data =[dataJson.userid,dataJson.work,dataJson.sports,dataJson.mobile,dataJson.education,dataJson.music,dataJson.shows];

    mysql.setData(function(err,results){
    	if(err){
    		console.log(err);
		}else{
            callback(err,results);
		}
	},setData,data);
};

var updateUserProfileData = function(dataJson,callback){

    var setData = "UPDATE userprofile SET work=?,sports=?,mobile=?,education=?,music=?,shows=? WHERE uid=?";
    var data =[dataJson.work,dataJson.sports,dataJson.mobile,dataJson.education,dataJson.music,dataJson.shows,dataJson.userid];

    mysql.setData(function(err,results){
        if(err){
            console.log(err);
        }else{
            callback(err,results);
        }
    },setData,data);
};


var getUserProfileDataReq = function(req,res){
    getUserProfileData(req.session.userid,function(err,results){
			if(err){
				res.status(401).json({staus:'401'});
			}else{
                res.status(201).json({staus:'201',data:results[0]});
			}

	});
};

var getUserProfileData = function(userid,callback){

    var getData = "SELECT * FROM userprofile WHERE uid=?";
    var data =[userid];

    mysql.fetchData(function(err,results){
        if(err){
            console.log(err);
        }else{
            callback(err,results);
        }
    },getData,data);
};

var checkValidUserEmails = function(emails,callback){

    var getData = "SELECT uid FROM users WHERE emailid in (?) AND deleteflag=0";
    var data =[emails];

    mysql.fetchData(function(err,results){
        if(err){
            console.log(err);
        }else{
            callback(err,results);
        }
    },getData,data);
};

var getUserIDFromEmailAddress = function(email,callback){

    var getData = "SELECT uid FROM users WHERE emailid=? AND deleteflag=0";
    var data =[email];

    mysql.fetchData(function(err,results){
        if(err){
            console.log(err);
        }else{
            callback(err,results);
        }
    },getData,data);
};


exports.gtDateStringFromObject=gtDateStringFromObject;
exports.getGender=getGender;
exports.updateUserProfileDataReq = updateUserProfileDataReq;
exports.getUserProfileDataReq = getUserProfileDataReq;
exports.setUserProfileData = setUserProfileData;
exports.getUserIDFromEmailAddress = getUserIDFromEmailAddress;
exports.checkValidUserEmails = checkValidUserEmails;

