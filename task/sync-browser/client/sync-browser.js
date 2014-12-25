/**
 * Created by zyt on 2014/12/19.
 */


var SyncBrowser = {
    config: {
        protocol: 'http',
        server: 'localhost',
        port: 12354,

        root: '/SyncBrowser/task/sync-browser/client/'
    },

    loadJs: function (path, cb) {
        var head = document.head || document.getElementsByTagName('head'),
            el;
        if (!$.isArray(path)) {
            path = [path];
        }
        var p = path.shift();

        el = document.createElement('script');
        el.src = SyncBrowser.config.root + p + '.js';
        el.type = 'text/javascript';
        el.async = false;
        el.onload = function () {
            if (path.length) {
                SyncBrowser.loadJs(path, cb);
                return ;
            }
            if (typeof cb === 'function') {
                cb();
            }
        };
        head.appendChild(el);
    },

    socket: {
        init: function () {
            var config = SyncBrowser.config;
            SyncBrowser.Socket.init(config);
        },
        send: function (data, eventName) {
            SyncBrowser.Socket.send(data, eventName);
        }
    },

    eventList: {
//        keyup:...
//        keydown:...
//        keypress:...
//        ...
    }

};

SyncBrowser.Socket = function () {
    var socket,
        prevent = false;
    function init (config) {
        createSocket(config);
    }

    function createSocket (config) {
        socket = io.connect(config.protocol + '://' + config.server + ':' + config.port);
        socket.on('send-to-browser', onReceive);
        socket.on('send-snapshot-to-browser', onSnapshotReceive);
        socket.on('send-snapshot-data-to-browser', onSnapshotDataReceive);
    }

    function onReceive (data) {
        prevent = true;
        SyncBrowser.trigger.emit(data);
        prevent = false;
    }

    function onSnapshotReceive (data) {
        SyncBrowser.snapshot.emit(data);
    }
    function onSnapshotDataReceive (data) {
        SyncBrowser.snapshot.emitUrlData(data);
    }

    function send (data, eventName) {
        if (prevent) {
            return ;
        }
        socket.emit(eventName || 'send-to-server', data);
    }

    return {
        init: init,
        send: send
    };
} ();



if (!jQuery) {
    console.error('you must load jQuery first');
}


SyncBrowser.loadJs([
    'lib/socket.io',
    'lib/html2canvas',
    'lib/canvas2image',
    'lib/doubleviewer',
    'base',

    'event/keypress',
    'event/keyup',

    'event/click',

    'snapshot',
    'event',
    'trigger'
], function () {

    SyncBrowser.socket.init();

});
