var express = require('express');
var router = express.Router();



//
router.get('/', function(req, res) {
	
	res.render('joinUs/index', {user: req.session.loginer, success: req.flash('success').toString() });
})
//查看项目页面
// router.get('/project', function(req, res) {
// 	Project.find(function(err, data) {
// 		if (err) {
// 			res.end('查询失败');
// 		} else {
// 			res.render('joinUs/project', {user: req.session.loginer, projects: data });
// 		}
// 	})
// })

//查看页面
// router.get('/project/look', function(req, res) {
// 	res.render('joinUs/look');
// })

module.exports = router;