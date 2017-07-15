/**
 * Created by Quyet Nguyen on 3/21/2017.
 */

var _activity_request_reward = function (itemId) {
    var request = {
        command : "getBonusMission",
        landmarkId : itemId
    };
    LobbyClient.getInstance().send(request);
};

var ActivityDiemDanhLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        LobbyClient.getInstance().addListener("fetchAttendanceLandmark", this._onRecvData, this);

        var mNode = new cc.Node();
        this.addChild(mNode);
        this.mNode = mNode;

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "Điểm danh");
        nameLabel.setColor(cc.color("#ffde00"));
        nameLabel.setAnchorPoint(cc.p(0.0, 0.5));
        nameLabel.setPosition(356, 595);
        mNode.addChild(nameLabel);

        var contentLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18,cc.Global.getStringRes()["Mission"]["diemdanhContent"],cc.TEXT_ALIGNMENT_LEFT, 640);
        contentLabel.setColor(cc.color("#ffffff"));
        contentLabel.setAnchorPoint(cc.p(0.0, 1.0));
        contentLabel.setPosition(356, 570);
        mNode.addChild(contentLabel);

        var dateLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_16, "Ngày");
        dateLabel.setColor(cc.color("#4d6181"));
        dateLabel.setPosition(394, 453);
        mNode.addChild(dateLabel);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_16, "Phần thưởng");
        rewardLabel.setColor(cc.color("#4d6181"));
        rewardLabel.setPosition(529, 453);
        mNode.addChild(rewardLabel);

        var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_16, "Trạng thái");
        statusLabel.setAnchorPoint(cc.p(0.0, 0.5));
        statusLabel.setColor(cc.color("#4d6181"));
        statusLabel.setPosition(664, 453);
        mNode.addChild(statusLabel);

        var listItem = new newui.TableView(cc.size(641, 335), 1);
        listItem.setPosition(cc.p(355, 98));
        listItem.setMargin(0,10,0,0);
        mNode.addChild(listItem);
        this.listItem = listItem;

        // for(var i=0;i<20; i++){
        //     this.addItem("date", "reward", 1);
        // }
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },

    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.mNode.visible = false;

            LobbyClient.getInstance().send({command : "fetchAttendanceLandmark"});
        }
    },

    _onRecvData : function (cmd, data) {
        var items = data["data"]["landmarks"];
        if(items.length > 0){
            this.mNode.visible = true;
            this.listItem.removeAllItems();

            for(var i=0;i<items.length;i++){
                var itemId = items[i]["id"];
                var name = items[i]["name"];
                var reward = items[i]["prize"];
                var status = items[i]["status"];

                if(status == 2){//done
                    var result = 0;
                }
                else if(status == 3){//completed
                    var result = 1;
                }
                else{
                    var result = items[i]["statusDesc"];
                    if(!result){
                        result = "Chưa hoàn thành";
                    }
                }

                this.addItem(name,reward,result,itemId);
            }
        }
    },

    addItem : function(date, reward, status, itemId){
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.listItem.getContentSize().width, 50));
        this.listItem.pushItem(container);
        if(this.listItem.size() % 2){
            var bg = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg.setPreferredSize(container.getContentSize());
            bg.setAnchorPoint(cc.p(0,0));
            container.addChild(bg);
        }

        var dateBg = new cc.Sprite("#activity_bg_1.png");
        dateBg.setPosition(40, container.getContentSize().height/2);
        container.addChild(dateBg);

        var dateLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, date);
        dateLabel.setColor(cc.color("#ffde00"));
        dateLabel.setPosition(dateBg.getPosition());
        container.addChild(dateLabel);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, reward);
        rewardLabel.setColor(cc.color("#ffde00"));
        rewardLabel.setPosition(175, dateLabel.y);
        container.addChild(rewardLabel);

        if(status === 0 || status === 1){
            var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Đã nhận");
            statusLabel.setColor(cc.color("#ffde00"));
            statusLabel.setAnchorPoint(cc.p(0.0, 0.5));
            statusLabel.setPosition(310, dateLabel.y);
            container.addChild(statusLabel);

            if(status === 1){
                statusLabel.visible = false;

                var okButton = new ccui.Button("activity_button_1.png", "", "", ccui.Widget.PLIST_TEXTURE);
                okButton.setAnchorPoint(cc.p(0.0, 0.5));
                okButton.setPosition(310, dateLabel.y);
                okButton.setZoomScale(0.01);
                container.addChild(okButton);
                okButton.addClickEventListener(function () {
                    statusLabel.visible = true;
                    okButton.visible = false;
                    _activity_request_reward(itemId);
                });
            }
        }
        else{
            var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, status);
            statusLabel.setColor(cc.color("#95c8e6"));
            statusLabel.setAnchorPoint(cc.p(0.0, 0.5));
            statusLabel.setPosition(310, dateLabel.y);
            container.addChild(statusLabel);
        }
    }
});

var ActivityLoginLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        LobbyClient.getInstance().addListener("fetchLoginAccumulationLandmark", this._onRecvData, this);

        var mNode = new cc.Node();
        this.addChild(mNode);
        this.mNode = mNode;

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "Tích lũy đăng nhập");
        nameLabel.setColor(cc.color("#ffde00"));
        nameLabel.setAnchorPoint(cc.p(0.0, 0.5));
        nameLabel.setPosition(356, 595);
        mNode.addChild(nameLabel);

        var contentLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, cc.Global.getStringRes()["Mission"]["loginContent"], cc.TEXT_ALIGNMENT_LEFT, 640);
        contentLabel.setColor(cc.color("#ffffff"));
        contentLabel.setAnchorPoint(cc.p(0.0, 1.0));
        contentLabel.setPosition(356, 570);
        mNode.addChild(contentLabel);

        var dateLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_16, "Ngày");
        dateLabel.setColor(cc.color("#4d6181"));
        dateLabel.setPosition(394, 505);
        mNode.addChild(dateLabel);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_16, "Phần thưởng");
        rewardLabel.setColor(cc.color("#4d6181"));
        rewardLabel.setPosition(529, 505);
        mNode.addChild(rewardLabel);

        var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_16, "Trạng thái");
        statusLabel.setAnchorPoint(cc.p(0.0, 0.5));
        statusLabel.setColor(cc.color("#4d6181"));
        statusLabel.setPosition(664, 505);
        mNode.addChild(statusLabel);

        var listItem = new newui.TableView(cc.size(641, 390), 1);
        listItem.setPosition(cc.p(355, 98));
        listItem.setMargin(0,10,0,0);
        mNode.addChild(listItem);
        this.listItem = listItem;

        // for(var i=0;i<20; i++){
        //     this.addItem("date", "reward", 1);
        // }
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },

    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.mNode.visible = false;
            LobbyClient.getInstance().send({command : "fetchLoginAccumulationLandmark"});
        }
    },

    _onRecvData : function (cmd, data) {
        var items = data["data"]["landmarks"];
        if(items.length > 0){
            this.mNode.visible = true;
            this.listItem.removeAllItems();

            for(var i=0;i<items.length;i++){
                var itemId = items[i]["id"];
                var name = items[i]["name"];
                var reward = items[i]["prize"];
                var status = items[i]["status"];

                if(status == 2){//done
                    var result = 0;
                }
                else if(status == 3){//completed
                    var result = 1;
                }
                else{
                    var result = items[i]["statusDesc"];
                    if(!result){
                        result = "Chưa hoàn thành";
                    }
                }

                this.addItem(name,reward,result,itemId);
            }
        }
    },

    addItem : function(date, reward, status, itemId){
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.listItem.getContentSize().width, 50));
        this.listItem.pushItem(container);
        if(this.listItem.size() % 2){
            var bg = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg.setPreferredSize(container.getContentSize());
            bg.setAnchorPoint(cc.p(0,0));
            container.addChild(bg);
        }

        var dateBg = new cc.Sprite("#activity_bg_1.png");
        dateBg.setPosition(40, container.getContentSize().height/2);
        container.addChild(dateBg);

        var dateLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, date);
        dateLabel.setColor(cc.color("#ffde00"));
        dateLabel.setPosition(dateBg.getPosition());
        container.addChild(dateLabel);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, reward);
        rewardLabel.setColor(cc.color("#ffde00"));
        rewardLabel.setPosition(175, dateLabel.y);
        container.addChild(rewardLabel);

        if(status === 0 || status === 1){
            var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Đã nhận");
            statusLabel.setColor(cc.color("#ffde00"));
            statusLabel.setAnchorPoint(cc.p(0.0, 0.5));
            statusLabel.setPosition(310, dateLabel.y);
            container.addChild(statusLabel);

            if(status === 1){
                statusLabel.visible = false;

                var okButton = new ccui.Button("activity_button_1.png", "", "", ccui.Widget.PLIST_TEXTURE);
                okButton.setAnchorPoint(cc.p(0.0, 0.5));
                okButton.setPosition(310, dateLabel.y);
                okButton.setZoomScale(0.01);
                container.addChild(okButton);
                okButton.addClickEventListener(function () {
                    statusLabel.visible = true;
                    okButton.visible = false;
                    _activity_request_reward(itemId);
                });
            }
        }
        else{
            var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, status);
            statusLabel.setColor(cc.color("#95c8e6"));
            statusLabel.setAnchorPoint(cc.p(0.0, 0.5));
            statusLabel.setPosition(310, dateLabel.y);
            container.addChild(statusLabel);
        }
    }
});

var ActivityOnlineLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        LobbyClient.getInstance().addListener("fetchPlayingBonusMilestone", this._onRecvData, this);

        var mNode = new cc.Node();
        this.addChild(mNode);
        this.mNode = mNode;

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "Online nhận quà");
        nameLabel.setColor(cc.color("#ffde00"));
        nameLabel.setAnchorPoint(cc.p(0.0, 0.5));
        nameLabel.setPosition(356, 595);
        mNode.addChild(nameLabel);

        var contentLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, cc.Global.getStringRes()["Mission"]["onlineContent"], cc.TEXT_ALIGNMENT_LEFT, 640);
        contentLabel.setColor(cc.color("#ffffff"));
        contentLabel.setAnchorPoint(cc.p(0.0, 1.0));
        contentLabel.setPosition(356, 570);
        mNode.addChild(contentLabel);

        var bottom1 = contentLabel.y - contentLabel.getContentSize().height - 20;

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_16, "Thời gian");
        timeLabel.setColor(cc.color("#4d6181"));
        timeLabel.setPosition(394, bottom1);
        mNode.addChild(timeLabel);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_16, "Phần thưởng");
        rewardLabel.setColor(cc.color("#4d6181"));
        rewardLabel.setPosition(529, bottom1);
        mNode.addChild(rewardLabel);

        var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_16, "Trạng thái");
        statusLabel.setAnchorPoint(cc.p(0.0, 0.5));
        statusLabel.setColor(cc.color("#4d6181"));
        statusLabel.setPosition(664, bottom1);
        mNode.addChild(statusLabel);

        var top = bottom1 - 20;
        var bottom2 = 98;

        var listItem = new newui.TableView(cc.size(641, top - bottom2), 1);
        listItem.setPosition(cc.p(355, bottom2));
        listItem.setMargin(0,10,0,0);
        mNode.addChild(listItem);
        this.listItem = listItem;

        // for(var i=0;i<20; i++){
        //     this.addItem("date", "reward", 1);
        // }
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },

    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.mNode.visible = false;
            LobbyClient.getInstance().send({command : "fetchPlayingBonusMilestone"});
        }
    },

    _onRecvData : function (cmd, data) {
        var items = data["data"]["milestones"];
        if(items.length > 0){
            this.mNode.visible = true;
            this.listItem.removeAllItems();

            for(var i=0;i<items.length;i++){
                var itemId = items[i]["id"];
                var name = items[i]["name"];
                var reward = items[i]["prize"];
                var status = items[i]["status"];

                if(status == 2){//done
                    var result = 0;
                }
                else if(status == 3){//completed
                    var result = 1;
                }
                else{
                    var result = items[i]["statusDesc"];
                    if(!result){
                        result = "Chưa hoàn thành";
                    }
                }

                this.addItem(name,reward,result,itemId);
            }
        }
    },

    addItem : function(time, reward, status, itemId){
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.listItem.getContentSize().width, 50));
        this.listItem.pushItem(container);
        if(this.listItem.size() % 2){
            var bg = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg.setPreferredSize(container.getContentSize());
            bg.setAnchorPoint(cc.p(0,0));
            container.addChild(bg);
        }

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, time);
        timeLabel.setColor(cc.color("#95c8e6"));
        timeLabel.setPosition(40, container.getContentSize().height/2);
        container.addChild(timeLabel);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, reward);
        rewardLabel.setColor(cc.color("#ffde00"));
        rewardLabel.setPosition(175, timeLabel.y);
        container.addChild(rewardLabel);

        if(status === 0 || status === 1){
            var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Đã nhận");
            statusLabel.setColor(cc.color("#ffde00"));
            statusLabel.setAnchorPoint(cc.p(0.0, 0.5));
            statusLabel.setPosition(310, timeLabel.y);
            container.addChild(statusLabel);

            if(status === 1){
                statusLabel.visible = false;

                var okButton = new ccui.Button("activity_button_1.png", "", "", ccui.Widget.PLIST_TEXTURE);
                okButton.setAnchorPoint(cc.p(0.0, 0.5));
                okButton.setPosition(statusLabel.getPosition());
                okButton.setZoomScale(0.01);
                container.addChild(okButton);
                okButton.addClickEventListener(function () {
                    statusLabel.visible = true;
                    okButton.visible = false;
                    var request = {
                        command : "acquireReward",
                        id : itemId
                    };
                    LobbyClient.getInstance().send(request);
                });
            }
        }
        else{
            var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, status);
            statusLabel.setColor(cc.color("#95c8e6"));
            statusLabel.setAnchorPoint(cc.p(0.0, 0.5));
            statusLabel.setPosition(310, timeLabel.y);
            container.addChild(statusLabel);
        }
    }
});

var ActivityQuestTab = ccui.Widget.extend({
    ctor : function (tabName) {
        this._super();

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_16, tabName);
        this.setContentSize(cc.size(nameLabel.getContentSize().width + 30, 44));
        nameLabel.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.addChild(nameLabel, 1);

        var selectSprite = new ccui.Scale9Sprite("activity_tab_1.png", cc.rect(10,10,4,4));
        selectSprite.setPreferredSize(this.getContentSize());
        selectSprite.setPosition(nameLabel.getPosition());
        this.addChild(selectSprite);

        this.nameLabel = nameLabel;
        this.selectSprite = selectSprite;
    },

    select : function (selected) {
        if(selected){
            this.selectSprite.visible = true;
            this.nameLabel.setColor(cc.color("#364865"));
            this.setTouchEnabled(false);
        }
        else{
            this.selectSprite.visible = false;
            this.nameLabel.setColor(cc.color("#69768d"));
            this.setTouchEnabled(true);
        }
    }
});

var ActivityQuestLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        LobbyClient.getInstance().addListener("fetchQuestGroup", this._onRecvGroupData, this);
        LobbyClient.getInstance().addListener("fetchMilestones", this._onRecvItemData, this);

        var mNode = new cc.Node();
        this.addChild(mNode);
        this.mNode = mNode;

        this.itemNode = new cc.Node();
        mNode.addChild(this.itemNode);

        var questLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_16, "Nhiệm vụ");
        questLabel.setAnchorPoint(cc.p(0.0, 0.5));
        questLabel.setColor(cc.color("#4d6181"));
        questLabel.setPosition(375, 527);
        this.itemNode.addChild(questLabel);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_16, "Phần thưởng");
        rewardLabel.setColor(cc.color("#4d6181"));
        rewardLabel.setPosition(704, 527);
        this.itemNode.addChild(rewardLabel);

        var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_16, "Trạng thái");
        statusLabel.setAnchorPoint(cc.p(0.0, 0.5));
        statusLabel.setColor(cc.color("#4d6181"));
        statusLabel.setPosition(789, 527);
        this.itemNode.addChild(statusLabel);

        var listItem = new newui.TableView(cc.size(641, 410), 1);
        listItem.setPosition(cc.p(355, 98));
        listItem.setMargin(0,10,0,0);
        this.itemNode.addChild(listItem);
        this.listItem = listItem;

        var groupList = new newui.TableView(cc.size(641, 75), 1);
        groupList.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        groupList.setPosition(cc.p(355, 549));
        groupList.setMargin(0,0,0,20);
       // groupList.setPadding(20);
        mNode.addChild(groupList);
        this.groupList = groupList;

        // for(var i=0;i<20; i++){
        //     this.addItem("date", "reward", 1);
        // }

        // for(var i=0;i<20;i++){
        //     this.addGroup("name", null);
        // }
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },

    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.mNode.visible = false;
            LobbyClient.getInstance().send({command : "fetchQuestGroup"});
        }
    },

    _onRecvGroupData : function (cmd, data) {
        this.groupItem = null;

        var items = data["data"]["userMissions"];
        if(items.length > 0){
            this.listItem.removeAllItems();
            this.groupList.removeAllItems();

            this.mNode.visible = true;
            this.itemNode.visible = false;
            for(var i=0;i<items.length;i++){
                var name = items[i]["name"];
                var groupId = items[i]["id"];
                this.addGroup(name, groupId);
            }
        }
    },

    _onRecvItemData : function (cmd, data) {
        var items = data["data"]["milestones"];
        if(items.length > 0){
            this.mNode.visible = true;
            this.itemNode.visible = true;
            this.listItem.removeAllItems();

            for(var i=0;i<items.length;i++){
                var itemId = items[i]["id"];
                var name = items[i]["name"];
                var reward = items[i]["prize"];
                var status = items[i]["status"];

                if(status == 2){//done
                    var result = 0;
                }
                else if(status == 3){//completed
                    var result = 1;
                }
                else{
                    var result = items[i]["statusDesc"];
                    if(!result){
                        result = "Chưa hoàn thành";
                    }
                }

                this.addItem(name,reward,result,itemId);
            }
        }
    },

    _selectGroup : function (groupItem, groupId) {
        if(this.groupItem){
            this.groupItem.select(false);
            this.groupItem = null;
        }
        groupItem.select(true);
        this.groupItem = groupItem;

        if(groupId){
            var request = {
                command : "fetchMilestones",
                name : groupId
            };
            LobbyClient.getInstance().send(request);
            this.itemNode.visible = false;
        }
    },

    addGroup : function (name, groupId) {
        var thiz = this;

        var groupItem = new ActivityQuestTab(name);
        this.groupList.pushItem(groupItem);
        groupItem.select(false);
        groupItem.addClickEventListener(function () {
            thiz._selectGroup(groupItem, groupId);
        });

        if(this.groupList.size() == 1){
            this.groupItem = null;
            thiz._selectGroup(groupItem, groupId);
        }
    },

    addItem : function(name, reward, status, itemId){
        var questLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, name, cc.TEXT_ALIGNMENT_LEFT, 245);
        var containerHeight = questLabel.getContentSize().height;
        if(containerHeight < 50){
            containerHeight = 50;
        }

        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.listItem.getContentSize().width, containerHeight));
        this.listItem.pushItem(container);
        if(this.listItem.size() % 2){
            var bg = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg.setPreferredSize(container.getContentSize());
            bg.setAnchorPoint(cc.p(0,0));
            container.addChild(bg);
        }


        questLabel.setColor(cc.color("#95c8e6"));
        questLabel.setAnchorPoint(cc.p(0.0, 0.5));
        questLabel.setPosition(20, container.getContentSize().height/2);
        container.addChild(questLabel);

        var rewardLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, reward);
        rewardLabel.setColor(cc.color("#ffde00"));
        rewardLabel.setPosition(350, questLabel.y);
        container.addChild(rewardLabel);

        if(status === 0 || status === 1){
            var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Đã nhận");
            statusLabel.setColor(cc.color("#ffde00"));
            statusLabel.setAnchorPoint(cc.p(0.0, 0.5));
            statusLabel.setPosition(435, questLabel.y);
            container.addChild(statusLabel);

            if(status === 1){
                statusLabel.visible = false;
                var okButton = new ccui.Button("activity_button_1.png", "", "", ccui.Widget.PLIST_TEXTURE);
                okButton.setAnchorPoint(cc.p(0.0, 0.5));
                okButton.setPosition(statusLabel.getPosition());
                okButton.setZoomScale(0.01);
                container.addChild(okButton);
                okButton.addClickEventListener(function () {
                    statusLabel.visible = true;
                    okButton.visible = false;
                    var request = {
                        command : "acquireReward",
                        id : itemId
                    };
                    LobbyClient.getInstance().send(request);
                });
            }
        }
        else{
            var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, status);
            statusLabel.setColor(cc.color("#95c8e6"));
            statusLabel.setAnchorPoint(cc.p(0.0, 0.5));
            statusLabel.setPosition(435, questLabel.y);
            container.addChild(statusLabel);
        }
    }
});

var ActivityEventLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        LobbyClient.getInstance().addListener("fetchEvents", this._onFetchEvents, this);
        LobbyClient.getInstance().addListener("fetchContentEvent", this._onFetchContentEvent, this);

        var itemNode = new cc.Node();
        this.addChild(itemNode);
        this.itemNode = itemNode;

        var eventLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "Sự kiện đang diễn ra");
        eventLabel.setColor(cc.color("#ffde00"));
        eventLabel.setAnchorPoint(cc.p(0.0, 0.5));
        eventLabel.setPosition(cc.p(353, 594));
        itemNode.addChild(eventLabel);

        var listItem = new newui.TableView(cc.size(640, 467), 1);
        listItem.setPosition(cc.p(353, 98));
        listItem.setMargin(0,10,0,0);
        listItem.setPadding(5);
        itemNode.addChild(listItem);
        this.listItem = listItem;

        var detailNode = new cc.Node();
        this.addChild(detailNode);
        this.detailNode = detailNode;

        var backBt = new ccui.Button("activity_backBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        backBt.setPosition(369, 595);
        detailNode.addChild(backBt);
        backBt.addClickEventListener(function () {
            thiz.detailBackButtonHandler();
        });

        var detailLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "Sự kiện đang diễn ra");
        detailLabel.setColor(cc.color("#ffde00"));
        detailLabel.setAnchorPoint(cc.p(0.0, 0.5));
        detailLabel.setPosition(cc.p(393, 594));
        detailNode.addChild(detailLabel);
        this.detailLabel = detailLabel;
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },

    setVisible : function (visible) {
        this._super(visible);
        if(visible){
            this.itemNode.setVisible(false);
            this.detailNode.setVisible(false);

            var detailContent = new ccui.WebView();
            detailContent.setContentSize(640, 450);
            detailContent.setAnchorPoint(cc.p(0,0));
            detailContent.setPosition(353, 118);
            detailContent.setScalesPageToFit(false);
            detailContent.setVisible(false);
            this.addChild(detailContent);
            this.detailContent = detailContent;

            //request
            LobbyClient.getInstance().send({command : "fetchEvents"});
        }
        else{
            if(this.detailContent){
                this.detailContent.removeFromParent(true);
                this.detailContent = null;
            }
        }
    },

    _onFetchEvents : function (cmd, data) {
        var events = data["data"];
        if(events){
            this.itemNode.setVisible(true);
            this.listItem.removeAllItems();

            for(var i=0;i<events.length; i++){
                this.addEventItem(events[i]["name"], events[i]["id"]);
            }
        }
    },

    _onFetchContentEvent : function (cmd, event) {
        var data = event["data"];
        if(this.currentEventId === data["id"]){
            this.detailContent.setVisible(true);
            this.detailContent.loadHTMLString(data["content"]);
        }
    },

    addEventItem : function(eventName, eventId){
        var container = new ccui.Widget();
        container.setContentSize(cc.size(640, 50));
        this.listItem.pushItem(container);

        var bg = new ccui.Scale9Sprite("activity_cell_bg_2.png", cc.rect(10,10,4,4));
        bg.setPreferredSize(container.getContentSize());
        bg.setPosition(320,25);
        container.addChild(bg);

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, eventName);
        nameLabel.setColor(cc.color("#77cbee"));
        nameLabel.setAnchorPoint(cc.p(0.0, 0.5));
        nameLabel.setPosition(cc.p(18, 25));
        container.addChild(nameLabel);

        var thiz = this;
        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            thiz.showEventDetail(eventName, eventId);
        });
    },
    
    showEventDetail : function (eventName, eventId) {
        this.detailLabel.setString(eventName);
        this.detailNode.setVisible(true);
        this.detailContent.setVisible(false);
        this.itemNode.setVisible(false);

        this.currentEventId = eventId;
        var request = {
            command : "fetchContentEvent",
            //product : "vbv",
            product : "c567",
            id : eventId
        };

        LobbyClient.getInstance().send(request);
    },

    detailBackButtonHandler : function () {
        this.detailNode.setVisible(false);
        this.detailContent.setVisible(false);
        this.itemNode.setVisible(true);
    }
});