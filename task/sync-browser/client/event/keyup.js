/**
 * Created by zyt on 2014/12/21.
 */

(function () {
    var C = {
        getData: function (event) {
            var extraData = {},
                target = $(event.target);
            if (target.is('input:not([type=checkbox], [type=radio])')) {
                extraData.value = target.val();
            }

            return extraData;
        },

        triggerEvent: function (dom, d) {
            var target = $(dom);
            if (target.is('input:not([type=checkbox], [type=radio])')) {
                target.val(d.extraData.value);
            }
        }
    };
    SyncBrowser.eventList.keyup = C;
} ());
