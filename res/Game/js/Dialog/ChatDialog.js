/**
 * Created by QuyetNguyen on 12/7/2016.
 */

// var s_chat_message = s_chat_message || [
//         "Nhanh đi má !!!", "Bĩnh tĩnh em eei",
//         "Lại phải chia bài!", "Đen vd",
//         "Chết nè cưng !!!", "Mày hả bưởi ???",
//         "Tới luôn!", "Vô tư đê !!!",
//         "Mình xin!", " Đừng vội mừng!",
//         "Lâu vồn", "Lâu kệ tao",
//         "Ngu vồn!", "Đệch!",
//         "Nhào zo !!!", "Nhanh cmml!"
// ];

var ChatDialog = IDialog.extend({
    ctor : function () {
        this._super();
        var thiz = this;
        this.mTouch = cc.rect(0, 180, cc.winSize.width, cc.winSize.height);
        this.setContentSize(cc.size(cc.winSize.width, cc.winSize.height));


        // var bg = new ccui.Scale9Sprite("board_bg.png", cc.rect(105, 105, 147, 147));
        // bg.setPreferredSize(cc.size(1154,700));
        var bg = new ccui.Scale9Sprite("dialog-bg.png", cc.rect(20, 20, 4, 4));
        bg.setAnchorPoint(cc.p(0.5, 1));
        bg.setPreferredSize(cc.size(cc.winSize.width,583));
        this.addChild(bg);
        bg.setPosition(this.getContentSize().width/2, cc.winSize.height + 20);

        var closeButton = new ccui.Button("chat_close_bt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        closeButton.setPosition(this.getContentSize().width/2, 155);
        this.addChild(closeButton);
        closeButton.addClickEventListener(function () {
             thiz.hide();
        });

        this.initAllChat();
        this.initAllEmotion();
    },
    initAllChat : function () {
        var right = 626;
        var left = 45;
        var top = 684;
        var bottom = 200;

        var listMessage = new newui.TableView(cc.size(right - left, (top - bottom)), 2);
        listMessage.setPadding(20);
        listMessage.setBounceEnabled(true);
        // listMessage.setMargin(30,30,0,0);
        listMessage.setScrollBarEnabled(false);
        listMessage.setPosition(left, bottom);
        this.addChild(listMessage);

        var thiz = this;
        var s_chat_message = cc.Global.getStringRes()["ChatMessage"];
        for(var i=0;i<s_chat_message.length;i++){
            var bg = new ccui.Button("dialog_chat_bg.png", "","",ccui.Widget.PLIST_TEXTURE);
            bg.setCapInsetsNormalRenderer(cc.rect(12,12,4,4));
            bg.setScale9Enabled(true);
            bg.setContentSize(cc.size(282, 46));
            bg.setZoomScale(0.02);
            listMessage.pushItem(bg);

            var message = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, s_chat_message[i]);
            message.setPosition(bg.getContentSize().width/2, bg.getContentSize().height/2);
            message.setColor(cc.color("#bff2ff"));
            bg.getRendererNormal().addChild(message);
            (function () {
                var msg = s_chat_message[i];
                bg.addClickEventListener(function () {
                    thiz._buttonHandler(msg);
                });
            })();
        }
    },

    initAllEmotion : function () {
        var right = cc.winSize.width;
        var left = 646;
        var top = 684;
        var bottom = 200;

        var listMessage = new newui.TableView(cc.size(right - left, (top - bottom)), 6);
        listMessage.setPadding(20);
        listMessage.setBounceEnabled(true);
        listMessage.setMargin(30,30,0,0);
        listMessage.setScrollBarEnabled(false);
        listMessage.setPosition(left, bottom);
        this.addChild(listMessage);

        var thiz = this;
        for(var i=0;i<42;i++){
            if(i === 4){
                continue;
            }

            (function () {
                var iconImg = "chat_icon_" + (i+1) + ".png";
                var icon = new ccui.Button(iconImg, "","",ccui.Widget.PLIST_TEXTURE);
                icon.setZoomScale(0.09);
                listMessage.pushItem(icon);

                icon.addClickEventListener(function () {
                    thiz._emotionHandler(iconImg);
                });
            })();
        }
    },

    _buttonHandler : function (message) {
        if(this.onTouchMessage){
            this.onTouchMessage(message);
        }
        this.hide();
    },

    _emotionHandler : function (img) {
        if(this.onTouchEmotion){
            this.onTouchEmotion(img);
        }
        this.hide();
    }
});