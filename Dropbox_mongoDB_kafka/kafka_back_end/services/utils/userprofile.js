

var mongo = require('./../database/mongoDB');

//gender constants
var MALE = 1;
var FEMALE = 2;
var OTHER = 0;
//End


var dirlog =  require('./../fileoperations/directoriesLogging');

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


var updateUserProfileDataReq = function(req,res){
	var dataJSON = {'userid':req.session.user.userid, 'work': req.body.work,'sports' : req.body.sports,'mobile':req.body.mobile,'education':req.body.education,'shows':req.body.show,'music':req.body.music};
        updateUserProfileData(dataJSON,function(err,results){
            if(err){
                console.log(err);
            }else{
                res.status(201).json({status:'201'});
            }
        });
};
/*
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
};*/

var updateUserProfileData = function(dataJson,callback){
    var query = {homedir :dataJson.userid};
    var data ={$set:{profile:{work:dataJson.work,sports:dataJson.sports,mobile:dataJson.mobile,education:dataJson.education,music:dataJson.music,shows:dataJson.shows}}};
    mongo.update("user",query,data,function(err,results){
        if(err){
            console.log(err);
            callback(err,{status:401});
        }else{

            callback(err,{status:201});
        }
    });
};

/*
var getUserProfileDataReq = function(data,callback){
    getUserProfileData(data.userid,function(err,results){
			if(err){
				callback(err,[]);
			}else{
                callback(false,results);
			}

	});
};*/

var processUserData = function(data,callback){
    if(data.type == 'get'){
        getUserProfileData(data.userid,callback);
    }else if(data.type == 'getLogs'){
        dirlog.getAllFileOperationsForUser(data.userid,callback);
    }else{
        updateUserProfileData(data,callback);
    }

}

var getUserProfileData = function(userid,callback){

    var query = {homedir:userid};
    //console.log("userid : "+userid);
    mongo.findOneDoc("user",query,function(err,results){
        if(err){
            console.log(err);
            callback(err,{status:401});
        }else{
           // console.log(results);
            var result = results.profile;

            callback(err,{data:result,status:201});
        }
    })
};


var checkValidUserEmails = function(emails,callback){
    emails = emails.split(',');

    var query ={};
    if(emails.length==1){
        query = {emailid:emails[0]};
    }else{
        var length = emails.length;
        query = [];
        while(length>0){
            query.push({email:emails[--length]})
        }
        console.log("query : "+query);
        query = {$and:query};
    }
    console.log("query : "+JSON.stringify(query));
    mongo.findDoc("user",query,function(err,results){
        if(err){
            console.log(err);
        }else{
            console.log(JSON.stringify(results));
            callback(err,results);
        }
    })
};

var getUserIDFromEmailAddress = function(email,callback){

    var query = {email:email};

    mongo.findOneDoc("users",query,function(err,results){
        if(err){
            console.log(err);
        }else{
            callback(err,results);
        }
    })
};


exports.gtDateStringFromObject=gtDateStringFromObject;
exports.getGender=getGender;
exports.updateUserProfileData = updateUserProfileData;
exports.getUserProfileData = getUserProfileData;
/*exports.setUserProfileData = setUserProfileData;*/
exports.getUserIDFromEmailAddress = getUserIDFromEmailAddress;
exports.checkValidUserEmails = checkValidUserEmails;
exports.processUserData = processUserData;

