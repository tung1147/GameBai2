/**
 * Created by Quyet Nguyen on 9/21/2016.
 */

var GameLaucherStatus = GameLaucherStatus || {};
GameLaucherStatus.GetUpdate = 0;
GameLaucherStatus.TestVersion = 1;
GameLaucherStatus.TestHashFiles = 2;
GameLaucherStatus.Updating = 3;
GameLaucherStatus.UpdateFailure = 4;
GameLaucherStatus.LoadResource = 5;
GameLaucherStatus.LoadScript = 6;
GameLaucherStatus.LoadAndroidExt = 7;
GameLaucherStatus.Finished = 8;

var LoadingScene = cc.Scene.extend({
    ctor : function () {
        this._super();
        var label = new ccui.Text("Đang kiểm tra phiên bản", "arial", 30);
        label.x = cc.winSize.width/2;
        label.y = cc.winSize.height/2;
        this.title = label;
        this.addChild(label);
    },
    nextScene : function () {
        cc.director.replaceScene(new HelloWorldScene());
    },
    onEnter : function () {
        this._super();
        SystemPlugin.getInstance().startLaucher();
    },
    onProcessStatus : function (status) {
        switch (status){
            case GameLaucherStatus.GetUpdate:
            {
                break;
            }
            case GameLaucherStatus.TestVersion:
            {
                break;
            }
            case GameLaucherStatus.TestHashFiles:
            {
                break;
            }
            case GameLaucherStatus.Updating:
            {
                this.title.setString("Đang tải cập nhật");
                break;
            }
            case GameLaucherStatus.UpdateFailure:
            {
                this.title.setString("Cập nhật thất bại");
                break;
            }
            case GameLaucherStatus.LoadResource:
            {
                this.title.setString("Đang tải tài nguyên");
                break;
            }
            case GameLaucherStatus.LoadScript:
            {
                this.title.setString("Đang vào game");
                break;
            }
            case GameLaucherStatus.LoadAndroidExt:
            {
                break;
            }
            case GameLaucherStatus.Finished:
            {
                this.nextScene();
                break;
            }
        }
    },
    onLoadResourceProcess : function (current, target) {
        this.title.setString("Đang tải tài nguyên[" + current + "/" + target + "]");
    },
    onUpdateDownloadProcess : function (current, target) {
        this.title.setString("Đang tải cập nhật[" + current + "/" + target + "]");
    }
});