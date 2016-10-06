var HelloWorldLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        var winSize = cc.winSize;

        var label = new ccui.Text("Test Button", "arial", 30);
        label.x = cc.winSize.width/2;
        label.y = cc.winSize.height/2 + 100.0;
        this.addChild(label);
        label.setTouchEnabled(true);
        label.addClickEventListener(function () {
           // ElectroClient.getInstance().connect("103.24.244.160", 9899);
            SystemPlugin.getInstance().downloadFile("http://10.0.1.106/quyetnd/GBVCity/acs.json","test.json", function (returnCode) {
                cc.log("return: "+returnCode);
            });
        });

        return true;
    },
    
    onEvent : function (obj) {
        data = obj.getUserData().name;
        cc.log("onevent" + data);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

