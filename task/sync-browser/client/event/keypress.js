/**
 * Created by zyt on 2014/12/21.
 */

(function () {
    var C = {
        getData: function (event) {
            var extraData = {},
                target = $(event.target);
            if (target.is('input[type=checkbox],input[type=radio]')) {
                extraData.value = target.prop('checked');
            }
            return extraData;
        },

        triggerEvent: function (dom, d) {
            var target = $(dom);
            if (target.is('input[type=checkbox], input[type=radio]')) {
                target.prop('checked', d.extraData.value);
            }
        }
    };
    SyncBrowser.eventList.keypress = C;
} ());


