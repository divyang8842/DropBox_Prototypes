var ejs = require("ejs");
var mysql = require('./../database/mysql');
var mongo = require('./../database/mongoDB');
var login = require('./loginJS');
var security = require('./../utils/security');
var fileUtils = require('./../utils/files');
var dirlog = require('./../fileoperations/directoriesLogging');
var userprofile = require('./../utils/userprofile');
var afterSignUp = function(req,res){
     var data = {
		 "ufname":req.body.firstname,
		 "ulname":req.body.lastname,
		 "emailid":req.body.email,
		 "username":req.body.email,
		 "password":security.encrypt(req.body.password),
         "homedir":"",
         "profile":{
             work:'',sports:'',mobile:'',education:'',music:'',shows:''
		 }};
     mongo.insertDoc("user",data,function(err,result){
         if(result){
             var searchId =  result["ops"][0]["_id"];
             var path = result["ops"][0]["_id"]+'';
             data = {$set: {homedir:path,userid:path}};
             fileUtils.createDirectory(path,function(err,path){
                 mongo.update("user",{_id: searchId},data,function(err,data){
                     if(!err){
                         dirlog.createDirectoryEntry(path,path,0,1,path,"",function(err,data1){
                             res.status(201).json({
                                 status:'201',
                                 message : "Signup Successfull."
                             });
                         })
                     }else{
                         console.log(err);
                         res.status(401).json({
                             status:'401',
                             message : "Error occured while Signup."
                         });
                     }
                 });
             });
         }else{
             res.status(401).json({
                 status:'401',
                 message : "Error occured while Signup."
             });
         }
     });
 };
 exports.afterSignUp = afterSignUp; 