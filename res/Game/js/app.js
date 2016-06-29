
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var winSize = cc.winSize;
      //   var editBox =  new newui.EditBox(cc.size(200, 50));
      // //  editBox.setContentSize(cc.size(2,2));
      //   editBox.setPlaceHolder("input text");
      //   editBox.x = winSize.width/2;
      //   editBox.y = winSize.height/2;
      //   this.addChild(editBox);

        var editBox = new newui.EditBox(cc.size(200, 50));
        editBox.setPlaceHolder('aaaa');
        editBox.x = winSize.width/2;
        editBox.y = winSize.height/2;
        this.addChild(editBox);
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

