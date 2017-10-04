

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , listdir = require('./routes/fileoperations/listdir')
  , login = require('./routes/login/loginJS')
  ,	signup = require('./routes/login/Signup');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');


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
app.use(cors());


app.get('/', routes.index);
app.get('/users', user.list);
//app.get('/listdir',listdir.loadDirPage);
//app.post('/listdir',listdir.listdir);

app.get('/signup', signup.signup);
app.post('/afterSignUp', signup.afterSignUp);

//app.get('/signin', login.signin);
app.post('/signin', login.signin);
//
//app.get('/getAllUsers', login.getAllUsers);

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
