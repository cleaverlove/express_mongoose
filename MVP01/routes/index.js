var express = require('express');
var router = express.Router();


// var mongoose = require('../libs/mongoose.js').mongoose;
// var User = mongoose.model('User', {username: String, password: String, rePassword: String});


/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', {user: req.session.loginer, success: req.flash('success').toString() });
});

// 退出页面
router.get('/logout', function(req, res) {
	//清除全部的session
	req.session.loginer = null;
	req.flash('success', '退出成功');
	res.redirect('/');
})

//
router.get('/userInfo/:username', function(req, res) {
	res.render('userInfo', {user: req.session.loginer});
})

module.exports = router;
