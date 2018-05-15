
var mongoose = require('./mongoose.js').mongoose;
var User = mongoose.model('User', {username: String, password: String, rePassword: String});
var Project = mongoose.model('Project', {person: String, project: String, picture: String, modify: String, status: String});
exports.User = User;
exports.Project = Project;