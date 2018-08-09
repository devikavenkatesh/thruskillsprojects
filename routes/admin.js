var Project = require('../models/projectModel');

var express = require('express');
var data = require('../mydata.json');
var fs = require('fs');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads');
  },
  filename: function (req, file, callback) {
    console.log(JSON.stringify(file));
    callback(null, Date.now() + '-' + file.originalname);
  }
});
var upload = multer({ storage: storage }).single('userPhoto');

// express router
var router = express.Router();

function getProject(alias, callback){
    //console.log("getProject");
    if(alias){
      Project.find({"alias" : alias }, function(err, projectsData){
        //console.log(err);
        //console.log(projectsData);
        callback(err, projectsData)
      });
    }else{

         Project.find({}, function(err, projectsData){
           //console.log(err);
           //console.log(projectsData);
           callback(err, projectsData)
         });
    }
}
function getBlog(alias){
  if(alias){
      var index = parseInt(data.blogIndex[alias]);
      return data.myBlog[index];
  }else{
      return data.myBlog;
  }
}
router.get('/', function (req, res, next) {
  res.render('admin/dashboard', { 
    layout: 'layout-admin', 
    title: 'Admin Dashboard',
    navDashboard: true
  });
});

router.get('/projects', function (req, res, next) {
  function listProjects(error, data){
    res.render('admin/projects', { 
      layout: 'layout-admin', 
      title: 'Projects Admin',
      navProjects: true,
      projects:   data
    });
  }
  getProject(null, listProjects);
});


router.get('/projects/create', function (req, res, next) {
  res.render('admin/project-create', { 
    layout: 'layout-admin', 
    title: 'Projects Admin',
    navProjects: true
  });
});

router.post('/projects/create', function (req, res, next) {
  var projectModel = new Project();
  projectModel.name = req.body.name;
  projectModel.alias = req.body.alias;
  projectModel.githubUrl = req.body.githubUrl;  
  projectModel.image = "/projects/number-guessing-game/images/number-guessing-game.png";
  projectModel.tags = req.body.tags;
  projectModel.description = req.body.description;
  projectModel.createAt = new Date();
  projectModel.save(function(err, savedProject){
    console.log(JSON.stringify(savedProject));
    if(err) 
      res.send(err);    
    res.redirect('/admin/projects');
  });
});

router.get('/media', function (req, res) {
  res.render('admin/upload', { 
    layout: 'layout-admin', 
    title: 'Image Upload',
    navProjects: true
  });
});

router.post('/media', function (req, res) {
  upload(req, res, function (err) {
    console.log(err);

    if (err) {
      return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
  });
});

router.get('/projects/:projectAlias', function (req, res, next) {
    function projectDetails(error, data){
      res.render('admin/project-detail', { 
        layout: 'layout-admin', 
        title: data[0].name,
        navProjects: true,
        project: data[0]
      });
    }
    getProject(req.params.projectAlias, projectDetails);
  });

router.get('/blog', function (req, res, next) {
  res.render('admin/blog', { 
    layout: 'layout-admin', 
    title: 'Blog Admin',
    navBlog: true,
    blogs: getBlog()  
  });
});

module.exports = router;