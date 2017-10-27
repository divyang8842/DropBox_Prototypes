
var mongo = require('./../database/mongoDB');
var utils = require('./../utils/userprofile');
var email = require('./../utils/email');
var dirlog = require('./../fileoperations/directoriesLogging');
var listdir = require('./../fileoperations/listdir');
var fileUtils = require('./../utils/files');


var GROUP = 1;
var USER = 0;
var link = 2;

var validateEmails = function(req,res){
var emailAddress = req.body.emails;
var emails = emailAddress.split(',');
console.log(emailAddress);
    utils.checkValidUserEmails(emailAddress,function(err,results){
		if(results.length!= emails.length){
            res.status(201).json({status:'201',linkShare:'true'});
		}else{
            res.status(201).json({status:'201',linkShare:'false'});
		}
	});

}

var shareFile = function(req,res){
	var fileToShare = req.body.fileToShare;
    var emailAddress = req.body.emails;
    var emails = emailAddress.split(',');

    dirlog.getDirectoryId(fileToShare,function (err,results1) {
        var dirId =  results1.id;
	var type = link;
	utils.checkValidUserEmails(emailAddress,function(err,results){
	    console.log("results : "+JSON.stringify(results));
            if(results.length!= emails.length){
				setPermission({'path':fileToShare,'dirid':dirId,'type':link,'pid':'-1'},function(){
                    res.status(201).json({status:'201',linkShare:'true'});
				});
            }else{
            	type= USER;
                var length = results.length;
                    while(length-->0){
                        setPermission({'path':fileToShare,'dirid':dirId,'type':USER,'pid':results[length].homedir},function(){
                        });
                    }
                res.status(201).json({status:'201',linkShare:'false'});
            }
            email.setMailOptions(emailAddress,setMessage(dirId,type));
            email.sendEmail();
        });

    });


}
var setMessage = function(dirid,type){
		var data = "A File is shared with you by a Dropbox User.";
		if(type == link){
            data += "\n You can Download it from below link.";
		}else{

            data += "\n You can view it after login.";

        }
        return data;
}

var setPermission = function(dataJson,callback) {

    var data =  {"path":dataJson.path,"directoryid":dataJson.dirid,"permissiontype":dataJson.type,"permit_id":dataJson.pid,"deleteflag":0};
    mongo.insertDoc("directory_permission",data,function(err, results){
        if (err) {
            //throw err;
            callback(err,results);
        } else {
            callback(err,results);
        }
    });
};




var getAllPermittedDirectories = function(userid,callback){
    var query = [{permit_id:userid},{deleteflag:0}];
    query = {$and:query};

    mongo.findDoc("directory_permission",query,function(err1,data){
        query = [];
        if(data){
            if(!(data instanceof Array)){
                var data1 = [];
                data1.push(data);
                data =  data1;
            }
            var length = data.length;
            while(length>0){
                var permission =  data[--length];
                query.push({relative_path:permission.path});
            }
            query =  {$and:query};
            mongo.findDoc("directory",query,function(err,directories){

                if(!err){
                    var returnData = [];
                    var length = directories.length;

                    while(length-->0){
                        var filedata ={};
                        filedata.name = directories[length].name;
                        filedata.relative_path = directories[length].path;
                        filedata.fullPath =fileUtils.GLOBAL_FILE_PATH +"/"+filedata.path;
                        filedata.isFile = (directories[length].isFile);
                        returnData.push(filedata);
                    }
                    console.log("returnData : "+returnData)
                    callback(false,returnData);
                }else{
                    callback(err,directories);
                }
            });

        }else{
            callback(false,[]);
        }
    });
};

exports.setPermission = setPermission;
exports.validateEmails = validateEmails;
exports.shareFile = shareFile;
exports.getAllPermittedDirectories = getAllPermittedDirectories;