// 1 引入模块
var mongoose = require('mongoose');
var config = require('../config');

// 连接数据库
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, '连接数据库失败'));
db.once('open', function() {
    console.log('数据库连接成功');
})

// 
exports.mongoose = mongoose;