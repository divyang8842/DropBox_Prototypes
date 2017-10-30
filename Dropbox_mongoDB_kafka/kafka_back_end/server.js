var connection =  new require('./kafka/Connection');
var login = require('./services/login/login');
var signup = require('./services/login/Signup');
var directoriesLogging = require('./services/fileoperations/directoriesLogging');
var filelist = require('./services/fileoperations/listdir');
var starDir =  require('./services/user/staring');
var files = require('./services/utils/files');
var userprofile = require('./services/utils/userprofile');
var permissions = require('./services/fileoperations/permissions');

var login_topic_name = 'login_topic';
var consumer_login = connection.getConsumer(login_topic_name);

var signup_topic_name = 'signup_topic';
var consumer_signup = connection.getConsumer(signup_topic_name);

var getdir_topic_name = 'getdir_topic';
var consumer_getdir = connection.getConsumer(getdir_topic_name);


var upload_dir_topic_name = 'upload_file';
var consumer_uploadfile = connection.getConsumer(upload_dir_topic_name);

var star_dir_topic_name = 'stardir_topic';
var consumer_stardir = connection.getConsumer(star_dir_topic_name);


var mkdir_topic_name = 'mkdir_topic';
var consumer_mkdir = connection.getConsumer(mkdir_topic_name);


var deldir_topic_name = 'deldir_topic';
var consumer_deldir = connection.getConsumer(deldir_topic_name);

var userprofile_topic_name = 'user_profile_topic';
var consumer_user_profile = connection.getConsumer(userprofile_topic_name);

var sharefile_topic_name = 'sharefile_topic';
var consumer_sharefile = connection.getConsumer(sharefile_topic_name);


var producer = connection.getProducer();


consumer_login.on('message', function (message) {
    console.log('message received in login');
    //console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    login.handle_request(data.data, function(err,res){
        //console.log('after handle'+ JSON.stringify(res) );
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            //console.log(data);
        });
        return;
    });
});


consumer_signup.on('message', function (message) {
    console.log('message received in signup');
   // console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    signup.afterSignUp(data.data, function(err,res){
        //console.log('after handle 234 ',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
           // console.log(data);
        });
        return;
    });
});


consumer_uploadfile.on('message', function (message) {
    console.log('message received in upload file');
   // console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    directoriesLogging.getDirectoryId(data.data.parentpath, function(err,res){
       // console.log("res data : ",res);
        directoriesLogging.createDirectoryEntry(data.data.parentpath+'/'+data.data.filename,data.data.userid,1,res.id,data.data.filename,data.data.parentpath,function(err,response){
            var resData = {};
            if(err){
               resData.status = 401;
           }else{
                resData.status = 201;
            }


            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                //console.log(data);
            });
            return;
        });

    });
});


consumer_getdir.on('message', function (message) {

    var data = JSON.parse(message.value);

    directoriesLogging.getDirectoryId(data.data.root, function(err,res){

        filelist.listdir({root:data.data.root,userid:data.data.userid},function(err,response){
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : response
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                //console.log(data);
            });
            return;
        });

    });
});

consumer_stardir.on('message', function (message) {
    console.log('message received in stardir');
    //console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    starDir.processStaring(data.data, function(err,res){
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                //console.log(data);
            });
            return;
    });
});



consumer_mkdir.on('message', function (message) {
    console.log('message received in stardir');
   // console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    files.mkdir(data.data, function(err,res){
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});


consumer_deldir.on('message', function (message) {
    console.log('message received in deldir');
    //console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    files.deleteDir(data.data.filepath,data.data.userid, function(err,res){
        console.log("response data : ",res)
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            //console.log(data);
        });
        return;
    });
});


consumer_user_profile.on('message', function (message) {
    console.log('message received in get user profile');
    //console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);


    userprofile.processUserData(data.data, function(err,res){
        //console.log("response data : ",res)
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            //console.log(data);
        });
        return;
    });
});



consumer_sharefile.on('message', function (message) {
    console.log('message received in get share file');
    //console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    permissions.processData(data.data, function(err,res){
        //console.log("response data : ",res)
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            //console.log(data);
        });
        return;
    });
});
