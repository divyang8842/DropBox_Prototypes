var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
require('./routes/passport')(passport);

var routes = require('./routes/index');
var users = require('./routes/users');

var security = require('./routes/utils/security');
var filelist = require('./routes/fileoperations/filelist');
var signup = require('./routes/signup');
var uploadFile=require('./routes/fileoperations/uploadfile');
var star =  require('./routes/star');
var files = require('./routes/fileoperations');
var userprofile = require('./routes/utils/userprofile');
var userGroups = require('./routes/usergroups');

var mongoSessionURL = "mongodb://localhost:27017/sessions";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}
app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

app.use('/', routes);
app.use('/users', users);
app.post('/getDir',security.authenticate, filelist.getFileList);
app.post('/afterSignUp', signup.afterSignUp);
app.post('/uploadFile',security.authenticate,uploadFile);
app.post('/star',security.authenticate,star.stardir);
app.post('/mkdir',security.authenticate,files.mkdir);
app.post('/delDir',security.authenticate,files.delDir);
app.post('/getUserProfile',security.authenticate,userprofile.getUserProfileDataReq);
app.post('/setUserProfile',security.authenticate,userprofile.updateUserProfileDataReq);
app.post('/getUserLogs',security.authenticate,userprofile.getuserlogs);
app.post('/download',security.authenticate,files.download);
app.post('/shareFile',security.authenticate,files.shareFile);
app.post('/validateEmails',security.authenticate,files.validateEmails);
app.post('/unstar',security.authenticate,star.unstardir);

app.post('/getUserGroups',security.authenticate,userGroups.getUserGroups);
app.post('/setUserGroups',security.authenticate,userGroups.setUserGroups);


app.post('/logout', function(req,res) {
    console.log(req.session.user);

    req.session.destroy();
    console.log('Session Destroyed');
    res.status(201).json({status:201});
});

app.post('/login', function(req, res) {
    passport.authenticate('login', function(err, user) {
        if(err) {
            res.status(500).send();
        }
        if(!user) {
            res.status(401).send();
        }else{
            req.session.user = user;
            console.log(req.session.user);
            console.log("session initilized");
            return res.status(201).send({username:user.username,userid:user.userid,root:user.root,status:'201'});
        }

    })(req, res);
});

module.exports = app;
