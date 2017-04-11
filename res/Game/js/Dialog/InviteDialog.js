/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var InviteDialog = Dialog.extend({
    ctor: function () {
        this._super();
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Mời chơi");
        this.initWithSize(cc.size(680, 450));
        this.userSelected = [];
        this.allUsers = [];

        var top = this.getContentSize().height - 178.0;
        var bottom = 200.0;

        var listItem = new newui.TableView(cc.size(680.0, top - bottom), 2);
        listItem.setScrollBarEnabled(false);
        listItem.setMargin(20, 20, 0, 0);
        listItem.setPadding(20.0);
        listItem.setAnchorPoint(cc.p(0.5, 0.5));
        listItem.setPosition(this.getContentSize().width / 2, (top + bottom) / 2);
        this.addChild(listItem);
        this.listItem = listItem;

        var noPlayerLabel = new cc.LabelBMFont("Hiện tại không có người chơi trong sảnh, vui lòng chờ",
            cc.res.font.Roboto_Condensed_30, this.getContentSize().width - 100);
        noPlayerLabel.setVisible(false);
        noPlayerLabel.setPosition(listItem.getPosition());
        this.addChild(noPlayerLabel);
        this.noPlayerLabel = noPlayerLabel;

        var inviteAllBt = new ccui.Button("dialog-inviteAllBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        inviteAllBt.setPosition(this.getContentSize().width / 2 - 110, 148);
        this.addChild(inviteAllBt);

        var inviteBt = new ccui.Button("dialog-inviteBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        inviteBt.setPosition(this.getContentSize().width / 2 + 110, inviteAllBt.y);
        this.addChild(inviteBt);

        var thiz = this;
        inviteAllBt.addClickEventListener(function () {
            thiz.sendInviteAll();
        });
        inviteBt.addClickEventListener(function () {
            thiz.sendInvite();
        });

        LobbyClient.getInstance().send({command: "getChannelUsers"});
        LobbyClient.getInstance().addListener("getChannelUsers", this.onGetChannelUser, this);
    },

    onGetChannelUser: function (command, data) {
        var users = data["users"];
        this.allUsers = [];

        for (var i = 0; i < users.length; i++) {
            this.addItem(users[i]["avtUrl"], users[i]["username"], users[i]["gold"]);
            this.allUsers.push(users[i]["username"]);
        }

        this.noPlayerLabel.setVisible(users.length <= 0);
    },

    addItem: function (avt, username, gold) {
        var fullUsername = username;

        var bg1 = new ccui.Scale9Sprite("dialob-invite-bg1.png", cc.rect(14, 14, 4, 4));
        bg1.setPreferredSize(cc.size(286, 80));
        bg1.setPosition(bg1.getContentSize().width / 2, bg1.getContentSize().height / 2);
        bg1.visible = true;

        var bg2 = new ccui.Scale9Sprite("dialob-invite-bg2.png", cc.rect(14, 14, 4, 4));
        bg2.setPreferredSize(bg1.getPreferredSize());
        bg2.setPosition(bg1.getPosition());
        bg2.visible = false;

        var container = new ccui.Widget();
        container.setContentSize(bg1.getContentSize());
        container.addChild(bg1);
        container.addChild(bg2);
        container.setTouchEnabled(true);

        var avt = UserAvatar.createAvatarWithId(avt);
        avt.setScale(0.7);
        avt.setPosition(40, container.getContentSize().height / 2);
        container.addChild(avt);

        if (username.length > 3 && (username != PlayerMe.username)) {
            username = username.substring(0, username.length - 3) + "***";
        }
        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, username, cc.TEXT_ALIGNMENT_LEFT);
        userLabel.setLineBreakWithoutSpace(true);
        userLabel.setDimensions(200, userLabel.getLineHeight());
        userLabel.setAnchorPoint(cc.p(0.0, 0.5));
        userLabel.setPosition(80, container.getContentSize().height / 2 + 15);
        container.addChild(userLabel);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, cc.Global.NumberFormat1(gold) + " V");
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setPosition(userLabel.x, container.getContentSize().height / 2 - 15);
        container.addChild(goldLabel);

        var thiz = this;
        container.addClickEventListener(function () {
            if (bg1.visible) { //select
                bg1.visible = false;
                bg2.visible = true;
                thiz.selectUser(fullUsername);
            }
            else { //unselect
                bg1.visible = true;
                bg2.visible = false;
                thiz.unSelectUser(fullUsername);
            }
        });

        this.listItem.pushItem(container);
    },
    selectUser: function (username) {
        for (var i = 0; i < this.userSelected.length; i++) {
            if (this.userSelected == username) {
                return;
            }
        }
        this.userSelected.push(username);
    },
    unSelectUser: function (username) {
        for (var i = 0; i < this.userSelected.length; i++) {
            if (this.userSelected == username) {
                this.userSelected.splice(i, 1);
                return;
            }
        }
    },
    _requestInvite : function (users) {
        if (users.length > 0){
            LobbyClient.getInstance().send({command: "inviteUser", users: users});
        }
    },
    sendInviteAll: function () {
        this._requestInvite(this.allUsers);
        this.hide();
    },
    sendInvite: function () {
        this._requestInvite(this.userSelected);
        this.hide();
    },
    onExit: function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});


var RecvInviteDialog = (function () {
    var instance = null;
    var RecvInviteClass = Dialog.extend({
        ctor: function () {
            this._super();
            var thiz = this;
            this.okButton.visible = false;
            this.cancelButton.visible = false;

            this.initWithSize(cc.size(599, 278));
            this.title.setString("MỜI CHƠI");

            var ignoreBt = s_Dialog_Create_Button2(cc.size(180, 50), "TỪ CHỐI TẤT CẢ");
            ignoreBt.setPosition(this.getContentSize().width/2 - 200, 150);
            ignoreBt.setZoomScale(0.02);
            this.addChild(ignoreBt);
            ignoreBt.addClickEventListener(function () {
                thiz.ignoreButtonHandler();
            });

            var cancelBt = s_Dialog_Create_Button2(cc.size(180, 50), "HỦY BỎ");
            cancelBt.setPosition(this.getContentSize().width/2, 150);
            cancelBt.setZoomScale(0.02);
            this.addChild(cancelBt);
            cancelBt.addClickEventListener(function () {
                thiz.cancelButtonHandler();
            });

            var okButton = s_Dialog_Create_Button1(cc.size(180, 50), "ĐỒNG Ý");
            okButton.setPosition(this.getContentSize().width/2 + 200, 150);
            okButton.setZoomScale(0.02);
            this.addChild(okButton);
            okButton.addClickEventListener(function () {
                thiz.okButtonHandler();
            });

            var messageNode = new cc.Node();
            this.addChild(messageNode, 10);
            this.messageNode = messageNode;

            //this.setInfo(null, "gamename", 1000000);
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

        setRoomInfo: function (serverInfo) {
            this.serverInfo = serverInfo;
        },

        setInfoWithSender: function (username, gameName, betting) {
            if (username.length > 3 && (username != PlayerMe.username)) {
                username = username.substring(0, username.length - 3) + "***";
            }

            var msgLabel = new ccui.RichText();
            msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffffff"), 255, username + " ", cc.res.font.Roboto_CondensedBold, 18));
            msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffffff"), 255, "Mời bạn vào chơi phòng ", cc.res.font.Roboto_Condensed, 18));
            msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffffff"), 255, gameName + " ", cc.res.font.Roboto_Condensed, 18));
            msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffde00"), 255, cc.Global.NumberFormat1(betting) + " V", cc.res.font.Roboto_Condensed, 18));

            msgLabel.setPosition(this.getContentSize().width/2 , 248);
            this.messageNode.addChild(msgLabel);
        },

        setInfoWithoutSender: function (gameName, betting) {
            var msgLabel = new ccui.RichText();
            msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffffff"), 255, "Bạn nhận được lời mời chơi ", cc.res.font.Roboto_Condensed, 18));
            msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffffff"), 255, gameName + " ", cc.res.font.Roboto_Condensed, 18));
            msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffde00"), 255, cc.Global.NumberFormat1(betting) + " V", cc.res.font.Roboto_Condensed, 18));

            msgLabel.setPosition(this.getContentSize().width/2 , 248);
            this.messageNode.addChild(msgLabel);
        },
        cancelButtonHandler: function () {
            this.hide();
        },
        okButtonHandler: function () {
            PlayerMe.SFS.roomId = this.room;
            SmartfoxClient.getInstance().findAndJoinRoom(this.serverInfo, null, null, this.serverInfo.roomId);
            LoadingDialog.getInstance().show("Đang tìm phòng chơi");
            this.hide();
        },
        ignoreButtonHandler : function () {
            if(this._ignoreHandler){
                this._ignoreHandler();
            }
            this.hide();
        },
    });

    RecvInviteClass.getInstance = function () {
        if (!instance) {
            instance = new RecvInviteClass();
            instance.retain();
        }
        return instance;
    };

    return RecvInviteClass;
})();