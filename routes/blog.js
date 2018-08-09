var Blog = require('../models/blogModel');

var express = require('express');
var router = express.Router();
var fs = require('fs');

function getBlogs(callback){
    Blog.find({ }, function(err, blogData){
        console.log(err);
        //console.log(blogData);
        callback(err, blogData)
      });
}

function getBlogByAlias(alias, callback){
    Blog.find({'alias': alias}, function(err, blogData) {
        callback(err, blogData[0]);
    });
}

function getBlogCategories(callback, blogData){
    Blog.distinct("tag.name", function(err, blogCategories) {
        callback(err, blogData, blogCategories);
    });
}

router.get('/', function (req, res, next) {
    // define a callback function
    function listBlogs(error, data){
        function listBlogCategories(error, blogsData, blogCategoriesData)
        {
            //console.log("categories=" + blogCategoriesData);
            res.render('blog', { 
                title: 'Blog', 
                navBlog: true, 
                showFooter: true, 
                extraCss: ['/css/blog.css'],
                categories: blogCategoriesData, //data.blogCategories,
                featuredBlog: blogsData[blogsData.length -1 ], //getBlog()[random] ,
                blog: blogsData 
            });
        }
        getBlogCategories(listBlogCategories, data);
    };
    getBlogs(listBlogs);
});

router.get('/:blogAlias', function (req, res, next) {
    function getBlog(error, blog){  
        //console.log(blog);        
        function listBlogCategories(error, blogsData, blogCategoriesData)
        {
            res.render('blog-detail', { 
            title: blog.name ,
            navBlog: true, 
            showFooter: true, 
            extraCss: ['/css/blog.css'],
            blog:  blog,
            categories: blogCategoriesData
            });
        }
        getBlogCategories(listBlogCategories, blog);
           
    };
    getBlogByAlias(req.params.blogAlias, getBlog);
});
/*
// get the seed data
//var data = require('../seed-data');
var MongoClient = require('mongodb').MongoClient;
// Connection URL
var url = 'mongodb://localhost:27017';
var db;
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  console.log("Connected successfully to MongoDB Server...");
  db = client.db('portfolio');
});

// this function will go to the database and fetch the documents
// once it has got the data, it will make a call to the callback function
function getBlogs(callback){
    var collection = db.collection('blogs');
    collection.find({}).toArray(function(err, docs) {
        callback(null, docs);
    });
}

function getBlogByAlias(alias, callback){
    var collection = db.collection('blogs');
    collection.find({'alias': alias}).toArray(function(err, docs) {
        callback(null, docs[0]);
    });
}

function GetBlogCategories(callback, blogData){
    var collection = db.collection('blogCategories');
    collection.find({}).toArray(function(err, docs) {
        callback(null, blogData, docs );
    });
}

router.get('/', function (req, res, next) {
    // define a callback function
    function listBlogs(error, data){
        function listBlogCategories(error, blogsData, blogCategoriesData)
        {
            console.log(blogCategoriesData);
            res.render('blog', { 
                title: 'Blog', 
                navBlog: true, 
                showFooter: true, 
                extraCss: ['/css/blog.css'],
                categories: blogCategoriesData, //data.blogCategories,
                featuredBlog: blogsData[blogsData.length -1 ], //getBlog()[random] ,
                blog: blogsData 
            });
        }
        GetBlogCategories(listBlogCategories, data);
    };
    getBlogs(listBlogs);
});

router.get('/:blogAlias', function (req, res, next) {
    function getBlog(error, blog){  
        //console.log(blog);
        res.render('blog-detail', { 
          title: blog.name ,
          navBlog: true, 
          showFooter: true, 
          extraCss: ['/css/blog.css'],
          blog:  blog,
          categories: null// data.blogCategories
        });     
    };
    getBlogByAlias(req.params.blogAlias, getBlog);
});
*/

module.exports = router;