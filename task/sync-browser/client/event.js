/**
 * Created by zyt on 2014/12/19.
 */

(function () {
    var oriGetData = SyncBrowser.Base.prototype.getData;

    var Event = function () {
        this.init();
    };

    var B = Event.prototype = new SyncBrowser.Base();

    B.init = function () {
        this.bindEvent();
    };

    B.bindEvent = function () {
        var me = this;
        $.each([
            'keydown',
            'keyup',
            'keypress',

            'mousedown',
            'mousemove',
            'mouseout',
            'mouseover',
            'mouseup',
            'click',
            'dblclick',

            'change',
            'resize',
            'select',
            'submit',
            'reset'

        ], function (idx, eventType) {
            $(document).bind(eventType, me.getEventFn(eventType));
        });
    };

    B.getData = function (eventType, event) {
        var fn,
            d = oriGetData.apply(this, arguments);
        if (SyncBrowser.eventList[eventType]) {
            fn = SyncBrowser.eventList[eventType].getData;
            if (typeof fn === 'function') {
                return $.extend(d, {
                    extraData: fn.call(this, event)
                });
            }
        }
        return d;
    };

    SyncBrowser.event = new Event();

} ());