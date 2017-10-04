/**
 * Created by Quyet Nguyen on 7/1/2016.
 */

var InboxCountNode = cc.Node.extend({
    ctor : function () {
        this._super();
        this._initListener();

        var bg = new cc.Sprite("#top_bar_news_bg.png");
        bg.setPosition(cc.p(0,0));
        this.addChild(bg);
        this.newsBg = bg;

        var newLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "9+");
        newLabel.setPosition(bg.getContentSize().width/2, bg.getContentSize().height/2);
        newLabel.setColor(cc.color("#682e2e"));
        bg.addChild(newLabel);
        this.newLabel = newLabel;
    },

    _initListener : function () {
        LobbyClient.getInstance().addListener("inboxMessage", this._onInboxMessageHandler, this);
        LobbyClient.getInstance().addListener("markReadedMessageInbox", this._onInboxMessageHandler, this);
    },

    refreshView : function () {
        if(PlayerMe.messageCount <= 0){
            this.newsBg.visible = false;
        }
        else{
            this.newsBg.visible = true;
            if(PlayerMe.messageCount > 9){
                this.newLabel.setString("9+");
            }
            else{
                this.newLabel.setString(PlayerMe.messageCount.toString());
            }
        }
    },

    _onInboxMessageHandler : function () {
        this.refreshView();
    },

    onEnter : function () {
        this._super();
        this.refreshView();
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});

var LobbyTopBar = cc.Node.extend({
    ctor : function () {
        this._super();
        this.setContentSize(cc.size(1280, 720));
        this.setAnchorPoint(cc.p(0.0, 1.0));
        this.setPosition(cc.p(0, 720));
        this.setScale(cc.winSize.screenScale);

        var bg = new cc.Sprite("#home_topBar_bg.png");
        bg.setAnchorPoint(cc.p(0, 1.0));
        bg.setPosition(cc.p(0, 720));
        this.addChild(bg);

        // var avatar = UserAvatar.createMe();
        // avatar.setPosition(148, 667);
        // this.addChild(avatar, 2);

        var rewardBt = new ccui.Button("home_buttonReward.png", "", "", ccui.Widget.PLIST_TEXTURE);
        rewardBt.setPosition(640, 677);
        this.addChild(rewardBt);

        var backBt = new ccui.Button("home_buttonBack.png", "", "", ccui.Widget.PLIST_TEXTURE);
        backBt.setPosition(43, 677);
        this.addChild(backBt);

        var inboxBt = new ccui.Button("home_buttonInbox.png", "", "", ccui.Widget.PLIST_TEXTURE);
        inboxBt.setPosition(1146, 677);
        this.addChild(inboxBt);

        var menuBt = new ccui.Button("home_buttonMenu.png", "", "", ccui.Widget.PLIST_TEXTURE);
        menuBt.setPosition(1236, 677);
        this.addChild(menuBt);

        var nameBg = new ccui.Scale9Sprite("home_name_bg.png", cc.rect(12, 0, 4, 17));
        nameBg.setPosition(148, 640);
        nameBg.setPreferredSize(cc.size(77, 17));
        this.addChild(nameBg);

        var goldLabel1 = cc.Label.createWithBMFont("res/fonts/fnt_tien1.fnt", "1.000.000");
        goldLabel1.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel1.setPosition(cc.p(265, 677));
        this.addChild(goldLabel1);

        var goldLabel2 = cc.Label.createWithBMFont("res/fonts/fnt_tien2.fnt", "1.000.000");
        goldLabel2.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel2.setPosition(cc.p(849, 677));
        this.addChild(goldLabel2);

        var nameLabel = new cc.LabelTTF("nameLabel", cc.res.font.UTM_SeagullBold, 15);
        nameLabel.setPosition(nameBg.getPosition());
        nameLabel.setFontFillColor(cc.color("#000000"));
        this.addChild(nameLabel);

        this.goldLabel1 = goldLabel1;
        this.goldLabel2 = goldLabel2;
        this.nameBg = nameBg;
        this.nameLabel = nameLabel;

        this.refreshView();
    },

    refreshView : function () {
        this.goldLabel1.setString(cc.Global.NumberFormat1(PlayerMe.gold1));
        this.goldLabel2.setString(cc.Global.NumberFormat1(PlayerMe.gold2));

        // var username = PlayerMe.username;
        // if(username.length > 16){
        //     username = username.substr(0, 16);
        // }
        this.nameLabel.setString(PlayerMe.username);

        var width = this.nameLabel.width + 20;
        if(width < 77){
            width = 77;
        }
        this.nameBg.setPreferredSize(cc.size(width, 17));
    }
});