var express = require('express');
var router = express.Router();

var fs = require('fs');

// var mongoose = require('../libs/mongoose.js').mongoose;
// var Project = mongoose.model('Project', {person: String, project: String, picture: String, modify: String, status: String});
var Project = require('../libs/User.js').Project;
var User = require('../libs/User.js').User;

//
//查看项目页面
router.get('/', function(req, res) {
	Project.find(function(err, data) {
		if (err) {
			res.end('查询失败');
		} else {
			res.render('project/index', {user: req.session.loginer, projects: data ,success: req.flash('success').toString() });
		}
	})
})
//查看页面
router.get('/look', function(req, res) {
	res.render('project/look');
})

//项目管理
router.get('/manage', function(req, res) {
	Project.find({person: req.session.loginer.username}, function(err, data) {
		if (err) {
			console.log('查询失败',err);
		} else {
			if (data.length !==  0) {
				req.flash('success', '查找成功');
				// res.render('project/manage');
			} else {
				req.flash('error', '没有与你有关的项目');
			}
			res.render('project/manage', {user: req.session.loginer, project: data, success: req.flash('success').toString(), error: req.flash('error').toString() });
		}
	})
})

//项目添加
router.get('/insert', function(req, res) {
	var now = new Date();
	var updateTime = (now.getFullYear()) + '-' + (now.getMonth()) + '-' + (now.getDate()) + ' ' + (now.getHours()) + ':' + (now.getMinutes()) + ':' + (now.getSeconds());
	res.render('project/insert', {person: req.session.loginer.username, user: req.session.loginer, modfiies: updateTime, success: req.flash('success').toString(), error: req.flash('error').toString() });
}) 
//项目添加提交
router.post('/insert', function(req, res) {
	Project.create(req.body, function(err, result) {
		if (err) {
			req.flash('error', '添加失败');
		} else {
			req.flash('success', '添加成功');
			res.redirect('/projects/manage');
		}
	})
})

//添加图片
router.get('/addImg/:_id', function(req, res) {
	res.render('project/addImg', {_id: req.params._id});
})

//添加图片的提交
router.post('/addImg', function(req, res) {
	var file = req.files[0];

	var oldPath = 'public/' + file.filename;
	var reader = fs.createReadStream(oldPath);
	//新文件路径
	var newPath = 'public/upload/' + file.filename + '.jpg';
	var writer = fs.createWriteStream(newPath);
	//通过管道Pipe将读取流写入到写入流中
	reader.pipe(writer);
	//删除原文件
	fs.unlink(oldPath, function(err) {
		if (err) {
			console.log('删除失败',err);
		} else {
			console.log('删除成功');
		}
	})
	var originalname = file.originalname;
	Project.findByIdAndUpdate(req.body._id, {$set:{picture: '/upload/' + file.filename + '.jpg'}}, function(err,result) {
		if (err) {
			res.end('修改失败');
		} else {
			console.log('修改成功');
		}
		res.redirect('/projects');
	})
})
//修改
router.get('/update/:_id', function(req, res) {
	Project.findOne({_id: req.params._id}, function(err, data) {
		if (err) {
			res.end('查找失败');
		} else {
			if (data) {
				var now = new Date();
				var updateTime = (now.getFullYear()) + '-' + (now.getMonth()) + '-' + (now.getDate()) + ' ' + (now.getHours()) + ':' + (now.getMinutes()) + ':' + (now.getSeconds());
				res.render('project/update', {_id: req.params._id, user: req.session.loginer, projects: data,modfiies: updateTime });
			} else {
				res.end('不存在，无法修改');
			}
		}
	})
	
})
//修改后提交
router.post('/update', function(req, res) {
	Project.findByIdAndUpdate(req.body._id, {$set: req.body}, function(err, result) {
		if (err) {
			res.end('修改失败');
		}  else {
			req.flash('success', '修改成功');
			res.redirect('/projects');
		}
	})
})
//删除按钮
router.get('/remove/:_id', function(req, res) {
	Project.remove({_id: req.params._id}, function(err, result) {
		if (err) {
			res.end('删除失败');
		} else {
			req.flash('success', '删除成功');
			res.redirect('/projects');
		}
		
	})
})
// 项目页转到项目的注册
router.get('/reg', function(req, res) {
	res.render('project/register', {user: req.session.loginer, success: req.flash('success').toString() })
})

//注册提交
router.post('/reg', function(req, res) {
	// 判断两次密码一样
	req.body.password = require('../libs/password.js').setPassword(req.body.password);
	req.body.rePassword = require('../libs/password.js').setPassword(req.body.rePassword);
	User.create(req.body, function(err, result) {
		if (err) {
			req.falsh('error', '注册失败');
			//跳转到 jump页面
			res.redirect('/projects');
		} else {
			req.session.loginer = result;
			req.flash('success', '登录成功');
			//跳转到 jump 页面
			res.redirect('/projects'); 
		}
	})
})
//
//登录页面
router.get('/login', function(req, res) {
	res.render('project/login', {user: req.session.loginer, success: req.flash('success').toString() });
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
				res.redirect('/projects');
			} else {
				req.flash('error', '密码或账号错误');
				flag = false;
				res.redirect('/projects');
			}
		}
	})
})
// 退出1 
router.get('/logout1', function(req, res) {
	req.session.loginer = null;
	req.flash('success', '退出成功');
	res.redirect('/projects');
})
module.exports = router;
