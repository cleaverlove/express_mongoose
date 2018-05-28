## express_mongoose
express, mongoose, bootstrap 仿MVP01网站


##dependencies

  * cookie-parser 提供对cookie的支持   注意:cookie-session只适用于“基于cookie的会话”

        ```js
            app.use(require('cookie-parser')('cookie秘钥'))
            //相应对象设置cookie
            res.cookie('monster', 'nom');
            //获取客户端发送的cookie
            req.cookies.momster;
        ```
  * express-session 提供会话ID(存在cookie里)的会话支持,默认存在内存里，这种情况适用于生产环境，并且可以配置为使用数据库存储。必须在之前使用中间件cookie-parser
        既然内存存储会话数据不适用生产环境，可以使用MongoDB来存储会话非常容易

        ```js
            var session = require('express-session');
            var MongoStore = require('connect-mongo')(session);
            app.use(session({
                secret: 'MVP01',	// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
                store: new MongoStore({ url:"mongodb://localhost:27017/MVP01" }),
                resave: false,
                saveUninitialized: true
            }));
        ```
        
        另一种流行又易用的会话持久化方案是用Redis,可参考[nodeclub](https://github.com/cnodejs/nodeclub/blob/master/app.js) 

        注意一下: 对于会话而言，它全都是在请求对象上操作的。(响应对象没有session属性),要删除会话，可以使用delete操作符: delete req.session.colorScheme

  * connect-falsh 一次性消息提示，需要存储在session模块里面，使用一次后删除相应信息，因此要先使用express-session中间件.  
        使用 res.locals.errors = req.flash('error');  在模版引擎里面直接使用变量名errors就可以了，不需要写成locals.errors

