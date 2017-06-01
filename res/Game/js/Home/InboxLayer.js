/**
 * Created by Quyet Nguyen on 7/13/2016.
 */

var s_text_color = s_text_color || cc.color("#8de8ff");
var s_text_color_readed = s_text_color_readed || cc.color(120,120,120,255);

var InboxLayer = LobbySubLayer.extend({
    ctor : function () {
        this._super("#lobby-title-newMessage.png");

        // var title = new cc.Sprite("#lobby-title-newMessage.png");
        // title.setPosition(cc.winSize.width/2, 720.0 - 63 * cc.winSize.screenScale);
        // this.addChild(title);
        // title.setScale(cc.winSize.screenScale);

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Thời gian");
        timeLabel.setColor(cc.color("#2776a4"));
        timeLabel.setPosition(235.0 * cc.winSize.screenScale, 590);

        var senderLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Người gửi");
        senderLabel.setColor(cc.color("#2776a4"));
        senderLabel.setPosition(482.0 * cc.winSize.screenScale, 590);

        var titleLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Nội dung");
        titleLabel.setColor(cc.color("#2776a4"));
        titleLabel.setPosition(745.0 * cc.winSize.screenScale, 590);

        this.addChild(timeLabel);
        this.addChild(senderLabel);
        this.addChild(titleLabel);


        var _left = 160.0 * cc.winSize.screenScale;
        var _right = 1120.0;

        var _top = 554.0;
        var _bottom = 0.0;

        var messageList = new newui.TableView(cc.size(_right - _left, _top - _bottom), 1);
        messageList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        messageList.setScrollBarEnabled(false);
        messageList.setPadding(10);
        messageList.setMargin(10,10,0,0);
        messageList.setAnchorPoint(cc.p(0.0, 1.0));
        messageList.setScale(cc.winSize.screenScale);
        messageList.setPosition(cc.p(_left, _top));
        this.addChild(messageList, 1);
        this.messageList = messageList;

        LobbyClient.getInstance().addListener("fetchMultiMessageInbox", this.onRecvMessageInbox, this);
        //LobbyClient.getInstance().addListener("markReadedMessageInbox", this.onMarkReadedMessageInbox, this);
        LobbyClient.getInstance().addListener("inboxMessage", this.onUpdateMessageCount, this);


        // for(var i=0;i<10;i++){
            // if(msg[i].type === 1){
            //     this.addMessage("d", "ddd", "ssss", "ssss", "ssss", 1);
            // }
        // }
    },
    addMessage : function (messageId, time, sender, title, content, status) {
        var container = new ccui.Widget();
        container.messageId = messageId;
        container.setContentSize(cc.size(this.messageList.getContentSize().width, 60));
        this.messageList.pushItem(container);
        if(this.messageList.size() % 2){
            var bg = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg.setPreferredSize(container.getContentSize());
            bg.setAnchorPoint(cc.p(0,0));
            container.addChild(bg);

            var bg1 = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg1.setPreferredSize(cc.size(1, 50));
            bg1.setPosition(263, 30);
            container.addChild(bg1);
            //
            var bg2 = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg2.setPreferredSize(cc.size(1, 50));
            bg2.setPosition(533, 30);
            container.addChild(bg2);
        }


        var d = new Date(time);
        var timeString = cc.Global.DateToString(d);
        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, timeString, cc.TEXT_ALIGNMENT_CENTER, 250);
        timeLabel.setAnchorPoint(cc.p(0.0, 0.5));
        timeLabel.setPosition(40.0, 30);
        timeLabel.setColor(s_text_color);
        container.addChild(timeLabel);
        container.timeLabel = timeLabel;

        var senderLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, sender);
        senderLabel.setAnchorPoint(cc.p(0.0, 0.5));
        senderLabel.setPosition(284, 30);
        senderLabel.setColor(s_text_color);
        container.addChild(senderLabel);
        container.senderLabel = senderLabel;

        var titleLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, title);
        titleLabel.setAnchorPoint(cc.p(0.0, 0.5));
        titleLabel.setPosition(555, 30);
        titleLabel.setColor(s_text_color);
        container.titleLabel = titleLabel;
        container.addChild(titleLabel);


        if(status == 6){
            timeLabel.setOpacity(80);
            senderLabel.setOpacity(80);
            titleLabel.setOpacity(80);
        }

        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            var dialog = new MessageDialog();
            dialog.title.setString("TIN NHẮN");
            dialog.setMessage(content);
            dialog.showWithAnimationScale();
            if(status === 1){
                var request = {
                    command : "markReadedMessageInbox",
                    messageId : messageId
                };
                LobbyClient.getInstance().send(request);

                timeLabel.setOpacity(80);
                senderLabel.setOpacity(80);
                titleLabel.setOpacity(80);
            }
        });
    },
    
    onEnter : function () {
        this._super();
        this.requestAllMessage();
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },

    requestAllMessage : function () {
        var msg = {
            command : "fetchMultiMessageInbox"
        };
        LobbyClient.getInstance().send(msg);
    },

    onUpdateMessageCount : function (cmd, data) {
        this.requestAllMessage();
    },

    onRecvMessageInbox : function (cmd, data) {
        var msg = data["data"]["messages"];
        if(msg && msg.length > 0){
            cc.log("onRecvMessageInbox");
            this.messageList.removeAllItems();
            for(var i=0;i<msg.length;i++){
                if(msg[i].type === 1){
                    this.addMessage(msg[i].messageId, msg[i].sendTime, msg[i].senderName, msg[i].title, msg[i].content, msg[i].status);
                }
            }
        }
    }

    // onMarkReadedMessageInbox : function (cmd, data) {
    //     var messageId = data["data"]["messageId"];
    //     for(var i=0;i<this.messageList.size();i++){
    //         var msgItem = this.messageList.getItem(i);
    //         if(msgItem.messageId === messageId){
    //             msgItem.timeLabel.setColor(s_text_color_readed);
    //             msgItem.senderLabel.setColor(s_text_color_readed);
    //             msgItem.titleLabel.setColor(s_text_color_readed);
    //         }
    //     }
    // }
});