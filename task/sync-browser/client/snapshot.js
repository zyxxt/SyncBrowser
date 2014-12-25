/**
 * Created by zyt on 2014/12/23.
 */

(function () {

    var Snapshot = function () {
        this.btnZIndex = 9999999;

        this.init();
    };

    Snapshot.prototype = {

        init: function () {
            this.createBtn();
        },

        snapshot: function (cb, s, p) {
            var me = this,
                size = s || me.getSnapshotSize(),
                pos = p || me.getSnapshotPosition();
            html2canvas(document.body, {
                onrendered: function(canvas) {
                    var urlData = me.getImageData(canvas, size.w, size.h, pos.x, pos.y);
                    if ($.isFunction(cb)) {
                        cb.call(me, urlData, size, pos);
                    }
                },

                width: size.w,
                height: size.h
            });
        },

        getImageData: function (canvas, w, h, x, y) {
            return Canvas2Image.getPngDataUrl(canvas, w, h, x, y);
        },

        createToolbarTpl: function () {
            return [
                '<div>',
                '<label for="__sync_browser_x__">x: </label>',
                '<input value="0" style="width: 40px;" id="__sync_browser_x__" />',
                '<label for="__sync_browser_y__">y: </label>',
                '<input  value="0" style="width: 40px;" id="__sync_browser_y__" />',
                '<label for="__sync_browser_w__">w: </label>',
                '<input value="480" style="width: 40px;" id="__sync_browser_w__" />',
                '<label for="__sync_browser_h__">h: </label>',
                '<input value="320" style="width: 40px;" id="__sync_browser_h__" />',
                '<button>截图</button>',
                '</div>'
            ].join('');
        },

        createBtn: function () {
            var bar = $(this.createToolbarTpl()),
                me = this;
            bar.css({
                position: 'fixed',
                "z-index": this.btnZIndex,
                bottom: 0,
                right: 0,
                padding: '2px 4px',
                background: 'yellow'
            });
            bar.appendTo(document.body);
            bar.find('button').click(function (e) {
                bar.hide();
                me.doing = true;
                me.snapshot(function (urlData, size, pos) {
                    me.lastUrlData = urlData;
                    me.lastSize = size;
                    me.lastPos = pos;

                    me.send({
                        size: size,
                        pos: pos
                    });
                    me.snapshotCallback();
                });


                e.stopPropagation();
                e.preventDefault();
            });
            this.toolbar = bar;
        },

        getSnapshotSize: function () {
            return {
                w: parseInt($('#__sync_browser_w__').val(), 10),
                h: parseInt($('#__sync_browser_h__').val(), 10)
            };
        },
        getSnapshotPosition: function () {
            return {
                x: parseInt($('#__sync_browser_x__').val(), 10),
                y: parseInt($('#__sync_browser_y__').val(), 10)
            };
        },

        snapshotCallback: function () {
            var me = this;
            me.toolbar.show();
        },

        // 只发送位置给后台，通知其它所有的客户端 去截图，截图后，再把图片内容发过来
        send: function (data) {
            SyncBrowser.socket.send(data, 'send-snapshot-to-server');
        },
        emit: function (data) {
            this.snapshot(function (urlData) {
                this.sendUrlData(urlData);
            }, data.size, data.pos);
        },



        sendUrlData: function (urlData) {
            SyncBrowser.socket.send(urlData, 'send-snapshot-data-to-server');
        },
        emitUrlData: function (urlData) {
            if (!this.lastUrlData) {
                return ;
            }
            this.createCompare();

            var config = {
//                lineColor: '#000',
//                noClick:true,
                width: this.lastSize.w,
                height: this.lastSize.h,
                img_before: this.lastUrlData,
                img_after: urlData,
                cursorVisible: false,
                stopClick: true,
                startPosition: 0.3//,
//                cursor:{
//                    color: '#2D9EA3',
//                    size: 8,
//                    gap: 4,
//                    lineColor: '#2D9EA3',
//                    lineH: 30
//                }
            }
            $('#__sync_browser_compare__').doubleviewer(config);

        },


        createCompare: function () {
            var me = this;
            var zindex = this.btnZIndex + 1;
            var mask = $('<div id="__sync_browser_compare_mask__"></div>');
            var compareEl = $([
                '<div id="__sync_browser_compare_wrap__">',
                '<div id="__sync_browser_compare__"></div>',
                '<div id="__sync_browser_compare_wrap_close__"></div>',
                '</div>'
            ].join(''));
            mask.appendTo(document.body);
            compareEl.appendTo(document.body);
            mask.css({
                position: 'fixed',
                "z-index": zindex,
                background: '#BBB',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            });
            var w = this.lastSize.w,
                h = this.lastSize.h;
            compareEl.css({
                position: 'fixed',
                "z-index": zindex + 1,
                background: '#888',
                left: '50%',
                top: '50%',
                width: w,
                height: h,
                "margin-left": (-w / 2) + 'px',
                "margin-top" : (-h / 2) + 'px',
                padding: '10px',
                "border-radius": '10px'
            });
            $('#__sync_browser_compare__').css({
                width: w,
                height: h
            });
            $('#__sync_browser_compare_wrap_close__').css({
                position: 'absolute',
                top: "-16px",
                right: "-16px",
                width: 32,
                height: 32,
                cursor: 'pointer',
                "background-image": 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/0lEQVRYR+2V4Q3CIBCF2w0coU6gbqCT6wg6gY7gCN5LuARbyr0DTGOCCX8o3vt4x4Nx2Pg3bqw/dIDuQHfgrxw4yp3xkvEm746drJtk3HPrWQdQ6BmKXQgIiF9lAHofwJMcLAD+jJ0cCIhY/BEgVk3wAKDwzYCYi58ttzwA2EUOwi2Ogl6ANQjMa89hu7lz7UkJQAoCczhwLvFSBxQ+bgfm3OItANR2TQkT0a9E1LQg7jmKMhFdxLEEIHXaUdiK6EK8pAW5qDH3RJUDTM7dEJ4W6FVsnfY5xCnpfZhkASZZj8fIEk9FtNljtOlznHOx6hvbgiqRFmegA3QHfubAB1EWSiFDKJTHAAAAAElFTkSuQmCC")'
            }).click(function () {
                mask.remove();
                compareEl.remove();
                compareEl = null;
                me.doing = false;
            });
        }
    };

    SyncBrowser.snapshot = new Snapshot();

} ());