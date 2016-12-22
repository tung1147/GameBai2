/**
 * Created by QuyetNguyen on 12/20/2016.
 */

var VideoPokerLayer = MiniGamePopup.extend({
    ctor : function () {
        this._super();

        this.cardSprites = [];
        this.holdLayer = [];
        this.rewardLayer = [];

        var bg = new cc.Sprite("#videopoker_bg.png");
        bg.setAnchorPoint(cc.p(0,0));
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0.5,0.5));
        this.addChild(bg);

        var resultLabel = new cc.LabelBMFont("THÙNG PHÁ SẢNH", cc.res.font.Roboto_CondensedBold_30);
        resultLabel.setColor(cc.color("#c9ceff"));
        resultLabel.setPosition(500, 370);
        this.resultLabel = resultLabel;
        this.addChild(resultLabel, 1);

        var gameIdLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "ID : 1231231233", cc.TEXT_ALIGNMENT_LEFT);
        gameIdLabel.setColor(cc.color("#5366cb"));
        gameIdLabel.setScale(0.8);
        gameIdLabel.setPosition(730, 135);
        this.addChild(gameIdLabel);
        this.gameIdLabel = gameIdLabel;

        var rollButton = new ccui.Button("minipoker_rollButton.png", "", "", ccui.Widget.PLIST_TEXTURE);
        rollButton.setZoomScale(0.0);
        rollButton.setPosition(870, 114);
        this.addChild(rollButton);

        for (var i = 0; i < 5; i++) {
            var sprite = new cc.Sprite("#gp_card_up.png");
            sprite.setScale(1.4);
            sprite.setPosition(240 + 135 * i, 255);
            this.addChild(sprite);
            this.cardSprites.push(sprite);

            var holdSprite = new cc.Sprite ("#videopoker_holdLayer.png");
            holdSprite.setPosition(sprite.getPosition());
            holdSprite.setScale(1.4);
            holdSprite.setVisible(false);
            this.addChild(holdSprite);
            this.holdLayer.push(holdSprite);

            var rewardSprite = new cc.Sprite("#videopoker_rewardLayer.png");
            rewardSprite.setPosition(sprite.getPosition());
            rewardSprite.setScale(1.4);
            rewardSprite.setVisible(false);
            this.addChild(rewardSprite);
            this.rewardLayer.push(rewardSprite);
        }

        var coinIcon = new cc.Sprite("#caothap_coinIcon.png");
        coinIcon.setPosition(549, 90);
        this.addChild(coinIcon);

        var bankLabel = new cc.LabelBMFont("100.000", cc.res.font.Roboto_CondensedBold_30);
        bankLabel.setColor(cc.color("#ffea00"));
        bankLabel.setAnchorPoint(cc.p(1.0, 0.5));
        bankLabel.setPosition(520, 90);
        this.bankLabel = bankLabel;
        this.addChild(bankLabel, 1);

        var nhanThuongBt = new ccui.Button("videopoker_nhanthuongBt.png","","",ccui.Widget.PLIST_TEXTURE);
        nhanThuongBt.setPosition(685,90);
        this.addChild(nhanThuongBt,1);

        this._boudingRect = cc.rect(30, 47, 930, 510);
     //   this.setScale(0.5);
    },

    initController : function () {
        this._controller = new VideoPokerController(this);
    }
});