/**
 * Created by QuyetNguyen on 12/7/2016.
 */

var s_chat_message = s_chat_message || [
        "Nhanh đi má !!!", "Chết nè cưng !!!", "Mày hả bưởi ???",
        "Lại phải chia bài!", "Tới luôn!", "Nhanh cmml!",
        "Bình tĩnh em eei", "Vô tư đê !!!", "Đen vd",
        " Đừng vội mừng!", "Lâu vồn", "Nhào zo !!!",
        "Mình xin!", "Đệch!"
    ];

var ChatDialog = IDialog.extend({
    ctor: function () {
        this._super();
        this.dialogNode.setPosition(cc.p(0, 0));

        var dialogBg = new ccui.Scale9Sprite("chat-bg.png", cc.rect(39, 0, 2, 2));
        dialogBg.setPreferredSize(cc.size(1004, 521));
        dialogBg.setAnchorPoint(cc.p(0.5, 1.0));
        dialogBg.setPosition(cc.winSize.width / 2, cc.winSize.height + dialogBg.height);
        this.dialogBg = dialogBg;
        this.dialogNode.addChild(dialogBg);

        var minimizeBt = new cc.Sprite("#chat-minimize-bt.png");
        minimizeBt.setPosition(dialogBg.width / 2, 24);
        dialogBg.addChild(minimizeBt);

        this.initAllChat();
    },
    initAllChat: function () {
        var col = 2;
        var row = Math.ceil(s_chat_message.length / col);

        var padding = 30.0;
        var itemWidth = 240;
        var itemHeight = 60;
        var baseX = 24;
        var baseY = 104;

        var thiz = this;
        for (var i = 0; i < s_chat_message.length; i++) {
            var x = baseX + itemWidth / 2 + padding * (i % col + 1) + itemWidth * (i % col);
            var y = baseY + itemHeight * (Math.floor(i / col));

            var bg = new ccui.Button("dialog_chat_bg.png", "", "", ccui.Widget.PLIST_TEXTURE);
            bg.setCapInsetsNormalRenderer(cc.rect(23, 0, 4, 44));
            bg.setScale9Enabled(true);
            bg.setContentSize(cc.size(itemWidth, 44));
            bg.setPosition(x, y);
            bg.setZoomScale(0.02);
            this.dialogBg.addChild(bg);

            var message = new cc.LabelBMFont(s_chat_message[i], cc.res.font.Roboto_Condensed_25);
            message.setPosition(bg.getContentSize().width / 2, bg.getContentSize().height / 2);
            bg.getRendererNormal().addChild(message);
            (function () {
                var msg = s_chat_message[i];
                bg.addClickEventListener(function () {
                    thiz._buttonHandler(msg);
                });
            })();
        }

        baseX = 614;
        itemWidth = 76;
        itemHeight = 72;
        col = 5;
        for (var i = 0; i < 30; i++) {
            var x = baseX + itemWidth * (i % col);
            var y = baseY + itemHeight * (Math.floor(i / col));

            var item = new ccui.Button("chat-icon" + (i % 10 + 1) + ".png", "", "", ccui.Widget.PLIST_TEXTURE);
            item.setPosition(x, y);
            item.setZoomScale(0.02);
            this.dialogBg.addChild(item);
        }
    },

    _buttonHandler: function (message) {
        if (this.onTouchMessage) {
            this.onTouchMessage(message);
        }
        this.hide();
    },
    show: function () {
        this._super();
        this.dialogBg.runAction(new cc.MoveTo(0.3, cc.p(this.dialogBg.x, cc.winSize.height)));
    },
    hide: function () {
        var thiz = this;
        this.dialogBg.stopAllActions();
        this.dialogBg.runAction(new cc.Sequence(
            new cc.MoveTo(0.3, this.dialogBg.x, cc.winSize.height + this.dialogBg.height),
            new cc.CallFunc(function () {
                var parent = thiz.getParent();
                if(parent){
                    thiz.removeFromParent(true);
                }
            })));
    }
});