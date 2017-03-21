/**
 * Created by Quyet Nguyen on 3/21/2017.
 */

var s_diemdanhContent = s_diemdanhContent || "Đăng nhập hằng ngày để nhận thưởng. Nếu điểm danh trống, đăng nhập lại sẽ tính ngày tiếp theo.\nVD: Đã nhận đến ngày thứ 3, không đăng nhập 2 ngày (thứ 4, 5). Khi đăng nhập lại (ngày 6) sẽ nhận phần quà của ngày thứ 4.";

var s_loginContent = s_loginContent || "Đăng nhập liên tiếp  tích lũy đủ số ngày để nhận thưởng.\nNếu số ngày đăng nhập bị ngắt quãng thì số ngày tích lũy sẽ bị tính lại từ đầu.";

var s_onlineContent = s_onlineContent || "Đăng nhập liên tiếp  tích lũy đủ số ngày để nhận thưởng.\nNếu số ngày đăng nhập bị ngắt quãng thì số ngày tích lũy sẽ bị tính lại từ đầu.";

var ActivityDiemDanhLayer = cc.Node.extend({
    ctor : function () {
        this._super();

        var nameLabel = new cc.LabelBMFont("Điểm danh", cc.res.font.Roboto_Condensed_25);
        nameLabel.setColor(cc.color("#ffde00"));
        nameLabel.setAnchorPoint(cc.p(0.0, 0.5));
        nameLabel.setPosition(414, 594);
        this.addChild(nameLabel);

        var contentLabel = new cc.LabelTTF(s_diemdanhContent, cc.res.font.Roboto_Condensed, 20, cc.size(570, 0), cc.TEXT_ALIGNMENT_LEFT);
        contentLabel.setColor(cc.color("#ffffff"));
        contentLabel.setAnchorPoint(cc.p(0.0, 1.0));
        contentLabel.setPosition(414, 574);
        this.addChild(contentLabel);

        var dateLabel = new cc.LabelTTF("Ngày", cc.res.font.Roboto_Condensed, 16);
        dateLabel.setColor(cc.color("#4d6181"));
        dateLabel.setPosition(447, 431);
        this.addChild(dateLabel);

        var rewardLabel = new cc.LabelTTF("Phần thưởng", cc.res.font.Roboto_Condensed, 16);
        rewardLabel.setColor(cc.color("#4d6181"));
        rewardLabel.setPosition(601, 431);
        this.addChild(rewardLabel);

        var statusLabel = new cc.LabelTTF("Trạng thái", cc.res.font.Roboto_Condensed, 16);
        statusLabel.setAnchorPoint(cc.p(0.0, 0.5));
        statusLabel.setColor(cc.color("#4d6181"));
        statusLabel.setPosition(747, 431);
        this.addChild(statusLabel);

        var listItem = new newui.TableView(cc.size(624, 310), 1);
        listItem.setPosition(cc.p(414, 98));
        listItem.setPadding(10.0);
        listItem.setMargin(10,10,0,0);
        this.addChild(listItem);
        this.listItem = listItem;

        for(var i=0;i<20; i++){
            this.addItem("date", "reward", "status");
        }
    },

    addItem : function(date, reward, status, itemId){
        // uto container = ui::Widget::create();
        // container->setContentSize(Size(listItem->getContentSize().width, 60));
        // listItem->pushItem(container);
        // int itemSize = listItem->getItems().size();
        // if(itemSize % 2){
        //     auto bg = ui::Scale9Sprite::createWithSpriteFrameName("activity_cell_bg.png", Rect(10, 10, 4, 4));
        //     bg->setPreferredSize(Size(container->getContentSize()));
        //     bg->setAnchorPoint(Point::ZERO);
        //     bg->setPosition(Point::ZERO);
        //     container->addChild(bg);
        // }

        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.listItem.getContentSize().width, 60));
        this.listItem.pushItem(container);
        if(this.listItem.size() % 2){
            var bg = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
            bg.setPreferredSize(container.getContentSize());
            bg.setAnchorPoint(cc.p(0,0));
            container.addChild(bg);
        }


        // auto dateBg = Sprite::createWithSpriteFrameName("activity_bg_1.png");
        // dateBg->setPosition(33, container->getContentSize().height/2);
        // container->addChild(dateBg);
        //
        // auto dateLabel = Label::createWithTTF(date, Roboto_CondensedBold, 24);
        // dateLabel->setColor(Color3B(255, 222, 0));
        // dateLabel->setPosition(dateBg->getPosition());
        // container->addChild(dateLabel);
        //
        // auto rewardLabel = Label::createWithTTF(reward, Roboto_CondensedBold, 20);
        // rewardLabel->setColor(Color3B(255, 222, 0));
        // rewardLabel->setPosition(187, dateBg->getPositionY());
        // container->addChild(rewardLabel);
        //
        // if(status == "0" || status == "1"){
        //     auto statusLabel = Label::createWithTTF("Đã nhận", Roboto_Condensed, 20);
        //     statusLabel->setColor(Color3B(255, 222, 0));
        //     statusLabel->setAnchorPoint(Point(0.0f, 0.5f));
        //     statusLabel->setPosition(333, dateBg->getPositionY());
        //     container->addChild(statusLabel);
        //
        //     if(status == "1"){
        //         statusLabel->setVisible(false);
        //         auto bt = ui::Button::create("activity_button_1.png", "", "",ui::Widget::TextureResType::PLIST);
        //         bt->setAnchorPoint(Point(0.0f, 0.5f));
        //         bt->setZoomScale(0.01f);
        //         bt->setPosition(Point(333, dateBg->getPositionY()));
        //         bt->setTitleFontName(Roboto_CondensedBold);
        //         bt->setTitleFontSize(20);
        //         bt->setTitleText("Nhận thưởng");
        //         bt->setTitleColor(Color3B(131, 82, 56));
        //         container->addChild(bt);
        //         bt->addClickEventListener([=](Ref*){
        //             bt->setVisible(false);
        //             statusLabel->setVisible(true);
        //             _request_getReward(itemId);
        //         });
        //     }
        // }
        // else{
        //     auto statusLabel = Label::createWithTTF(status, Roboto_Condensed, 20);
        //     statusLabel->setColor(Color3B(149, 200, 230));
        //     statusLabel->setAnchorPoint(Point(0.0f, 0.5f));
        //     statusLabel->setPosition(333, dateBg->getPositionY());
        //     container->addChild(statusLabel);
        // }
    }
});

var ActivityLoginLayer = cc.Node.extend({
    ctor : function () {
        this._super();
    }
});

var ActivityOnlineLayer = cc.Node.extend({
    ctor : function () {
        this._super();
    }
});

var ActivityQuestLayer = cc.Node.extend({
    ctor : function () {
        this._super();
    }
});

var ActivityEventLayer = cc.Node.extend({
    ctor : function () {
        this._super();
    }
});