/**
 * Created by Quyet Nguyen on 4/4/2017.
 */

var HomeShopLayer = IDialog.extend({
    ctor : function () {
        this._super();
        this._bgColor = cc.color(0,0,0,0);
        this.setContentSize(cc.winSize);
        this.mTouch = cc.rect(0,0, cc.winSize.width, cc.winSize.height);
    },

    onEnter : function () {
        this._super();

        var thiz = this;

        var inventoryDialog = new InventoryDialog();
        inventoryDialog.show(this);
        inventoryDialog.setPositionX(cc.winSize.width - 235);
        inventoryDialog.closeButtonHandler = function () {
            thiz.hide();
        };
        inventoryDialog.onTouchDialog = function () {
            var p1 = inventoryDialog.getParent();
            var p2 = shopDialog.getParent();
            p2.setLocalZOrder(0);
            p1.setLocalZOrder(1);
        };

        var shopDialog = new ShopItemDialog();
        shopDialog.show(this);
        shopDialog.setPositionX(345);
        shopDialog.closeButtonHandler = function () {
            thiz.hide();
        };
        shopDialog.onTouchDialog = function () {
            var p1 = inventoryDialog.getParent();
            var p2 = shopDialog.getParent();
            p1.setLocalZOrder(0);
            p2.setLocalZOrder(1);
        };
    }
});