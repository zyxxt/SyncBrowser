/**
 * Created by zyt on 2014/12/21.
 */

(function () {
    var Base = function () {};
    Base.prototype = {

        getPath: function (dom) {
            var ret = [];
            if (dom === document.body || dom === document.body.parentNode) {
                ret.push({ type: 'root' });
            } else if (dom.id) {
                ret.push({
                    type: 'id',
                    value: dom.id
                });
            } else {
                var p = dom;
                while (p) {
                    var q = p.parentNode,
                        children;
                    if (!q) {
                        break;
                    }
                    children = q && q.children;
                    if (!children) {
                        break;
                    }
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        if (child === p) {
                            ret.push({
                                type: 'indexOf',
                                value: i
                            });
                            break;
                        }
                    }
                    if (q.id) {
                        ret.push({
                            type: 'id',
                            value: q.id
                        });
                        break;
                    }
                    if (q === document.body) {
                        ret.push({ type: 'root' });
                        break;
                    }
                    p = q;
                }
            }
            ret.reverse();
            return ret;
        },

        getEventFn: function (eventType) {
            var me = this;
            return function (e) {
                var target = e.target;
                var path = me.getPath(target);
                if (!path || !path.length) {
                    return ;
                }

                if (SyncBrowser.snapshot.doing) {
                    return ;
                }

                SyncBrowser.socket.send({
                    type: eventType,
                    path: path,
                    data: me.getData(eventType, e)
                });
            };
        },

        getData: function (eventType, event) {
            var excludeKey = [
                'currentTarget',
                'delegateTarget',
                'handleObj',
                'isDefaultPrevented',
                'originalEvent',
                'target',
                'toElement',
                'view',
                'relatedTarget',

                'isDefaultPrevented',
                'isImmediatePropagationStopped',
                'isPropagationStopped',
                'preventDefault',
                'stopImmediatePropagation',
                'stopPropagation'
            ];
            var ret = {};
            for (var key in event) {
                if (excludeKey.indexOf(key) === -1) {
                    ret[key] = event[key];
                }
            }
            return ret;
        }
    };
    SyncBrowser.Base = Base;
} ());