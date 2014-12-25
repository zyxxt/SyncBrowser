/**
 * Created by zyt on 2014/12/17.
 */

"use strict";

module.exports = function (grunt) {
    grunt.registerMultiTask('sync-browser', 'sync browser event to everywhere', function () {
        var http = require('http');
        var io;
        var options = this.options({
            host: 'localhost',
            port: 59991
        });
        var done = this.async();

        function init () {
            var server = http.createServer();
            server.listen(options.port, options.host);

            io = require('socket.io')(server);

            io.on('connection', onConnect);
        }

        function onConnect (socket) {
            // 响应鼠标与键盘事件
            socket.on('send-to-server', onReceive);
            // 响应截图的大小与位置
            socket.on('send-snapshot-to-server', onSnapshotReceive);
            // 响应截图的具体内容
            socket.on('send-snapshot-data-to-server', onSnapshotDataReceive);
            console.log('connect');
        }

        function onReceive (data) {
//            console.log('获取到client发送过来的数据：%o', data);

            send(this, data);
        }
        function onSnapshotReceive (data) {
            console.log('send-snapshot-to-server');
            sendSnapshot(this, data);
        }
        function onSnapshotDataReceive (data) {
            console.log('send-snapshot-data-to-server');
            sendSnapshotData(this, data);
        }

        function send (socket, data) {
            socket.broadcast.emit('send-to-browser', data);
        }
        function sendSnapshot (socket, data) {
            socket.broadcast.emit('send-snapshot-to-browser', data);
        }
        function sendSnapshotData (socket, data) {
            socket.broadcast.emit('send-snapshot-data-to-browser', data);
        }

        init();

    });
};


