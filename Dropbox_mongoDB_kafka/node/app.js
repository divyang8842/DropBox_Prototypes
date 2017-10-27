

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , filelist = require('./routes/fileoperations/listdir')
  , login = require('./routes/login/loginJS')
  ,	signup = require('./routes/login/Signup')
    ,uploadFile=require('./routes/fileoperations/uploadfile')
    ,dirLogs=require('./routes/fileoperations/directoriesLogging')
    ,permission=require('./routes/fileoperations/permissions')
    ,security = require('./routes/utils/security')
    ,files = require('./routes/utils/files')
    ,star =  require('./routes/user/staring')
    ,userprofile = require('./routes/utils/userprofile')
    , session = require('client-sessions')
    ,passportLogin = require('./routes/login/passportLogin');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var cors = require('cors');


var mongoSessionURL = "mongodb://localhost:27017/sessions";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);

var app = express();
require('./routes/login/passportLogin')(passport);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};


app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSessions({
    secret: "CMPE273_passport",
    resave: false,
    //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, //force to save uninitialized session to db.
    //A session is uninitialized when it is new but not modified.
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));
app.use(passport.initialize());


app.get('/users', user.list);


app.post('/afterSignUp', signup.afterSignUp);

app.post('/getDir',security.authenticate, filelist.listdir);
app.get('/getDir',security.authenticate, filelist.listdir);


app.post('/uploadFile',security.authenticate,uploadFile);
app.post('/mkdir',security.authenticate,files.mkdir);
app.post('/delDir',security.authenticate,files.delDir);
app.post('/unstar',security.authenticate,star.UnStarDir);
app.post('/star',security.authenticate,star.setStaredDir);
app.post('/logout',security.authenticate,login.signout);
app.post('/getUserLogs',security.authenticate,dirLogs.getUserLoggings);
app.post('/setUserProfile',security.authenticate,userprofile.updateUserProfileDataReq);
app.post('/getUserProfile',security.authenticate,userprofile.getUserProfileDataReq);
app.post('/validateEmails',security.authenticate,permission.validateEmails);
app.post('/shareFile',security.authenticate,permission.shareFile);

app.post('/download',files.download );



app.post('/login', function(req, res,next) {
    passport.authenticate('login', function(err, user) {
        if(err) {
            res.status(500).send();
        }
        if(user) {

                    req.session.user =  user;
                    console.log(user);
                    return res.status(201).json({username:user.username,userid:user.userid,root:user.root,status:'201'});


        }else{
            res.status(401).json({status:'401'});
        }
    })(req, res,next);
});

app.post('/logout', function(req,res) {
    console.log(req.session.user);
    req.session.destroy();
    console.log('Session Destroyed');
    res.status(200).send();
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(err);

    // render the error page
    res.status(err.status || 500);
    res.json('error');
});

module.exports = app;
