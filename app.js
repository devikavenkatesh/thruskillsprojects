var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var index = require('./routes/index');
var projects = require('./routes/projects');
var blog = require('./routes/blog');
//var contact = require('./routes/contact');
var admin = require('./routes/admin');
var app = express();
var auth = require('./middleware/auth');
var session = require('express-session');
var mongoose = require('mongoose');
console.log("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/portfolio1",function(e){
  console.log('You are now connected to mongodb...');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'top secret',
	saveUninitialized: false,
	resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 1000 }
}));

app.use(auth.authenticated);

app.use('/', index);
app.use('/projects', projects);
app.use('/blog', blog);
app.use('/admin', admin);
//app.use('/contact', contact);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var page = req.path;
  res.render('404',{ title: '404', showFooter: true, path: page });
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