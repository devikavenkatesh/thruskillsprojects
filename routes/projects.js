var Project = require('../models/projectModel');

var express = require('express');
var router = express.Router();
var fs = require('fs');

function getProjects(alias, callback){
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
router.get('/', function (req, res, next) {
    // define a callback function
    function listProjects(error, data){
        res.render('projects', { 
            title: 'Projects', 
            navProjects: true, 
            showFooter: true, 
            projects: data
        });
    };
    getProjects(null, listProjects);
});
router.get('/:projectAlias', function (req, res, next) {
    function getProject(error, project){  
        console.log(project);
        res.render('project-detail', { 
            title: project[0].name ,
            navProjects: true, 
            showFooter: true, 
            project:  project[0]
        });
    };
    getProjects(req.params.projectAlias,getProject)
});
router.get('/:projectAlias/demo', function (req, res, next) {
    var project = getProject(req.params.projectAlias);
    res.render('demos/'+ req.params.projectAlias, { 
      layout: 'layout-demo', 
      title: project.name ,
      project: project
    });
});

module.exports = router;