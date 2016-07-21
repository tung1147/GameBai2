/**
 * Created by Quyet Nguyen on 7/1/2016.
 */
var LobbyTopBar = cc.Node.extend({
    ctor : function () {
        this._super();

        var bg = new cc.Sprite("#home-top-bar.png");
        bg.setAnchorPoint(0.0, 1.0);
        bg.setPosition(0.0, cc.winSize.height);
        this.addChild(bg);

        this.backBt = new ccui.Button("home-backBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.backBt.setPosition(65, 653);
        this.addChild(this.backBt);

        this.callBt = new ccui.Button("home-callBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.callBt.setPosition(167, this.backBt.y);
        this.addChild(this.callBt);

        this.newsBt = new ccui.Button("home-newsBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.newsBt.setPosition(1016, this.backBt.y);
        this.addChild(this.newsBt);

        this.rankBt = new ccui.Button("home-rankBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.rankBt.setPosition(1115, this.backBt.y);
        this.addChild(this.rankBt);

        this.settingBt = new ccui.Button("home-settingBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.settingBt.setPosition(1220, this.backBt.y);
        this.addChild(this.settingBt);


        var padding = 130.0;
        var messageBgWidth = cc.winSize.width - padding * 2;
        if (messageBgWidth > 900){
            messageBgWidth = 900.0;
        }
        var messageBoxLeft = 230.0;
        var messageBoxRight = 940.0;
        var messageBoxWidth = messageBoxRight - messageBoxLeft;

        var clippingMessage = new ccui.Layout();
        clippingMessage.setContentSize(messageBoxWidth, 80);
        clippingMessage.setClippingEnabled(true);
        clippingMessage.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        clippingMessage.setPosition(messageBoxLeft, 618);
        this.addChild(clippingMessage);

        var messageText = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_30, "");
        messageText.setColor(cc.color(255, 255, 255));
        messageText.setAnchorPoint(0.0, 0.5);
        messageText.setPosition(0.0, clippingMessage.getContentSize().height/2);
        clippingMessage.addChild(messageText);

        this.messageText = messageText;
        this.messageBoxWidth = messageBoxWidth;

        this.setAnchorPoint(0.0, 1.0);
        this.setContentSize(1280.0, 720.0);
        this.setPosition(0.0, 720.0);
        this.setScale(cc.winSize.screenScale);

       // this.setMessage("Sự kiện nhân đôi vàng, bắt đầu từ ngày 30/05/2015 - 01/06/2015");
    },
    
    setMessage : function (message) {
        var messageText = this.messageText;
        var messageBoxWidth = this.messageBoxWidth + 10.0;

        messageText.stopAllActions();
        messageText.setString(message);
        messageText.x = messageBoxWidth;
        var moveWidth = messageBoxWidth + messageText.getContentSize().width;
        var duration = moveWidth / 75.0;
        var action = new cc.Sequence(new cc.MoveBy(duration, cc.p(-moveWidth, 0)), new cc.CallFunc(function () {
            messageText.x = messageBoxWidth;
        }));
        this.messageText.runAction(new cc.RepeatForever(action));
    },
    refreshView : function () {
        this.setMessage(GameConfig.broadcastMessage);
    },
});