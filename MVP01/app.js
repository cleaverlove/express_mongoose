var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var joinUs = require('./routes/joinUs');
var projects = require('./routes/project');
var config = require('./config');

var app = express();

// view engine setup  1 引入模板引擎
app.set('views', path.join(__dirname, 'views'));
app.engine('html',require('ejs-mate'));
app.set('view engine', 'html');
//若使用下面语句，则当渲染每个html文件时，都会layout.html模版
// app.locals._layoutFile = 'layout.html'; 适用于每个文件都需要头尾时

// 2 引入文件上传模块 multer
 var multer = require('multer');
app.use(multer({ dest: 'public' }).array('image'));

// 3 引入所需模块  session
app.use(cookieParser());
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(session({
	name:"MVP01",	// 设置cookie中保存session_id的字段名称
    secret: 'MVP01',	// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30, secure: false }, //过期时间，过期后 cookie 中的 session id 自动删除
    store: new MongoStore({ url:config.database }),
    resave: false,
	saveUninitialized: true
}));

// 4 引入一次session的模块
var flash = require('connect-flash');
    app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/joinUs', joinUs);
app.use('/projects', projects);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
