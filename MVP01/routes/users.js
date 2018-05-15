var express = require('express');
var router = express.Router();

// var mongoose = require('../libs/mongoose.js').mongoose;
// var User = mongoose.model('User', {username: String, password: String, rePassword: String});

var User = require('../libs/User.js').User;

var flag = '';
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

//登录页面
router.get('/login', function(req, res) {
	res.render('user/login', {user: req.session.loginer, success: req.flash('success').toString() });
})

//登录的提交
router.post('/login', function(req, res) {
	req.body.password = require('../libs/password.js').setPassword(req.body.password);
	User.findOne(req.body, function(err, data) {
		if (err) {
			res.end('查找失败');
		} else {
			if (data) {
				req.session.loginer = data;
				req.flash('success', '登录成功');
				res.redirect('/users/jump');
			} else {
				req.flash('error', '密码或账号错误');
				flag = false;
				res.redirect('/users/jump');
			}
		}
	})
})

//注册页面  //复选框没有选择，不允许提交表单 
router.get('/reg', function(req, res) {
	res.render('user/register', {user: req.session.loginer, success: req.flash('success').toString() });
})

//注册页面提交检验    需要来一个页面显示是否成功，然后跳转。。。
router.post('/reg', function(req, res) {
	// 判断两次密码一样
	req.body.password = require('../libs/password.js').setPassword(req.body.password);
	req.body.rePassword = require('../libs/password.js').setPassword(req.body.rePassword);
	User.create(req.body, function(err, result) {
		flag = err;
		if (err) {
			req.falsh('error', '注册失败');
			//跳转到 jump页面
			falg = true;
			res.redirect('/users/jump');
		} else {
			req.session.loginer = result;
			req.flash('success', '注册成功');
			//跳转到 jump 页面
			res.redirect('/users/jump'); 
		}
	})
})

// 跳转页面，3秒后跳到响应的页面
router.get('/jump', function(req, res) {
	// var count = 2;
		res.render('user/jump' , {user: req.session.loginer, success: req.flash('success').toString(), error: req.flash('error').toString(), flags: flag});
	// var times = setInterval(function() {
	// 	if (count > 0) {
	// 		res.redirect('user/jump/' + count , {user: req.session.loginer, success: req.flash('success').toString(), error: req.flash('error').toString(),seconds : count });
	// 		count--;
	// 	} else if (!flag) {
	// 		res.redirect('/');
	// 	} else {
	// 		res.redirect('users/reg');
	// 	}
	// 	console.log(count);
	// },2000);
})
module.exports = router;
