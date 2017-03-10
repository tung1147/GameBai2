/**
 * Created by QuyetNguyen on 12/7/2016.
 */

var s_chat_message = s_chat_message || [
        "Nhanh đi má !!!", "Chết nè cưng !!!", "Mày hả bưởi ???",
        "Lại phải chia bài!", "Tới luôn!", "Nhanh cmml!",
        "Bình tĩnh em eei", "Vô tư đê !!!", "Đen vd",
        " Đừng vội mừng!", "Lâu vồn", "Nhào zo !!!",
        "Mình xin!", "Đệch!", "Ngu vồn!"
];

var ChatDialog = IDialog.extend({
    ctor : function () {
        this._super();
        this.setPosition(cc.p(0,0));
        this.initAllChat();
    },
    initAllChat : function () {
        var col = 3;
        var row = Math.ceil(s_chat_message.length/col);

        var padding = 40.0;
        var itemWidth = (cc.winSize.width - padding*(col+1)) / col;
        var itemHeight = 100.0;

        var thiz = this;
        for(var i=0;i<s_chat_message.length;i++){
            var x = padding + itemWidth/2 + (itemWidth +padding) * (i%col);
            var y = cc.winSize.height/2 - itemHeight*(row-1) / 2 + itemHeight *Math.floor(i/col);

            var bg = new ccui.Button("dialog_chat_bg.png", "","",ccui.Widget.PLIST_TEXTURE);
            bg.setCapInsetsNormalRenderer(cc.rect(50,0,4,60));
            bg.setScale9Enabled(true);
            bg.setContentSize(cc.size(itemWidth, 60));
            bg.setPosition(x,y);
            bg.setZoomScale(0.02);
            this.addChild(bg);

            var message = new cc.LabelBMFont(s_chat_message[i], cc.res.font.Roboto_Condensed_25);
            message.setPosition(bg.getContentSize().width/2, bg.getContentSize().height/2);
            bg.getRendererNormal().addChild(message);
            (function () {
                var msg = s_chat_message[i];
                bg.addClickEventListener(function () {
                    thiz._buttonHandler(msg);
                });
            })();
        }
    },

    _buttonHandler : function (message) {
        if(this.onTouchMessage){
            this.onTouchMessage(message);
        }
        this.hide();
    }
});