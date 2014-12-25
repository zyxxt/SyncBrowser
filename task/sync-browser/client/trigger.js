/**
 * Created by zyt on 2014/12/21.
 */

(function () {
    var Trigger = function () {
        this.init();
    };

    Trigger.prototype = {

        init: function () {},

        emit: function (data) {
            var dom,
                eventType,
                fn;
            if (!data || !data.type) {
                return ;
            }
            eventType = data.type;
            dom = this.findDom(data.path);
            if (!dom) {
                 return ;
            }

            this.triggerEvent(dom, eventType, data.data);


            // 有一此事件是无法触发的，这时自己通过JS来模拟吧
            if (SyncBrowser.eventList[eventType]) {
                fn = SyncBrowser.eventList[eventType].triggerEvent;
                if (typeof fn === 'function') {
                    fn.call(this, dom, data.data);
                }
            }
        },

        findDom: function (path) {
            var root = path[0],
                dom;
            if (!path || !path[0]) {
                return ;
            }
            if (root.type === 'id') {
                dom = document.getElementById(root.value);
            } else {
                dom = document.body;
            }
            path.shift();

            if (path.length) {
                $.each(path, function (idx, item) {
                    var type = item.type,
                        v = item.value;
                    switch (type) {
                        case 'indexOf':
                            dom = dom.children[v];
                            if (!dom) {
                                console.error('can not find dom: %o', path);
                                return false;
                            }
                    }
                });
            }
            return dom;

        },

        triggerEvent: function (dom, eventName, data) {
            var ev;
            if (document.createEvent) {
                ev = document.createEvent('HTMLEvents');
                ev.initEvent(eventName, true, false);
                ev = $.extend(ev, data);
                dom.dispatchEvent(ev);
            } else if (document.createEventObject) {
                ev = document.createEventObject();
                ev = $.extend(ev, data);
                dom.fireEvent('on' + eventName, ev);
            }
        }

    };

    SyncBrowser.trigger = new Trigger();


} ());
