/**
 * Created by Quyet Nguyen on 7/13/2016.
 */
var InboxLayer = LobbySubLayer.extend({
    ctor : function () {
        this._super();

        var title = new cc.Sprite("#lobby-title-newMessage.png");
        title.setPosition(cc.winSize.width/2, 720.0 - 63 * cc.winSize.screenScale);
        this.addChild(title);
        title.setScale(cc.winSize.screenScale);

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Thời gian");
        timeLabel.setPosition(185.0 * cc.winSize.screenScale, 576);
        var senderLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Người gửi");
        senderLabel.setPosition(437.0 * cc.winSize.screenScale, 576);
        var titleLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Nội dung");
        titleLabel.setPosition(892.0 * cc.winSize.screenScale, 576);
        timeLabel.setOpacity(0.2 * 255);
        senderLabel.setOpacity(0.2 * 255);
        titleLabel.setOpacity(0.2 * 255);
        this.addChild(timeLabel);
        this.addChild(senderLabel);
        this.addChild(titleLabel);

        var _top = 554.0;
        var _bottom = 0.0;

        var messageList = new newui.TableView(cc.size(cc.winSize.width, _top - _bottom), 1);
        messageList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        messageList.setScrollBarEnabled(false);
        messageList.setPadding(10);
        messageList.setMargin(10,10,0,0);
        messageList.setPosition(cc.p(0, _bottom));
        this.addChild(messageList, 1);
        this.messageList = messageList;

        for(var i=0;i<20;i++){
            this.addMessage(0, "Hệ thống", "Title", "Content");
        }
    },
    addMessage : function (time, sender, title, content) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.messageList.getContentSize().width, 80));
        this.messageList.pushItem(container);

        var bg1 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png",cc.rect(10, 0, 4, 80));
        bg1.setPreferredSize(cc.size(250 * cc.winSize.screenScale, 80));
        bg1.setPosition(185.0 * cc.winSize.screenScale, bg1.getContentSize().height/2);
        container.addChild(bg1);

        var bg2 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png",cc.rect(10, 0, 4, 80));
        bg2.setPreferredSize(cc.size(250 * cc.winSize.screenScale, 80));
        bg2.setPosition(437.0 * cc.winSize.screenScale, bg1.y);
        container.addChild(bg2);

        var bg3 = ccui.Scale9Sprite.createWithSpriteFrameName("sublobby-cell-bg.png",cc.rect(10, 0, 4, 80));
        bg3.setPreferredSize(cc.size(656 * cc.winSize.screenScale, 80));
        bg3.setPosition(892.0 * cc.winSize.screenScale, bg1.y);
        container.addChild(bg3);

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Time");
        timeLabel.setPosition(bg1.getPosition());
        container.addChild(timeLabel);
        var senderLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, sender);
        senderLabel.setPosition(bg2.getPosition());
        container.addChild(senderLabel);
        var titleLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, title);
        titleLabel.setPosition(bg3.getPosition());
        container.addChild(titleLabel);

        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            var dialog = new MessageDialog();
            dialog.title.setString("Tin nhắn");
            dialog.setMessage(content);
            dialog.showWithAnimationScale();
        });
    }
});