/**
 * Created by Quyet Nguyen on 7/5/2016.
 */
var LobbyLayer = cc.Node.extend({
    chatMessageWidth : null,
    ctor : function () {
        this._super();

        var chatBar = new cc.Sprite("#home-minigame-bar.png");
        chatBar.setPosition(cc.winSize.width - 162.0 * cc.winSize.screenScale, 170.0);
        chatBar.setScale(cc.winSize.screenScale);
        this.addChild(chatBar);

        var chatIcon = new cc.Sprite("#lobby-chat-icon.png");
        chatIcon.setPosition(chatBar.x - 118 * cc.winSize.screenScale, chatBar.y);
        this.addChild(chatIcon);
        chatIcon.setScale(cc.winSize.screenScale);

        var sendButton = new ccui.Button("lobby-send-icon.png","","", ccui.Widget.PLIST_TEXTURE);
        sendButton.setPosition(chatBar.x + 118 * cc.winSize.screenScale, chatBar.y);
        sendButton.setScale(cc.winSize.screenScale);
        this.addChild(sendButton);

        var chatText = new newui.TextField(cc.size(190 * cc.winSize.screenScale, 55), cc.res.font.Roboto_Condensed, 20 * cc.winSize.screenScale);
        chatText.setAlignment(newui.TextField.ALIGNMENT_LEFT);
        chatText.setPlaceHolder("Nhập nội dung");
        chatText.setPlaceHolderColor(cc.color(34,110,155));
        chatText.setTextColor(cc.color(255,255,255));
        chatText.setPosition(chatBar.getPosition());
        //chatText.setScale(cc.winSize.screenScale);
        this.addChild(chatText,1);

        var _top = 580.0;
        var _bottom = chatBar.y + chatBar.getContentSize().height / 2 * chatBar.getScaleY();
        var _right = cc.winSize.width - (20.0 * cc.winSize.screenScale);
        var _left =  cc.winSize.width -  (300.0 * cc.winSize.screenScale);

        var chatBg = ccui.Scale9Sprite.createWithSpriteFrameName("home-minigame-bg.png", cc.rect(8, 0, 4, 384));
        chatBg.setPreferredSize(cc.size(_right - _left + 4.0, 384));
        chatBg.setAnchorPoint(cc.p(1.0, 0));
        chatBg.setPosition(_right, _bottom);
        this.addChild(chatBg);

        var chatList = new ccui.ListView();
        chatList.setContentSize(cc.size(_right - _left, 384));
        chatList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        chatList.setScrollBarEnabled(false);
        chatList.setTouchEnabled(true);
        chatList.setBounceEnabled(true);
        chatList.setAnchorPoint(cc.p(1.0,0));
        chatList.setPosition(cc.p(_right - 2, _bottom));
        this.addChild(chatList, 1);

        var thiz = this;
        this.chatText = chatText;
        this.chatList = chatList;

        sendButton.addClickEventListener(function () {
            thiz.sendChatHandler();
        });
        chatText.setReturnCallback(function () {
            thiz.sendChatHandler();
            return true;
        });

        // for(var i =0; i< 20; i++){
        //     this.addChatMessage("Me", "test noi dung chat test noi dung chat test noi dung chat test noi dung chat test noi dung chat test noi dung chat test noi dung chat");
        // }
    },
    
    sendChatHandler : function () {
        var message = this.chatText.getText();
        this.chatText.setText("");
        
        this.addChatMessage("Me", message);
    },
    
    addChatMessage : function (username, message) {
      //  cc.log(username + ": "+message);
        var textMesasge = new ccui.RichText();
        textMesasge.ignoreContentAdaptWithSize(false);
        textMesasge.width = this.chatList.getContentSize().width;

        var userText = new ccui.RichElementText(0, cc.color(39,197,255), 255, username +": ", cc.res.font.Roboto_CondensedBold, 20 * cc.winSize.screenScale);
        var messageText = new ccui.RichElementText(1, cc.color(255,255,255), 255, message, cc.res.font.Roboto_Condensed, 20 * cc.winSize.screenScale);

        textMesasge.pushBackElement(userText);
        textMesasge.pushBackElement(messageText);
        textMesasge.formatText();

        var size = textMesasge.getContentSize();
        this.chatList.pushBackCustomItem(textMesasge);
        this.chatList.scrollToBottom(0.5, true);

        var padding = new ccui.Widget();
        padding.setContentSize(cc.size(textMesasge.width, 8.0));
        this.chatList.pushBackCustomItem(padding);
    }
});