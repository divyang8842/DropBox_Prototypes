var connection =  new require('./kafka/Connection');
var login = require('./services/login/login');
var signup = require('./services/login/Signup');
var directoriesLogging = require('./services/fileoperations/directoriesLogging');
var filelist = require('./services/fileoperations/listdir');
var starDir =  require('./services/user/staring');
var files = require('./services/utils/files');
var userprofile = require('./services/utils/userprofile');
var permissions = require('./services/fileoperations/permissions');
var usergroup = require('./services/user/usergroups');

var fs = require('fs');

var login_topic_name = 'login_topic';
var consumer_login = connection.getConsumer(login_topic_name);

var signup_topic_name = 'signup_topic';
var consumer_signup = connection.getConsumer(signup_topic_name);

var getdir_topic_name = 'getdir_topic';
var consumer_getdir = connection.getConsumer(getdir_topic_name);


var upload_dir_topic_name = 'upload_file';
var consumer_uploadfile = connection.getConsumer(upload_dir_topic_name);

var download_file_topic_name = 'download_file';
var consumer_download_file = connection.getConsumer(download_file_topic_name);

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

var usergroup_topic_name  = 'usergroup_topic';
var consumer_usergroup = connection.getConsumer(usergroup_topic_name);


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
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    base64_decode(data.data.bufferdata,'./public/uploads/'+data.data.parentpath+'/'+data.data.filename,function(){

        directoriesLogging.getDirectoryId(data.data.parentpath, function(err,res){

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
});


// function to create file from base64 encoded string
function base64_decode(base64str, file,callback) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
    callback(true)
}



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

    files.delDir(data.data, function(err,res){
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


    userprofile.processUserData
    (data.data, function(err,res){
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

consumer_download_file.on('message',function (message) {
    console.log('message received in get share file');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    files.download(data.data, function(err,res){
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
})


consumer_usergroup.on('message',function (message) {
    console.log('message received in usergroup');
    console.log(JSON.stringify(message.value));
    const data = JSON.parse(message.value);

    if(data.data.type == 'get') {
        usergroup.getAllUserGroups(function (err, res) {
            //console.log("response data : ", res)
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                //console.log(data);
            });
            return;
        });
    }else{

        usergroup.createUserGroup(data.data.group.groupName,data.data.userid,data.data.group.groupMembers,data.data.group.id,function(err,res){
           // console.log("response data : ", res)
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];
            producer.send(payloads, function (err, data) {
                //console.log(data);
            });
            return;
        })
    }
})

