var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
    name: {type: String},
    alias: {type: String},
    image: {type: String},
    description: {type: String},
    githubUrl: {type: String},
    tags : {type: Array},
    imageSliders : {type: Array},
    relatedProjects : {type: Array},
    createAt: {type: Date},
    updatedAt: {type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);