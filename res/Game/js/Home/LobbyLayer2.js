/**
 * Created by Quyet Nguyen on 7/5/2016.
 */

var s_lobby_group_name = s_lobby_group_name || [
        "tapsu",
        "binhdan",
        "thieugia",
        "daigia",
        "vip"
    ];

var LobbyLayer = cc.Node.extend({
    ctor: function () {
        this._super();
        LobbyClient.getInstance().addListener("updateAll", this.onUpdateAll, this);
        LobbyClient.getInstance().addListener("updatedJar", this.onUpdateJar, this);
        LobbyClient.getInstance().addListener("updateUserCount", this.onUpdateUserCount, this);
        LobbyClient.getInstance().addListener("inviteUser", this.onInviteReceived, this);

        //
        this.initListRoom();
        this.initListRoomXocDia();
    },

    initListRoomXocDia: function () {
        var roomXocDiaNode = new cc.Node();
        this.addChild(roomXocDiaNode);
        this.roomXocDiaNode = roomXocDiaNode;

        var left = 310.0 * cc.winSize.screenScale;
        var right = cc.winSize.width - 10.0 * cc.winSize.screenScale;
        var bottom = 144.0;
        var top = 590.0;

        var listGame = new newui.TableView(cc.size(right - left, top - bottom), 1);
        listGame.setPadding(20);
        listGame.setMargin(10, 10, 0, 0);

        listGame.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listGame.setBounceEnabled(true);
        listGame.setScrollBarEnabled(true);
        listGame.setPosition(left, bottom);
        roomXocDiaNode.addChild(listGame, 1);
        this.listRoomXocDia = listGame;
    },

    initListRoom: function () {
        var gameNav = new cc.Sprite("#home-gameNav-bg.png");
        gameNav.setPosition(300 + gameNav.width / 2 * cc.winSize.screenScale, 175);
        gameNav.setScale(cc.winSize.screenScale);
        this.addChild(gameNav);

        var roomNode = new cc.Node();
        this.addChild(roomNode);
        this.roomNode = roomNode;

        var left = 300.0 * cc.winSize.screenScale;
        var right = cc.winSize.width - 58.0 * cc.winSize.screenScale;
        var bottom = 215.0;
        var top = 590.0;
        var dx = (right - left) / 5;
        var x = left + dx / 2;
        var y = 181;

        var thiz = this;
        var mToggle = new ToggleNodeGroup();
        roomNode.addChild(mToggle);
        this.mToggle = mToggle;
        this.listGame = [];

        var huThuongBg = new ccui.Scale9Sprite("bacayhuthuong_bg.png", cc.rect(15, 15, 4, 4));
        huThuongBg.setPreferredSize(cc.size(300, 42));
        huThuongBg.setPosition(cc.winSize.width / 2, 630);
        huThuongBg.visible = false;
        this.addChild(huThuongBg);
        this.huThuong = huThuongBg;

        var huThuongLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "HŨ MẬU BINH: ");
        huThuongLabel.setScale(0.8);
        huThuongLabel.setAnchorPoint(cc.p(1.0, 0.5));
        huThuongLabel.setPosition(huThuongBg.width / 2 - 10, huThuongBg.height / 2);
        huThuongLabel.setColor(cc.color("#c1ceff"));
        huThuongBg.addChild(huThuongLabel);
        this.huThuongLabel = huThuongLabel;

        var huThuongValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "");
        huThuongValueLabel.setScale(0.8);
        huThuongValueLabel.setColor(cc.color("#ffde00"));
        huThuongValueLabel.setAnchorPoint(cc.p(0.0, 0.5));
        huThuongValueLabel.setPosition(huThuongBg.width / 2 + 20, huThuongBg.height / 2);
        huThuongBg.addChild(huThuongValueLabel);
        this.huThuongValueLabel = huThuongValueLabel;

        var selectedSprite = new ccui.Scale9Sprite("lobby-tabSelected.png", cc.rect(4, 4, 4, 4));
        selectedSprite.setPreferredSize(cc.size(dx, 40));
        roomNode.addChild(selectedSprite, 1);

        for (var i = 0; i < s_lobby_group_name.length; i++) {
            (function () {
                var icon1 = new cc.Sprite("#lobby-tab" + (i + 1) + ".png");
                icon1.setPosition(x, y);
                icon1.setScale(cc.winSize.screenScale);
                roomNode.addChild(icon1);

                var icon2 = new cc.Sprite("#lobby-tabSelected" + (i + 1) + ".png");
                icon2.setPosition(icon1.getPosition());
                icon2.setScale(cc.winSize.screenScale);
                roomNode.addChild(icon2);

                var listGame = new newui.TableView(cc.size(right - left, top - bottom - 40), 4);
                listGame.setDirection(ccui.ScrollView.DIR_VERTICAL);
                listGame.setPadding(40);
                listGame.setBounceEnabled(true);
                listGame.setMargin(10, 10, 0, 0);
                listGame.setScrollBarEnabled(true);
                listGame.setPosition(left - 20, bottom + 15);
                listGame.groupName = s_lobby_group_name[i];
                listGame.idx = i;
                roomNode.addChild(listGame, 1);
                thiz.listGame.push(listGame);

                var toggleItem = new ToggleNodeItem(cc.size(dx, 58.0));
                toggleItem.setPosition(icon1.x, icon1.y - icon1.getContentSize().height / 2 + toggleItem.getContentSize().height / 2);
                toggleItem.onSelect = function (isForce, byUpdateAll) {
                    if (byUpdateAll) {
                        return;
                    }

                    icon1.visible = false;
                    icon2.visible = true;
                    listGame.visible = true;
                    selectedSprite.stopAllActions();
                    if (isForce) {
                        selectedSprite.setPosition(toggleItem.getPosition());
                    }
                    else {
                        selectedSprite.runAction(new cc.MoveTo(0.1, toggleItem.getPosition()));
                    }

                    if (!isForce) {
                        var gameId = s_games_chanel_id[PlayerMe.gameType];
                        LobbyClient.getInstance().subscribe(gameId, listGame.groupName);
                    }
                };
                toggleItem.onUnSelect = function () {
                    icon1.visible = true;
                    icon2.visible = false;
                    listGame.visible = false;
                };
                mToggle.addItem(toggleItem);
                x += dx;
            })();
        }
    },

    addRoomCell: function (roomList, serverId, roomId, betting, minMoney, userCount, metadata) {
        if (this.updateRoomCell(roomList, serverId, roomId, userCount, metadata)) {
            return;
        }

        if (this.gameId == GameType.GAME_XocDia) {
            var roomCell = new LobbyXocDiaCell();
        }
        else if (this.gameId == GameType.GAME_TaiXiu) {
            var roomCell = new LobbyTaiXiuCell();
        }
        else {
            var roomCell = LobbyRoomCell.createCell(this.maxUsers);
        }

        //  var roomCell = LobbyRoomCell.createCell(this.maxUsers);

        roomCell.serverId = serverId;
        roomCell.roomId = roomId;
        roomCell.setBetting(betting);
        roomCell.setUserCount(userCount);
        if (metadata) {
            roomCell.setMetadata(metadata);
        }
        roomList.pushItem(roomCell);

        roomCell.addTouchCell(function () {
            if (PlayerMe.gold < minMoney) {
                MessageNode.getInstance().show("Bạn không đủ tiền vào phòng");
            }
            else {
                var serverInfo = LobbyClient.getInstance().SFSServerInfo[serverId];
                if (serverInfo) {
                    PlayerMe.SFS.roomId = roomId;
                    SmartfoxClient.getInstance().findAndJoinRoom(serverInfo, null, null, roomId);
                }
                else {
                    MessageNode.getInstance().show("Không có thông tin máy chủ");
                }

                cc.log("join room");
            }
        });

        return roomCell;
    },

    updateRoomCell: function (roomList, serverId, roomId, userCount, metadata) {
        for (var i = 0; i < roomList.size(); i++) {
            var item = roomList.getItem(i);
            if (item.serverId == serverId && item.roomId == roomId) {
                item.setUserCount(userCount);
                if (metadata) {
                    item.setMetadata(metadata);
                }
                return true;
            }
        }

        return false;
    },

    getRoomList: function (groupName) {
        if (this.gameId == GameType.GAME_XocDia || this.gameId == GameType.GAME_TaiXiu) {
            return this.listRoomXocDia;
        }
        else {
            for (var i = 0; i < this.listGame.length; i++) {
                if (this.listGame[i].groupName == groupName) {
                    return this.listGame[i];
                }
            }
        }

        return null;
    },

    startGame: function (gameId) {
        this.gameId = gameId;

        if (gameId == GameType.GAME_TaiXiu || gameId == GameType.GAME_XocDia) {
            this.roomNode.setVisible(false);
            this.roomXocDiaNode.setVisible(true);
        }
        else {
            this.roomNode.setVisible(true);
            this.roomXocDiaNode.setVisible(false);
        }
    },

    startAnimation: function () {

    },

    onInviteReceived: function (command, data) {
        if (!cc.Global.GetSetting("invite"))
            return;

        data = data["data"];
        if (RecvInviteDialog.getInstance().isShow())
            return;
        RecvInviteDialog.getInstance().setInfo(data["userInvite"], s_games_display_name[s_games_chanel_id[data["gameType"]]], data["betting"]);

        var roomId = data["roomId"];
        var serverInfo = LobbyClient.getInstance().createServerInfo(data);
        serverInfo.roomId = roomId;
        RecvInviteDialog.getInstance().setRoomInfo(serverInfo);

        RecvInviteDialog.getInstance().showWithAnimationScale();
    },

    onUpdateAll: function (cmd, event) {
        cc.log(event);

        var data = event.data;
        this.maxUsers = data.maxUsers;

        var gameType = PlayerMe.gameType;
        if (gameType === data.gameType) {
            var groups = data.groups;
            for (var i = 0; i < groups.length; i++) {
                var groupName = groups[i].group;
                var roomList = this.getRoomList(groupName);
                if (roomList) {
                    var roomData = groups[i].rooms;
                    for (var j = 0; j < roomData.length; j++) {
                        var serverId = roomData[j].serverId;
                        var roomId = roomData[j].roomId;
                        var betting = roomData[j].betting;
                        var minMoney = roomData[j].minMoney;
                        var userCount = roomData[j].userCount;
                        var metadata = roomData[j].metadata;

                        var roomCell = this.addRoomCell(roomList, serverId, roomId, betting, minMoney, userCount, metadata);
                    }
                }

            }

            var roomList = this.getRoomList(data["group"]);
            if (roomList.idx != undefined) {
                this.mToggle.selectItem(roomList.idx);
            }
            roomList.runMoveEffect(3000, 0.1, 0.1);
        }
    },

    onUpdateJar: function (cmd, param) {
        var data = param["data"];
        var value = data["value"];
        this.huThuong.setVisible(true);
        this.huThuongValueLabel.setString(cc.Global.NumberFormat1(value));
        switch (data["gameType"]) {
            case "ThreeCards":
                this.huThuongLabel.setString("HŨ BA CÂY : ");
                break;
            case "ChinesePoker":
                this.huThuongLabel.setString("HŨ MẬU BINH : ");
                break;
            default:
                this.huThuongLabel.setString("");
        }
    },

    onUpdateUserCount: function (cmd, event) {
        var groups = event.data.groups;
        for (var i = 0; i < groups.length; i++) {
            var groupName = groups[i].group;
            var roomList = this.getRoomList(groupName);
            if (roomList) {
                var roomData = groups[i].rooms;
                for (var j = 0; j < roomData.length; j++) {
                    //this.addRoomCell(roomList, roomData[j].serverId, roomData[j].roomId, roomData[j].betting, roomData[j].userCount);
                    this.updateRoomCell(roomList, roomData[j].serverId, roomData[j].roomId, roomData[j].userCount, roomData[j].metadata);
                }
            }

        }
    },

    setVisible: function (visible) {
        this._super(visible);
        if (!visible) {
            for (var i = 0; i < this.listGame.length; i++) {
                this.listGame[i].removeAllItems();
            }
            this.listRoomXocDia.removeAllItems();
        }
        else {
            this.mToggle.selectItem(0);
        }
    },

    onEnter: function () {
        this._super();
        this.mToggle.selectItem(0);
    },

    onExit: function () {
        this._super();
        for (var i = 0; i < this.listGame.length; i++) {
            this.listGame[i].removeAllItems();
        }
        this.listRoomXocDia.removeAllItems();
        if (this.visible == true) {
            LobbyClient.getInstance().unSubscribe();
        }
        LobbyClient.getInstance().removeListener(this);
    }
});