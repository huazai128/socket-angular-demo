angular.module('myApp', []);

angular.module('myApp').factory('socket', function($rootScope) {    //自定义工厂服务，$rootScope:顶级作用域；工厂服务返回一个对象
    var socket = io.connect('http://localhost:8080/');                //客服端连接socket.io
    return {                                                              //返回一个对象
        on: function(eventName, callback) {                              //在自定义的工厂服务中返回两个方法
            socket.on(eventName, function() {                            //客服端监听事件
                var args = arguments;
                $rootScope.$apply(function() {                           //当socket.on()被触发是，$digest；循环所有model，是否发生变化，如果发生变化就会更新视图；
                    callback.apply(socket, args);                         //apply(object,arg);指针偏移指向socket
                })
            })
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {                   //当事件被触发时，调用
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args)
                    }
                })
            })
        }
    }
});

//自定义指令；用来监听事件键盘事件
angular.module('myApp').directive('ctrlEnterBreakLine', function() {
    return {
        restrict:"A",                                    //restrict:以何种方式注入；A:属性注入
        link:function(scope, element, attrs) {            //link:用于元素的操作
            var ctrlDown = false;
            element.bind("keydown", function(evt) {     //绑定键盘按下事件
                if (evt.which === 17) {                    //如果键盘key ===  17
                    ctrlDown = true;
                    setTimeout(function() {
                        ctrlDown = false
                    }, 1000)
                }
                if (evt.which === 13) {
                    if (ctrlDown) {
                        element.val(element.val() + '\n');
                        console.log(element.val())
                    } else {
                        scope.$apply(function() {       //$apply:用于触发$digest循环，联检厅view的变化，在修改model数据；手动调用$apply
                            scope.$eval(attrs.ctrlEnterBreakLine);
                        });
                        evt.preventDefault()
                    }
                }
            });
        }
    }
});

angular.module('myApp').controller('myMessage', function($scope, socket) {
    $scope.createMessage = function () {                         //
        socket.emit('messages.create', $scope.newMessage);    //触发事件时，
        $scope.newMessage = ''
    }
});

//自定义鼠标滚动条
angular.module('myApp').directive('autoScrollToBottom', function() {
    return {
        restrict:"A",
        link: function(scope, element, attrs) {         //link():用于操作元素；
            scope.$watch(                                //监听Model变化，有变化就会触发
                function() {
                    return element.children().length;   //获取当前元素的所有子元素
                },
                function() {
                    element.animate({                                 //元素中添加动画效果
                        scrollTop: element.prop('scrollHeight')   //prop()：用于获取对象的属性，attr()：用于获取元素上的属性
                    }, 1000);
                }
            );
        }
    };
});

angular.module('myApp').controller('myCtrl', function($scope, socket) {
    $scope.messages = [];
    socket.on('messages.read', function (messages) {
        $scope.messages = messages;
    });
    socket.on('messages.add', function (message) {
        $scope.messages.push(message);
    });
    socket.emit('messages.read')
});