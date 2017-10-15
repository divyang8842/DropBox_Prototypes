

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
    ,security = require('./routes/utils/security')
    ,files = require('./routes/utils/files')
    ,star =  require('./routes/user/staring')
    ,userprofile = require('./routes/utils/userprofile')
    , session = require('client-sessions');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var expressSessions = require("express-session");


var app = express();


 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Enable CORS


var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(session({
    cookieName: 'session',
    secret: 'cmpe273_test_string',
    duration: 30 * 60 * 1000,    //setting the time for active session
    activeDuration: 5 * 60 * 1000,  }));

app.get('/', routes.index);
app.get('/users', user.list);
//app.get('/listdir',listdir.loadDirPage);
//app.post('/listdir',listdir.listdir);

app.get('/signup', signup.signup);
app.post('/afterSignUp', signup.afterSignUp);

app.post('/getDir',security.authenticate, filelist.listdir);
app.get('/getDir',security.authenticate, filelist.listdir);
app.post('/signin', login.signin);

app.post('/uploadFile',security.authenticate,uploadFile);
app.post('/mkdir',security.authenticate,files.mkdir);
app.post('/delDir',security.authenticate,files.delDir);
app.post('/unstar',security.authenticate,star.UnStarDir);
app.post('/star',security.authenticate,star.setStaredDir);
app.post('/logout',security.authenticate,login.signout);
app.post('/getUserLogs',security.authenticate,dirLogs.getUserLoggings);
app.post('/setUserProfile',security.authenticate,userprofile.updateUserProfileDataReq);
app.post('/getUserProfile',security.authenticate,userprofile.getUserProfileDataReq);
app.post('/download',files.download );


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
