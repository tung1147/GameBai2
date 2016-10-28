/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var InviteDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Mời chơi");
        this.initWithSize(cc.size(680, 450));
        this.userSelected = [];
        this.allUsers = [];

        var top = this.dialogNode.getContentSize().height - 178.0;
        var bottom = 200.0;

        var listItem = new newui.TableView(cc.size(680.0, top - bottom), 2);
        listItem.setScrollBarEnabled(false);
        listItem.setMargin(20,20,0,0);
        listItem.setPadding(20.0);
        listItem.setAnchorPoint(cc.p(0.5, 0.5));
        listItem.setPosition(this.dialogNode.getContentSize().width/2, (top + bottom)/2);
        this.dialogNode.addChild(listItem);
        this.listItem = listItem;

        var inviteAllBt = new ccui.Button("dialog-inviteAllBt.png","","", ccui.Widget.PLIST_TEXTURE);
        inviteAllBt.setPosition(this.dialogNode.getContentSize().width/2 - 110, 148);
        this.dialogNode.addChild(inviteAllBt);

        var inviteBt = new ccui.Button("dialog-inviteBt.png","","", ccui.Widget.PLIST_TEXTURE);
        inviteBt.setPosition(this.dialogNode.getContentSize().width/2 + 110, inviteAllBt.y);
        this.dialogNode.addChild(inviteBt);

        var thiz = this;
        inviteAllBt.addClickEventListener(function () {
            thiz.sendInviteAll();
        });
        inviteBt.addClickEventListener(function () {
            thiz.sendInvite();
        });

        LobbyClient.getInstance().send({command:"getChannelUsers"});
        LobbyClient.getInstance().addListener("getChannelUsers",this.onGetChannelUser,this);
    },

    onGetChannelUser: function (command,data){
        var users = data["users"];
        this.allUsers = [];
        for (var i = 0;i<users.length;i++){
            this.addItem(users[i]["username"],users[i]["gold"]);
            this.allUsers.push(users[i]["username"]);
        }
    },

    addItem : function (username, gold) {
        var bg1 = ccui.Scale9Sprite.createWithSpriteFrameName("dialob-invite-bg1.png", cc.rect(14,14,4,4));
        bg1.setPreferredSize(cc.size(286, 80));
        bg1.setPosition(bg1.getContentSize().width/2, bg1.getContentSize().height/2);
        bg1.visible = true;

        var bg2 = ccui.Scale9Sprite.createWithSpriteFrameName("dialob-invite-bg2.png", cc.rect(14,14,4,4));
        bg2.setPreferredSize(bg1.getPreferredSize());
        bg2.setPosition(bg1.getPosition());
        bg2.visible = false;

        var container = new ccui.Widget();
        container.setContentSize(bg1.getContentSize());
        container.addChild(bg1);
        container.addChild(bg2);
        container.setTouchEnabled(true);

        var avt = UserAvatar.createAvatar();
        avt.setScale(0.7);
        avt.setPosition(40, container.getContentSize().height/2);
        container.addChild(avt);

        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, username, cc.TEXT_ALIGNMENT_LEFT);
        userLabel.setLineBreakWithoutSpace(true);
        userLabel.setDimensions(200, userLabel.getLineHeight());
        userLabel.setAnchorPoint(cc.p(0.0, 0.5));
        userLabel.setPosition(80, container.getContentSize().height/2 + 15);
        container.addChild(userLabel);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, cc.Global.NumberFormat1(gold) + " V");
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setPosition(userLabel.x, container.getContentSize().height/2 - 15);
        container.addChild(goldLabel);

        var thiz = this;
        container.addClickEventListener(function () {
            if(bg1.visible){ //select
                bg1.visible = false;
                bg2.visible = true;
                thiz.selectUser(username);
            }
            else{ //unselect
                bg1.visible = true;
                bg2.visible = false;
                thiz.unSelectUser(username);
            }
        });

        this.listItem.pushItem(container);
    },
    selectUser : function (username) {
        for(var i=0;i<this.userSelected.length;i++){
            if(this.userSelected == username){
                return;
            }
        }
        this.userSelected.push(username);
    },
    unSelectUser : function (username) {
        for(var i=0;i<this.userSelected.length;i++){
            if(this.userSelected == username){
                this.userSelected.splice(i,1);
                return;
            }
        }
    },
    sendInviteAll : function () {
        if (this.allUsers.length > 0)
            LobbyClient.getInstance().send({command: "inviteUser",users: this.allUsers});
        this.hide();
    },
    sendInvite : function () {
        if (this.userSelected.length > 0)
            LobbyClient.getInstance().send({command: "inviteUser",users: this.userSelected});
        this.hide();
    },
    onExit: function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});

var RecvInviteDialog = (function(){
    var instance = null;
    var RecvInviteClass = Dialog.extend({
        ctor: function () {
            this._super();
            this.title.setString("Mời chơi");
            this.initWithSize(cc.size(550, 350));

            var messageNode = new cc.Node();
            this.dialogNode.addChild(messageNode, 10);
            this.messageNode = messageNode;
        },
        setInfo: function (username, gameName, betting) {
            this.messageNode.removeAllChildren(true);
            if (username) {
                this.setInfoWithSender(username, gameName, betting);
            }
            else {
                this.setInfoWithoutSender(gameName, betting);
            }
        },
        setRoomInfo: function (room, host, port) {
            this.room = room;
            this.host = host;
            this.port = port;
        },
        setInfoWithSender: function (username, gameName, betting) {
            var label1 = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Bạn nhận được lời mời chơi từ");
            label1.setPosition(this.dialogNode.getContentSize().width / 2, 310);
            this.messageNode.addChild(label1);

            var label2 = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, username);
            label2.setColor(cc.color("#017cee"));
            label2.setPosition(this.dialogNode.getContentSize().width / 2, 275);
            this.messageNode.addChild(label2);

            var label3 = new ccui.RichText();
            var str = "Vào chơi phòng <font color='#ffde00'>" + gameName + "</font> <font color='#ffde00'>  " + cc.Global.NumberFormat1(betting) + " V</font>";
            label3.initWithXML("<font face='" + cc.res.font.Roboto_Condensed + "' size='25'>" + str + "</font>", null);
            label3.setPosition(this.dialogNode.getContentSize().width / 2, 240);
            this.messageNode.addChild(label3);
        },
        setInfoWithoutSender: function (gameName, betting) {
            var label1 = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Bạn nhận được lời mời chơi");
            label1.setPosition(this.dialogNode.getContentSize().width / 2, 310);
            this.messageNode.addChild(label1);

            var label3 = new ccui.RichText();
            var str = "từ phòng <font color='#ffde00'>" + gameName + "</font> <font color='#ffde00'>" + cc.Global.NumberFormat1(betting) + " V</font>";
            label3.initWithXML("<font face='" + cc.res.font.Roboto_Condensed + "' size='25'>" + str + "</font>", null);
            label3.setPosition(this.dialogNode.getContentSize().width / 2, 275);
            this.messageNode.addChild(label3);
        },
        cancelButtonHandler: function () {
            this.hide();
        },
        okButtonHandler: function () {
            PlayerMe.SFS.roomId = this.room;
            SmartfoxClient.getInstance().findAndJoinRoom(this.host, this.port);
            LoadingDialog.getInstance().show("Đang tìm phòng chơi");
            this.hide();
        }
    });

    RecvInviteClass.getInstance = function() {
        if (!instance) {
            instance = new RecvInviteClass();
            instance.retain();
        }
        return instance;
    };

    return RecvInviteClass;
})();