var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var util = require('util');
var index = require('./routes/index');
var sign = require('./routes/sign');
var info = require('./routes/info');

var ejs = require('ejs');
var app = express();
global.userOnline = {};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use( logger('dev') );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( cookieParser() );
app.use( session({
    resave: true, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'PicShare'
}) );
app.use( express.static(path.join(__dirname, 'public')) );

app.use( function (req, res, next) {
    if( !req.session.logged_in ){
        if( req.url==='/signIn' || req.url==='/signUp' ){
            next();
        }
        else {
            res.redirect('/signIn');
        }
    }
    else if( req.session.user ){
        next();
    }
});
app.use( '/', index );
app.use( '/', sign );
app.use( '/', info );
app.use( '/logout', function (req, res) {
    delete userOnline[req.session.user];
    req.session.logged_in = false;
    req.session.user = null;
    res.redirect('/signIn');
});

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
