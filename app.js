var express = require("express");                          //expressWeb服务
var http = require("http");                                 //http服务
//var hbs = require("express-handlebars");                  //模板引擎
var bodyParser = require("body-parser");                  //用于处理POST请求数据解析成req.body属性
var cookieParser = require("cookie-parser");             //cookie模块
var path = require("path");                                 //path模块
var app = express();


var server = http.createServer(app);                         //创建一个服务；
var io = require("socket.io").listen(server);             //在服务端添加socket服务，socket.io是基于事件应用，服务端监听到connection连接时，
var users = [];                                                //用户


app.use(express.static(path.join(__dirname, '/public')));  //静态文件
app.use(express.static(path.join(__dirname, '/views')));   //静态文件
app.use(express.static(path.join(__dirname,"/bower_components")));    //静态文件
app.set("port",process.env.PORT  || 8080);                    //设置端口号
//app.engine("hbs",hbs({                                        //模板引擎的设置
//    layoutsDir:"views",                                       //设置布局模板文件的目录为views文件夹
//    defaultLayout:"layout",                                   //默认显示index,
//    extname:".html"                                           //文件后缀名为hbs
//}));
//app.set("view engine","html");                               //模板
server.listen(app.get("port"));                              //在服务中监听一个端口



//路由
app.use(function(req, res) {
    res.sendFile(path.join(__dirname, './views/layout.html'))
});


//io.sockets.on("connection",function(socket){                 //是服务端监听所有客服端的连接，返回新对象；这样就可以和客服端即时通信了
//    socket.on("login",function(username){                    //监听新的用户登录,返回登录用户名
//        if(users.indexof(username) > -1){                    //判断username是否存在于users中
//            socket.emit("userExisted");                      //emit(name):触发事件;name:表示事件名称；是向建立该连接的客服端广播
//        }else{
//            socket.userIndex = users.length;                //存储用户当前所在的索引
//            socket.username = username;                       //存储用户
//            users.push(username);                              //添加到数组中
//            socket.emit("loginSuccess");                     //登录成功出发此事件
//            io.sockets.emit("system",username,user.length,"login");       //向所有的客服端广播
//        }
//    });
//    socket.on("disconnect",function(){                      //当对方关闭连接后触发disconnect事件；用户下线
//        users.splice(socket.userIndex,1);                   //删除退出的用户
//        socket.broadcast.emit("system",socket.username,users.length,"logout"); //退出；向除去建立该连接的客服端的所用客服广播
//    });
//    socket.on("postMsg",function(msg,color){
//        socket.broadcast.emit("newMsg",socket.username,msg,color);
//    });
//    socket.on("img",function(imgData,color){
//        socket.broadcast.emit("newMsg",socket.username,imgData,color);
//    })
//});
/**
 * sockets：是一个即时通讯协议；首先创建连接，返回socket对象，
 * 聊天功能实现流程：
 *   1、当客服端发起请求进入聊天界面，首先判断用户是否存在，
 *   2、如果不存在就重定向到注册页面，进行注册
 *   3、
 */
var messages = [];

io.sockets.on('connection', function(socket) {         //是服务端监听所有客服端的连接，返回新对象；这样就可以和客服端即时通信了
    socket.on('messages.read', function(){              //on():监听一个自定义事件
        socket.emit('messages.read', messages);         //emit():触发自定义事件
    });
    socket.on('messages.create', function(message) {
        messages.push(message);
        io.sockets.emit('messages.add', message)
    })
})