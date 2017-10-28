var mongo = require('./../database/mongoDB');
var security = require('./../utils/security');
var fileUtils = require('./../utils/files');
var dirlog = require('./../fileoperations/directoriesLogging');
var userprofile = require('./../utils/userprofile');
var afterSignUp = function(data,callback){
if(false){
    callback(null,{"status":401});
}else{

    console.log("data is :"+JSON.stringify(data));
    var data = {
        "ufname":data.firstname,
        "ulname":data.lastname,
        "emailid":data.email,
        "username":data.email,
        "password":security.encrypt(data.password),
        "homedir":"",
        "profile":{
            work:'',sports:'',mobile:'',education:'',music:'',shows:''
        }};
    mongo.insertDoc("user",data,function(err,result){
        if(result){
            var searchId =  result["ops"][0]["_id"];
            var path = result["ops"][0]["_id"]+'';
            data = {$set: {homedir:path,userid:path}};

                mongo.update("user",{_id: searchId},data,function(err,data){
                    if(!err){
                        dirlog.createDirectoryEntry(path,path,0,1,path,"",function(err,data1){

                            callback(null,{
                                status:'201',
                                message : "Signup Successfull."
                            });

                        })
                    }else{
                        console.log(err);
                        callback(null,{
                            status:'401',
                            message : "Error occured while Signup."
                        });

                    }
                });

        }else{
            callback(null,{
                status:'401',
                message : "Error occured while Signup."
            });
        }
    });
}



 };
 exports.afterSignUp = afterSignUp; 