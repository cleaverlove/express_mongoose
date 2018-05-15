// 1 引入模块
var mongoose = require('mongoose');

// 连接数据库
mongoose.connect('mongodb://localhost/MVP01');

// 
exports.mongoose = mongoose;