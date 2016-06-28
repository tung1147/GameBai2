
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var winSize = cc.winSize;
        var button = ccui.Text("Button", "arial", 30);
        button.x = winSize.width/2;
        button.y = winSize.height/2;
        this.addChild(button);
        button.setTouchEnabled(true);
        button.addClickEventListener(function () {
            //LobbyClient.getInstance().connect("10.0.1.106", 9999);
            //SmartfoxClient.getInstance().connect("10.0.1.88", 9933);


            var itemList = [
                "item 1",
                "item 2",
                "item 3",
                "item 4",
                "item 5"
            ];
            var versionName = SystemPlugin.getInstance().iOSInitStore(itemList);
           // var plugin = new cc.SystemPlugin();
           //cc.log("versionName:" + versionName);
        });

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

