/**
 * Created by VGA10 on 1/9/2017.
 */

var TutorialDialog = IDialog.extend({
    ctor: function (gameType) {
        this._super();

        this.bouldingWidth = 800;
        var board_bg = ccui.Scale9Sprite.createWithSpriteFrameName("board_bg.png", cc.rect(105, 105, 147, 147));
        board_bg.setAnchorPoint(cc.p(0, 0));
        this.dialogNode.addChild(board_bg);
        this.board_bg = board_bg;

        this.initWithSize(cc.size(1080, 720));

        var title = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "HƯỚNG DẪN CHƠI");
        title.setPosition(this.dialogNode.getContentSize().width / 2, this.dialogNode.getContentSize().height - 138);
        title.setColor(cc.color("#ffde00"));
        this.dialogNode.addChild(title);

        var clippingLayout = new ccui.Layout();
        clippingLayout.setContentSize(this.dialogNode.getContentSize().width, this.dialogNode.getContentSize().height - 275);
        clippingLayout.setAnchorPoint(cc.p(0.5, 0.5));
        clippingLayout.setPosition(this.dialogNode.getContentSize().width / 2, this.dialogNode.getContentSize().height / 2 - 25);
        clippingLayout.setClippingEnabled(true);
        clippingLayout.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        this.dialogNode.addChild(clippingLayout);

        var contentTable = new newui.TableView(cc.size(this.bouldingWidth, 470), 1);
        contentTable.setDirection(ccui.ScrollView.DIR_VERTICAL);
        contentTable.setScrollBarEnabled(false);
        contentTable.setPadding(10);
        contentTable.setMargin(10, 10, 0, 0);
        contentTable.setAnchorPoint(cc.p(0.5, 0.5));
        contentTable.setPosition(clippingLayout.getContentSize().width / 2,
            clippingLayout.getContentSize().height / 2);
        clippingLayout.addChild(contentTable);
        this.contentTable = contentTable;
        this.HDList = cc.loader.getRes("res/data/HDList.plist");
        this.rewardCardList = [[], [8,9,10,11,12], [39,40,41,42,43], [12,25,38,51,37], [16,3,42,26,0], [0,1,4,7,9], [21,9,49,37,38], [14,1,40,29,30], [20,7,45,32,4], [9,22,42,15,6]];

        switch (gameType){
            case GameType.MiniGame_CaoThap:
                this.initCaoThapTutorial();
                break;

            case GameType.MiniGame_Poker:
                this.initMiniPokerTutorial();
                break;

            case GameType.MiniGame_VideoPoker:
                this.initVideoPokerTutorial();
                break;
        }
    },

    initWithSize: function (mSize) {
        this.board_bg.setPreferredSize(cc.size(mSize.width, mSize.height));
        this.dialogNode.setContentSize(this.board_bg.getContentSize());
    },

    initCaoThapTutorial: function () {
        var tutorialLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25,this.HDList["CaoThap"]);
        tutorialLabel.setBoundingWidth(this.bouldingWidth);
        this.contentTable.pushItem(tutorialLabel);
    },

    initMiniPokerTutorial: function () {
        var miniLabel1 = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25,this.HDList["PokerMini1"]);
        miniLabel1.setBoundingWidth(this.bouldingWidth);
        this.contentTable.pushItem(miniLabel1);



        var miniLabel2 = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25,this.HDList["PokerMini2"]);
        miniLabel2.setBoundingWidth(this.bouldingWidth);
        this.contentTable.pushItem(miniLabel2);
    },
    
    initVideoPokerTutorial : function () {

    }
});