var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/dropbox";


var free_pool = [];
var startedConnects = false;
var error = false;

    var createConnection = function(callback){

        MongoClient.connect(url, function(err, _db){
            if (err) {
                throw new Error('Could not connect: '+err);
            }
            callback(err,_db);
        });
    };
    var createpool = function(poolingcount,callback){
        createConnection( function(err, _db){
            startedConnects =  true;
            if (err) {
                throw new Error('Could not connect: '+err);
                callback(err,null);
            }else{
                free_pool.push(_db);
                //console.log("",free_pool.length);
                createConnectionPool(poolingcount,function(err,result){
                   callback(true);
                });
            }
        });
    }

    var createConnectionPool=function(count,callback){
        for(var i=0;i<count-1;i++){
            createConnection( function(err, _db){
                if (err) {
                    throw new Error('Could not connect: '+err);
                    callback(err,null);
                }else{
                    free_pool.push(_db);
                   // console.log("",free_pool.length);
                }
            });
        }
        callback(false,true);
    }

    var getConnection = function(callback){

        if(startedConnects){
            if(error){
                callback(undefined);
            }else{
                while(free_pool.length==0);
                var db = free_pool[0];
                free_pool = free_pool.slice(1,free_pool.length);
                console.log("after getting connection, the count is ",free_pool.length);
                callback(db);
            }

        }else{
            createpool(1000,function(){
                getConnection(callback);
            });

        }
    };

    var closeConnection = function(db){
        free_pool.push(db);
        //console.log("after getting connection back, the count is ",free_pool.length);
    }

exports.getConnection = getConnection;
exports.createpool = createpool;
exports.closeConnection = closeConnection;