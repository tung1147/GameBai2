/**
 * Created by Quyet Nguyen on 7/16/2016.
 */

var MessageDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.initWithSize(cc.size(700,420));

        var scrollView = new ccui.ListView();
        scrollView.setContentSize(cc.size(660, 340));
        scrollView.setPosition(this._marginLeft + 20.0, this._marginBottom);
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setTouchEnabled(true);
        scrollView.setScrollBarEnabled(false);
        scrollView.addTouchEventListener(function (target,event) {
            if(event == ccui.Widget.TOUCH_BEGAN){
                scrollView.stopAllActions();
            }
        });
        scrollView.setBounceEnabled(true);
        this.dialogNode.addChild(scrollView);
        this.scrollView = scrollView;

        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Thông báo");
    },

    setTitle : function (title) {
        this.title.setString(title);
    },

    setMessage : function (message) {
        this.scrollView.removeAllItems();
        var messageLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, message, cc.TEXT_ALIGNMENT_CENTER, this.scrollView.getContentSize().width);

        var height = messageLabel.getContentSize().height + 20.0;
        if(height <= this.scrollView.getContentSize().height){
            height = this.scrollView.getContentSize().height;
            this.scrollView.setEnabled(false);
        }
        else{
            this.scrollView.setEnabled(true);
            this.scrollHeight = height - this.scrollView.getContentSize().height;
            this.startAutoScroll(4.0);
        }

        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.scrollView.getContentSize().width, height));
        container.addChild(messageLabel);
        messageLabel.setPosition(container.getContentSize().width/2, container.getContentSize().height/2);
        this.scrollView.pushBackCustomItem(container);
    },
    
    startAutoScroll : function (delayTime) {
        var thiz = this;
        this.scrollView.stopAllActions();
        this.scrollView.runAction(new cc.Sequence(new cc.DelayTime(delayTime), new cc.CallFunc(function () {
            var duration =  thiz.scrollHeight / 40.0;
            thiz.scrollView.scrollToBottom(duration, false);
        })));
    },
});

var MessageConfirmDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.initWithSize(cc.size(600,400));
        this.title.setString("Thông báo");
        this.closeButton.visible = false;
        this.okTitle.setString("Đồng ý");
        this.cancelTitle.setString("Đóng");

        var messageLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "message", cc.TEXT_ALIGNMENT_CENTER, 550);
        messageLabel.setPosition(this.dialogNode.getContentSize().width/2, this.dialogNode.getContentSize().height/2);
        this.dialogNode.addChild(messageLabel);
        this.messageLabel = messageLabel;
    },
    setMessage : function (message) {
        this.messageLabel.setString(message);
    },
    okButtonHandler : function () {

    },
    cancelButtonHandler : function () {
        this.hide();
    }
});