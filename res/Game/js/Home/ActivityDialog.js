/**
 * Created by Quyet Nguyen on 3/21/2017.
 */

var s_activity_tab_name = s_activity_tab_name || [
    "ĐIỂM DANH",
    "TÍCH LŨY ĐĂNG NHẬP",
    "ONLINE NHẬN QUÀ",
    "NHIỆM VỤ",
    "SỰ KIỆN"
];

var ActivityTab = ToggleNodeItem.extend({
    ctor : function (title) {
        this._super(cc.size(260, 60));

        var titleLabel = new cc.LabelTTF(title, cc.res.font.Roboto_CondensedBold, 18);
        titleLabel.setAnchorPoint(cc.p(0.0, 0.5));
        titleLabel.setPosition(cc.p(18, this.getContentSize().height / 2 + 10));
        this.addChild(titleLabel);
        this.titleLabel = titleLabel;

        var statusLabel = new cc.LabelTTF("status", cc.res.font.Roboto_Condensed, 16);
        statusLabel.setAnchorPoint(cc.p(0.0, 0.5));
        statusLabel.setPosition(cc.p(titleLabel.x, this.getContentSize().height / 2 - 10));
        this.addChild(statusLabel);
        this.statusLabel = statusLabel;
    },
    setStatus : function (status) {
        this.statusLabel.setString(status);
    },
    select : function (isForce, ext) {
        this.titleLabel.setColor(cc.color("#682e2e"));
        this.statusLabel.setColor(cc.color("#682e2e"));
        this._super(isForce, ext);
    },
    unSelect : function (isForce, ext) {
        this.titleLabel.setColor(cc.color("#4c6080"));
        this.statusLabel.setColor(cc.color("#4c6080"));
        this._super(isForce, ext);
    }
});

var ActivityDialog = Dialog.extend({
    ctor : function () {
        this._super();
        LobbyClient.getInstance().addListener("fetchUserMissionInfo", this._onRecvActivityStatus, this);

        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Hoạt động");
        this.initWithSize(cc.size(918, 578));
        this._initView();
    },

    _initView : function () {
        var allLayer = [
            new ActivityDiemDanhLayer(),
            new ActivityLoginLayer(),
            new ActivityOnlineLayer(),
            new ActivityQuestLayer(),
            new ActivityEventLayer()
        ];

        for(var i=0;i<allLayer.length;i++){
            // allLayer[i].setAnchorPoint(cc.p(0,0));
            // allLayer[i].setPosition(cc.p(this._marginLeft, this._marginBottom));
            this.addChild(allLayer[i]);
        }

        var selectSprite = new cc.Sprite("#activiti_tab_2.png");
        selectSprite.setPosition(210, 100);
        this.addChild(selectSprite);

        var mToggle = new ToggleNodeGroup();
        this.mToggle = mToggle;
        this.allTab = [];
        var thiz = this;
        this.addChild(mToggle);
        for(var i = 0; i<s_activity_tab_name.length; i++){
            (function () {
                var mNode = allLayer[i];

                var tab = new ActivityTab(s_activity_tab_name[i]);
                thiz.allTab.push(tab);
                tab.setPosition(thiz._marginLeft + tab.getContentSize().width/2, thiz._marginBottom + 480 - i * 60);
                tab.onSelect = function (isForce) {
                    mNode.setVisible(true);
                    if(isForce){
                        selectSprite.y = tab.y;
                    }
                    else{
                        selectSprite.stopAllActions();
                        selectSprite.runAction(new cc.MoveTo(0.1, cc.p(selectSprite.x, tab.y)));
                    }
                };

                tab.onUnSelect = function () {
                    mNode.setVisible(false);
                };
                mToggle.addItem(tab);
            })();
        }
    },

    _onRecvActivityStatus : function (cmd, data) {
        var type = data["data"]["typeMission"];
        var info = data["data"]["shortInfo"];
        if(type == 0){
            this.allTab[0].setStatus(info);
        }
        else if(type == 2){
            this.allTab[1].setStatus(info);
        }
        else if(type == 3){
            this.allTab[2].setStatus(info);
        }
        else if(type == 1){
            this.allTab[3].setStatus(info);
        }
    },

    onEnter : function () {
        this._super();
        this.mToggle.selectItem(0);

        cc.Label.c

        for(var i=0;i<this.allTab.length;i++){
            this.allTab[i].setStatus("");
        }

        LobbyClient.getInstance().send({command : "fetchUserMissionInfo", typeMission : 0});
        LobbyClient.getInstance().send({command : "fetchUserMissionInfo", typeMission : 1});
        LobbyClient.getInstance().send({command : "fetchUserMissionInfo", typeMission : 2});
        LobbyClient.getInstance().send({command : "fetchUserMissionInfo", typeMission : 3});
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});

var ActivityNotificationNode = cc.Node.extend({
    ctor : function () {
        this._super();
        LobbyClient.getInstance().addListener("updateLandmarkCompleted", this.onUpdateNotification, this);

        // newsCountBg = Sprite::createWithSpriteFrameName("home-news-count.png");
        // newsCountBg->setPosition(newsCountBg->getContentSize().width / 2, newsCountBg->getContentSize().height / 2);
        // this->setContentSize(newsCountBg->getContentSize());
        // this->addChild(newsCountBg);
        //
        // newsCount = Label::createWithBMFont(Roboto_CondensedBold_25, "1");
        // newsCount->setPosition(newsCountBg->getContentSize() / 2);
        // newsCount->setColor(Color3B(104, 46, 46));
        // newsCountBg->addChild(newsCount, 1);
        //
        // newsCountBg->setVisible(false);
    },

    onUpdateNotification : function (cmd, message) {
        var count = message["data"]["count"];
        if (count > 0){

        }
        else{

        }
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});