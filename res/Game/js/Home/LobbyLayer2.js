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
    ctor : function () {
        this._super();
        LobbyClient.getInstance().addListener("updateAll", this.onUpdateAll, this);
        LobbyClient.getInstance().addListener("updateUserCount", this.onUpdateUserCount, this);
        LobbyClient.getInstance().addListener("inviteUser", this.onInviteReceived, this);

        //
        this.initListGame();
    },

    initListGame : function () {
        var left = 310.0 * cc.winSize.screenScale;
        var right = cc.winSize.width - 10.0 * cc.winSize.screenScale;
        var bottom = 230.0;
        var top = 590.0;
        var dx = (right - left)/5;
        var x = left + dx/2;
        var y = 160;

        var thiz = this;
        var mToggle = new ToggleNodeGroup();
        thiz.addChild(mToggle);
        this.mToggle = mToggle;
        this.listGame = [];

        var selectedSprite = new ccui.Scale9Sprite("lobby-tabSelected.png", cc.rect(4,4,4,4));
        selectedSprite.setPreferredSize(cc.size(dx, 58));
        this.addChild(selectedSprite,1);

        for(var i=0; i<s_lobby_group_name.length; i++){
            (function () {
                var icon1 = new cc.Sprite("#lobby-tab"+ (i+1) +".png");
                icon1.setPosition(x,y);
                icon1.setScale(cc.winSize.screenScale);
                thiz.addChild(icon1);

                var icon2 = new cc.Sprite("#lobby-tabSelected"+ (i+1) +".png");
                icon2.setPosition(x,y);
                icon2.setScale(cc.winSize.screenScale);
                thiz.addChild(icon2);

                var listGame = new newui.TableView(cc.size(right - left, top - bottom), 4);
                listGame.setDirection(ccui.ScrollView.DIR_VERTICAL);
                listGame.setPadding(20);
                listGame.setBounceEnabled(true);
                listGame.setMargin(10,10,0,0);
                listGame.setScrollBarEnabled(true);
                listGame.setPosition(left, bottom);
                listGame.groupName = s_lobby_group_name[i];
                thiz.addChild(listGame,1);
                thiz.listGame.push(listGame);

                var toggleItem = new ToggleNodeItem(cc.size(dx, 58.0));
                toggleItem.setPosition(icon1.x, icon1.y - icon1.getContentSize().height/2 + toggleItem.getContentSize().height/2);
                toggleItem.onSelect = function (isForce) {
                    icon1.visible = false;
                    icon2.visible = true;
                    listGame.visible = true;
                    selectedSprite.stopAllActions();
                    if(isForce){
                        selectedSprite.setPosition(toggleItem.getPosition());
                    }
                    else{
                        selectedSprite.runAction(new cc.MoveTo(0.1, toggleItem.getPosition()));
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
    addRoomCell : function (roomList, serverId, roomId, betting, minMoney, userCount) {
        var roomCell = LobbyRoomCell.createCell(this.maxUsers);
        roomCell.serverId = serverId;
        roomCell.roomId = roomId;
        roomCell.setBetting(betting);
        roomCell.setUserCount(userCount);
        roomList.pushItem(roomCell);

        roomCell.setTouchEnabled(true);
        roomCell.addClickEventListener(function () {
            if(PlayerMe.gold < minMoney){
                MessageNode.getInstance().show("Bạn không đủ tiền vào phòng");
            }
            else{
                var serverInfo = LobbyClient.getInstance().SFSServerInfo[serverId];
                if(serverInfo){
                    PlayerMe.SFS.roomId = roomId;
                    SmartfoxClient.getInstance().findAndJoinRoom(serverInfo.host, serverInfo.port);
                }
                else{
                    MessageNode.getInstance().show("Không có thông tin máy chủ");
                }

                cc.log("join room");
            }
        });
    },
    updateRoomCell : function (roomList, serverId, roomId, userCount) {
        for(var i=0;i<roomList.size();i++){
            var item = roomList.getItem(i);
            if(item.serverId == serverId && item.roomId == roomId){
                item.setUserCount(userCount);
            }
        }
    },
    getRoomList : function (groupName) {
        for(var i=0;i<this.listGame.length;i++){
            if(this.listGame[i].groupName == groupName){
                return this.listGame[i];
            }
        }
        return null;
    },
    startGame : function (gameId) {

    },
    startAnimation : function () {

    },
    onInviteReceived: function (command, data) {
        data = data["data"];
        if (RecvInviteDialog.getInstance().isShow())
            return;
        RecvInviteDialog.getInstance().setInfo(data["userInvite"],s_games_display_name[s_games_chanel_id[data["gameType"]]],data["betting"]);
        RecvInviteDialog.getInstance().setRoomInfo(data["roomId"],data["ip"],data["port"]);
        RecvInviteDialog.getInstance().showWithAnimationScale();
    },
    onUpdateAll : function (cmd, event) {
        console.log(event);
        for(var i=0; i < this.listGame.length;i++){
            this.listGame[i].removeAllItems();
        }

        var data = event.data;
        this.maxUsers = data.maxUsers;

        var gameType = PlayerMe.gameType;
        if(gameType === data.gameType){
            var groups = data.groups;
            for(var i=0;i<groups.length;i++){
                var groupName = groups[i].group;
                var roomList = this.getRoomList(groupName);
                if(roomList){
                    var roomData = groups[i].rooms;
                    for(var j=0; j<roomData.length; j++){
                        this.addRoomCell(roomList, roomData[j].serverId, roomData[j].roomId, roomData[j].betting, roomData[j].minMoney, roomData[j].userCount);
                    }
                }

            }
            for(var i=0;i<this.listGame.length;i++){
                if(this.listGame[i].visible){
                    this.listGame[i].runMoveEffect(3000,0.1,0.1);
                    break;
                }
            }
        }
    },

    onUpdateUserCount : function (cmd, event) {
        var groups = event.data.groups;
        for(var i=0;i<groups.length;i++){
            var groupName = groups[i].group;
            var roomList = this.getRoomList(groupName);
            if(roomList){
                var roomData = groups[i].rooms;
                for(var j=0; j<roomData.length; j++){
                    //this.addRoomCell(roomList, roomData[j].serverId, roomData[j].roomId, roomData[j].betting, roomData[j].userCount);
                    this.updateRoomCell(roomList, roomData[j].serverId, roomData[j].roomId, roomData[j].userCount);
                }
            }

        }
    },

    setVisible : function (visible) {
        this._super(visible);
        if(!visible){
            for(var i=0; i < this.listGame.length;i++){
                this.listGame[i].removeAllItems();
            }
        }
        else{
            this.mToggle.selectItem(0);
        }
    },

    onEnter : function () {
        this._super();
        this.mToggle.selectItem(0);
    },

    onExit : function () {
        this._super();
        for(var i=0; i < this.listGame.length;i++){
            this.listGame[i].removeAllItems();
        }
        if(this.visible == true){
            LobbyClient.getInstance().unSubscribe();
        }
        LobbyClient.getInstance().removeListener(this);
    }
});