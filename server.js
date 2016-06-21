var app = require('koa')(),
    router = require('koa-router')(),
    serve = require('koa-static'),
    views = require('koa-views'),
    mount = require('koa-mount');


app.use(mount('/static', serve('./public')));
app.use(mount('/static', serve('./node_modules')));

//使用Jade作为模板引擎
app.use(views(__dirname +'/views', 'jade', {}));


// 使用路由
router.get('/', function *(){
    this.body = 'Hello World';
});


app.use(router.routes())
    .use(router.allowedMethods());



var server = require('http').createServer(app.callback()),
    io = require('socket.io')(server);

// Socket.io的标准用法
io.on('connection', function(socket){
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

server.listen(3000, '127.0.0.1');
console.log("Listen on 127.0.0.1:3000");
