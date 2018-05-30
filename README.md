## express_mongoose
express, mongoose, bootstrap 仿MVP01网站

##优化
2018/05/30

    使用了[ejs-mate](https://www.npmjs.com/package/ejs-mate)进行优化,共用头部和尾部在首页，注册，登录，加入我们页面

    目前只使用到layout(view), 当前的模板被传递到被给的view中作为`body`替换


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

  * connect-mongo 是session持久化的一个中间件
  
  * connect-falsh 一次性消息提示，需要存储在session模块里面，使用一次后删除相应信息，因此要先使用express-session中间件.  
        使用 res.locals.errors = req.flash('error');  在模版引擎里面直接使用变量名errors就可以了，不需要写成locals.errors



##问题总结

  1. `open()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead, or set the 'useMongoClient' option if using `connect()` or `createConnection()` . See http://mongoosejs.com/docs/4.x/docs/connections.html#use-mongo-client   
    有两种解决方法: 第一种： 将mongoose升级5.x版本.   第二种: 按报错给出的mongoose 4.x的文档修改即可(若还是警告,升级到4.11.0)

  2. MVP01集合创建成功了，且为该集合创建了用户db.createUser({user: 'MVP01', pwd: 'MVP01', roles:[role: 'readWrite', db: 'MVP01']}), 报错后我以为是没有创建好用户，再创建时 提示 `couldn't add user: User"MVP01@MVP01" already exists: xxxxxx`。  奇怪的是控制台显示“数据库连接成功”,报错内容依然是: 'Unhandled rejection MongoError: not authorized on MVP01 to execute command { listIndexes: "sessions", cursor: {} }'    
    
    解决办法: 首先通过查找发现 [listIndexes](https://docs.mongodb.com/manual/reference/command/listIndexes/)所对应的值是集合的名称(sessions是持久化存入mongodb时,自动创建的集合),所以应该定位到session存储到mongodb这一步，发现了url的出问题，这个是自己没有写配置文件导致的。可参考我的帖子: [地址](https://cnodejs.org/topic/5b0cce975cd02be640900f7e)