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
        this._super(cc.size(260, 80));

        var titleLabel = new cc.LabelTTF(title, cc.res.font.Roboto_CondensedBold, 24);
        titleLabel.setAnchorPoint(cc.p(0.0, 0.5));
        titleLabel.setPosition(cc.p(18, 48));
        this.addChild(titleLabel);
        this.titleLabel = titleLabel;

        var statusLabel = new cc.LabelTTF("status", cc.res.font.Roboto_Condensed, 20);
        statusLabel.setAnchorPoint(cc.p(0.0, 0.5));
        statusLabel.setPosition(cc.p(18, 23));
        this.addChild(statusLabel);
        this.statusLabel = statusLabel;
    },
    setStatus : function (status) {
        this.statusLabel.setString(status);
    },
    select : function (isForce, ext) {
        this.titleLabel.setColor(cc.color("#ffffff"));
        this.statusLabel.setColor(cc.color("#ffffff"));
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
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Hoạt động");
        this.initWithSize(cc.size(960, 620));
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
        selectSprite.setPosition(246, 100);
        this.addChild(selectSprite);

        var mToggle = new ToggleNodeGroup();
        this.mToggle = mToggle;
        var thiz = this;
        this.addChild(mToggle);
        for(var i = 0; i<s_activity_tab_name.length; i++){
            (function () {
                var mNode = allLayer[i];

                var tab = new ActivityTab(s_activity_tab_name[i]);
                tab.setPosition(thiz._marginLeft + tab.getContentSize().width/2, thiz._marginBottom + 480 - i * 80);
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

    onEnter : function () {
        this._super();
        this.mToggle.selectItem(0);
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