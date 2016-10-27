var express = require("express");                          //expressWeb����
var http = require("http");                                 //http����
//var hbs = require("express-handlebars");                  //ģ������
var bodyParser = require("body-parser");                  //���ڴ���POST�������ݽ�����req.body����
var cookieParser = require("cookie-parser");             //cookieģ��
var path = require("path");                                 //pathģ��
var app = express();


var server = http.createServer(app);                         //����һ������
var io = require("socket.io").listen(server);             //�ڷ�������socket����socket.io�ǻ����¼�Ӧ�ã�����˼�����connection����ʱ��
var users = [];                                                //�û�


app.use(express.static(path.join(__dirname, '/public')));  //��̬�ļ�
app.use(express.static(path.join(__dirname, '/views')));   //��̬�ļ�
app.use(express.static(path.join(__dirname,"/bower_components")));    //��̬�ļ�
app.set("port",process.env.PORT  || 8080);                    //���ö˿ں�
//app.engine("hbs",hbs({                                        //ģ�����������
//    layoutsDir:"views",                                       //���ò���ģ���ļ���Ŀ¼Ϊviews�ļ���
//    defaultLayout:"layout",                                   //Ĭ����ʾindex,
//    extname:".html"                                           //�ļ���׺��Ϊhbs
//}));
//app.set("view engine","html");                               //ģ��
server.listen(app.get("port"));                              //�ڷ����м���һ���˿�



//·��
app.use(function(req, res) {
    res.sendFile(path.join(__dirname, './views/layout.html'))
});


//io.sockets.on("connection",function(socket){                 //�Ƿ���˼������пͷ��˵����ӣ������¶��������Ϳ��ԺͿͷ��˼�ʱͨ����
//    socket.on("login",function(username){                    //�����µ��û���¼,���ص�¼�û���
//        if(users.indexof(username) > -1){                    //�ж�username�Ƿ������users��
//            socket.emit("userExisted");                      //emit(name):�����¼�;name:��ʾ�¼����ƣ������������ӵĿͷ��˹㲥
//        }else{
//            socket.userIndex = users.length;                //�洢�û���ǰ���ڵ�����
//            socket.username = username;                       //�洢�û�
//            users.push(username);                              //��ӵ�������
//            socket.emit("loginSuccess");                     //��¼�ɹ��������¼�
//            io.sockets.emit("system",username,user.length,"login");       //�����еĿͷ��˹㲥
//        }
//    });
//    socket.on("disconnect",function(){                      //���Է��ر����Ӻ󴥷�disconnect�¼����û�����
//        users.splice(socket.userIndex,1);                   //ɾ���˳����û�
//        socket.broadcast.emit("system",socket.username,users.length,"logout"); //�˳������ȥ���������ӵĿͷ��˵����ÿͷ��㲥
//    });
//    socket.on("postMsg",function(msg,color){
//        socket.broadcast.emit("newMsg",socket.username,msg,color);
//    });
//    socket.on("img",function(imgData,color){
//        socket.broadcast.emit("newMsg",socket.username,imgData,color);
//    })
//});
/**
 * sockets����һ����ʱͨѶЭ�飻���ȴ������ӣ�����socket����
 * ���칦��ʵ�����̣�
 *   1�����ͷ��˷����������������棬�����ж��û��Ƿ���ڣ�
 *   2����������ھ��ض���ע��ҳ�棬����ע��
 *   3��
 */
var messages = [];

io.sockets.on('connection', function(socket) {         //�Ƿ���˼������пͷ��˵����ӣ������¶��������Ϳ��ԺͿͷ��˼�ʱͨ����
    socket.on('messages.read', function(){              //on():����һ���Զ����¼�
        socket.emit('messages.read', messages);         //emit():�����Զ����¼�
    });
    socket.on('messages.create', function(message) {
        messages.push(message);
        io.sockets.emit('messages.add', message)
    })
})