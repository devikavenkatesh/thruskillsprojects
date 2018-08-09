var User = require('../models/userModel');
var md5 = require('js-md5');
var express = require('express');

var expressValidator = require('express-validator');
var router = express.Router();
router.use(expressValidator());  //this line to be addded

router.get('/', function (req, res, next) {
  res.render('index', { layout: 'layout-index' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About', showFooter: true, navAbout: true });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact', showFooter: true, navContact: true });
});


function SendMail(data, res)
{ 
    /* 
    var mailer = require("nodemailer");
    // Use Smtp Protocol to send Email
    var smtpTransport = mailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "devikavenk@gmail.com",
            pass: "jajinivas"
        }
    });

    var mail = {
        from: "Devika <devikavenk@gmail.com>",
        to: "devikavoor@ayhoo.com",
        subject: "Send Email Using Node.js",
        text: "Node.js New world for me",
        html: "<b>Node.js New world for me</b>"
    }

    smtpTransport.sendMail(mail, function(error, response){
        smtpTransport.close();
        if(error){
            console.log(error);
            res.send(error);
        }else{
            console.log("Message sent: " + response.message);
            res.render('confirm', { title: 'Contact', showFooter: true, navContact: true, data: data });
        }

      
    });
    */
  
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'devikavenk@gmail.com',
      pass: 'jajinivas'
    }
  });
  
  var mailOptions = {
    from: 'devikavenk@gmail.com',
    to: data.email,
    subject: 'Thank you ' + data.name + ' for visiting my Portfolio',
    text: 'We have received your contact information and we will get back to at the earliest.'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.send(error);
  } else {
      console.log('Email sent: ' + info.response);
      res.render('confirm', { title: 'Contact', showFooter: true, navContact: true, data: data });
    }
  });
}

router.post('/contact', function(req, res, next) {
  // read the values passed from the ui
  var data = req.body;
  //console.log(JSON.stringify(data));
  var Contact = require('../models/contactModel');
  var newContact = new Contact();
  newContact.name = data.name;
  newContact.email = data.email;
  newContact.mobile = data.mobile;
  newContact.description = data.description;
  newContact.createAt = new Date();
  newContact.save(function(err, savedContact){
    console.log(JSON.stringify(savedContact));
    if(err) res.send(err);
    SendMail(data, res);

  }); 
  
});

router.get('/resume', function(req, res, next) {
  res.redirect('/manohar-negi-resume.pdf'); 
});

//router.get('/contact', function(req, res, next) {
//res.redirect('contact', { layout: 'layout' }); 
//});

router.get('/signin', function(req, res, next) {
  res.render('admin/signin', { layout: 'layout-signin' });
});

router.post('/signin', function(req, res, next) {
  var email = req.body.email;
  var password = md5(req.body.password);
  // validate inputs
  req.checkBody('email', 'Email is required').
      notEmpty().withMessage('Email can not be empty').
      isEmail().withMessage('Please enter a valid email');
  req.checkBody('password', 'Password is required').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
        messages.push(error.msg);
    });
    res.render('admin/signin', {layout:'layout-signin', error: messages.length > 0,messages: messages});
  }else{   
    // authenticate the user details
    User.find({'email': email, 'password': password}, function(err, user){

      if (err){
        res.render('admin/signin', { 
          layout: 'layout-signin', 
          error: true, 
          messages:[err.msg]
        });
      }else if (user.length < 1){
        res.render('admin/signin', { 
          layout: 'layout-signin', 
          error: true, 
          messages:["Invalid userid or passsword"]
        });
      }else{
        // you found a valid user
        // set the session
        console.log(JSON.stringify(user));
        req.session.isAuthenticated = true;
        req.session.user = user[0];
        res.locals.user = user[0];
        res.render('admin/dashboard', { 
          layout: 'layout-admin', 
          title: 'Admin Dashboard',
          navDashboard: true
        });
      }
    });
  }

});


router.get('/signup', function(req, res, next) {
  res.render('admin/signup', { layout: 'layout-signin' });
});

router.post('/signup', function(req, res, next) {
  // read the values from the body
  // [ take the password and encrypt it ]
  // use the model and save the data
  var userModel = new User();
  userModel.name = req.body.name;
  userModel.email = req.body.email;
  userModel.password = md5(req.body.password);
  userModel.createAt = new Date();
  userModel.save(function(err, user){
    console.log(JSON.stringify(user));

    if(err) res.send(err);
    res.redirect('/signin');
  });
});


router.get('/signout', function(req, res, next) {
  req.session.isAuthenticated = false;
  delete req.session.user;
  res.redirect('/signin'); 
});
module.exports = router;
