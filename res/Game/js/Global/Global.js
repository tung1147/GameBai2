/**
 * Created by Quyet Nguyen on 7/6/2016.
 */

String.prototype.insertAt=function(index, string) {
    return this.substr(0, index) + string + this.substr(index);
}
var cc = cc || {};
cc.Global = cc.Global || {};
cc.Global.NumberFormat1 = function (number) {
    var pret = Math.abs(number).toString();
    if(pret.length > 3){
        for(var i=pret.length-3; i>0;i-=3){
            pret = pret.insertAt(i,".");
        }
    }
    if(number < 0){
        return "-"+pret;
    }
    return pret;
};

var Number_Format_Type = ["", "K", "M", "B"];
cc.Global.NumberFormat2 = function (number) {
    var i = 0;
    while(number >= 1000){
        number = Math.floor(number/1000);
        i++;
    }
    return (number.toString() + Number_Format_Type[i]);
};

//cc.winSize.screenScale = cc.winSize.width / 1280.0;
cc.res = cc.res || {};
cc.res.font = cc.res.font || {};
if(cc.sys.isNative){
    cc.res.font.Roboto_Condensed = "res/fonts/Roboto-Condensed.ttf";
    cc.res.font.Roboto_CondensedBold = "res/fonts/Roboto-BoldCondensed.ttf";
    cc.res.font.UTM_AvoBold = "res/fonts/UTM-AvoBold.ttf";
}
else{
    cc.res.font.Roboto_Condensed = "Roboto-Condensed";
    cc.res.font.Roboto_CondensedBold = "Roboto-BoldCondensed";
    cc.res.font.UTM_AvoBold = "UTM-AvoBold";
}

cc.res.font.Roboto_Condensed_40 = "res/fonts/RobotoCondensed_40.fnt";
cc.res.font.Roboto_CondensedBold_40 = "res/fonts/RobotoBoldCondensed_40.fnt";
cc.res.font.UTM_AvoBold_40 = "res/fonts/UTMAvoBold_40.fnt";

cc.res.font.Roboto_Condensed_30 = "res/fonts/RobotoCondensed_30.fnt";
cc.res.font.Roboto_CondensedBold_30 = "res/fonts/RobotoBoldCondensed_30.fnt";
cc.res.font.UTM_AvoBold_30 = "res/fonts/UTMAvoBold_30.fnt";

cc.res.font.Roboto_Condensed_25 = "res/fonts/RobotoCondensed_25.fnt";
cc.res.font.Roboto_CondensedBold_25 = "res/fonts/RobotoBoldCondensed_25.fnt";
cc.res.font.UTM_AvoBold_25 = "res/fonts/UTMAvoBold_25.fnt";

cc.res.font.Roboto_BoldCondensed_36_Glow = "/res/fonts/Roboto_BoldCondensed_36_Glow.fnt";
cc.res.font.videoPokerRewardFont = "/res/fonts/videoPokerRewardFont.fnt";

var GameType = GameType || {};
GameType.GAME_MauBinh = 0;
GameType.GAME_TienLenMN = 1;
GameType.GAME_Phom = 2;
GameType.GAME_Sam = 3;
GameType.GAME_BaCay = 4;
GameType.GAME_XocDia = 5;
GameType.GAME_TaiXiu = 6;
GameType.GAME_VongQuayMayMan = 7;
GameType.GAME_TLMN_Solo = 8;
GameType.GAME_Sam_Solo = 9;
GameType.GAME_Lieng = 10;
GameType.GAME_BaCayChuong = 11;
GameType.MiniGame_ChanLe = 12;
GameType.MiniGame_CaoThap = 13;
GameType.MiniGame_Poker = 14;
GameType.MiniGame_VideoPoker = 15;

var s_game_available = s_game_available || {};
s_game_available[GameType.GAME_MauBinh] = false;
s_game_available[GameType.GAME_TienLenMN] = true;
s_game_available[GameType.GAME_Phom] = true;
s_game_available[GameType.GAME_Sam] = true;
s_game_available[GameType.GAME_BaCay] = false;
s_game_available[GameType.GAME_XocDia] = false;
s_game_available[GameType.GAME_TaiXiu] = false;
s_game_available[GameType.GAME_VongQuayMayMan] = false;
s_game_available[GameType.GAME_TLMN_Solo] = true;
s_game_available[GameType.GAME_Sam_Solo] = true;
s_game_available[GameType.GAME_Lieng] = false;
s_game_available[GameType.GAME_BaCayChuong] = false;
s_game_available[GameType.MiniGame_ChanLe] = false;
s_game_available[GameType.MiniGame_CaoThap] = true;
s_game_available[GameType.MiniGame_Poker] = true;
s_game_available[GameType.MiniGame_VideoPoker] = true;

var s_game_id = s_game_id || [
    [
        GameType.GAME_TLMN_Solo, GameType.GAME_TienLenMN,
        GameType.MiniGame_CaoThap, GameType.MiniGame_Poker,
        GameType.GAME_XocDia, GameType.GAME_TaiXiu,
        GameType.GAME_Sam_Solo, GameType.GAME_Sam,
        GameType.GAME_Phom, GameType.GAME_BaCay,
        GameType.GAME_VongQuayMayMan, GameType.MiniGame_VideoPoker,
        //GameType.GAME_MauBinh,GameType.MiniGame_ChanLe
    ],
    [
        GameType.GAME_TLMN_Solo, GameType.GAME_TienLenMN,
        GameType.GAME_Sam_Solo, GameType.GAME_Sam,
        GameType.GAME_Phom, GameType.GAME_BaCay,
        GameType.GAME_MauBinh
    ],
    [
        GameType.MiniGame_CaoThap, GameType.MiniGame_Poker,
        /*GameType.MiniGame_ChanLe*/GameType.MiniGame_VideoPoker
    ],
    [
        GameType.GAME_VongQuayMayMan
    ],
    [
        GameType.GAME_TLMN_Solo, GameType.GAME_TienLenMN,
        GameType.MiniGame_CaoThap, GameType.MiniGame_Poker
    ]
];

var s_mini_game_id = [GameType.MiniGame_CaoThap, GameType.MiniGame_Poker, GameType.MiniGame_VideoPoker];
var s_games_display_name = s_games_display_name || [];
s_games_display_name[GameType.GAME_TLMN_Solo] = "TIẾN LÊN MIỀN NAM ĐẾM LÁ SOLO";
s_games_display_name[GameType.GAME_TienLenMN] = "TIẾN LÊN MIỀN NAM";
s_games_display_name[GameType.GAME_Sam] = "SÂM LỐC";
s_games_display_name[GameType.GAME_Sam_Solo] = "SÂM SOLO";
s_games_display_name[GameType.GAME_XocDia] = "XÓC ĐĨA";
s_games_display_name[GameType.GAME_TaiXiu] = "TÀI XỈU";
s_games_display_name[GameType.GAME_MauBinh] = "MẬU BINH";
s_games_display_name[GameType.GAME_Phom] = "PHỎM";
s_games_display_name[GameType.GAME_BaCay] = "BA CÂY NHẤT ĂN TẤT";
s_games_display_name[GameType.GAME_Lieng] = "LIÊNG";
s_games_display_name[GameType.GAME_BaCayChuong] = "BA CÂY CHƯƠNG";
s_games_display_name[GameType.MiniGame_CaoThap] = "Cao thấp";
s_games_display_name[GameType.MiniGame_Poker] = "MiniPoker";
s_games_display_name[GameType.MiniGame_VideoPoker] = "VideoPoker";

var s_games_chanel = s_games_chanel || [];
s_games_chanel[GameType.GAME_TLMN_Solo] = "tlmn_solo";
s_games_chanel[GameType.GAME_TienLenMN] = "tlmn_tudo";
s_games_chanel[GameType.GAME_Sam] = "sam_tudo";
s_games_chanel[GameType.GAME_Sam_Solo] = "sam_solo";
s_games_chanel[GameType.GAME_XocDia] = "xocdia";
s_games_chanel[GameType.GAME_TaiXiu] = "taixiu";
s_games_chanel[GameType.GAME_MauBinh] = "maubinh";
s_games_chanel[GameType.GAME_Phom] = "Phom";
s_games_chanel[GameType.GAME_BaCay] = "bacay";
s_games_chanel[GameType.GAME_Lieng] = "lieng";
s_games_chanel[GameType.GAME_BaCayChuong] = "bacaychuong";

var s_games_chanel_id = s_games_chanel_id || {};
(function () {
    for(var i=0;i<s_games_chanel.length;i++){
        var gameName = s_games_chanel[i];
        if(gameName && gameName != ""){
            s_games_chanel_id[gameName] = i;
        }
    }
})();

var PlayerMe = PlayerMe || {};
PlayerMe.username = "quyetnd";
PlayerMe.password = "1234567";
PlayerMe.phoneNumber = "0123456789";
PlayerMe.gameType = "";
PlayerMe.gold = 1000;
PlayerMe.exp = 11000;
PlayerMe.vipExp = 1000;
PlayerMe.spin = 0;
PlayerMe.messageCount = 0;
PlayerMe.SFS = PlayerMe.SFS || {};

var GameConfig = GameConfig || {};
GameConfig.email = "gamebai-c567@gmail.com";
GameConfig.hotline = "09000123";
GameConfig.broadcastMessage = "";
GameConfig.DeviceIDKey = "";

var LevelData = null;
var VipData = null;

cc.Global.GetLevel = function (exp) {
    if(!LevelData){
        if(cc.sys.isNative){
            LevelData = JSON.parse(jsb.fileUtils.getStringFromFile("res/data/LevelData.json"));
        }
        else{
            LevelData = cc.loader.getRes("res/data/LevelData.json");
        }
    }

    var preLevel = LevelData[0];
    for(var i=1;i<LevelData.length;i++){
        var obj = LevelData[i];
        if(exp >= preLevel.exp && exp < obj.exp){
            var expPer = 100.0 * (exp - preLevel.exp) / (obj.exp - preLevel.exp);
            return {
                level : i-1,
                expPer : expPer,
                content : preLevel.content
            };
        }
        preLevel = obj;
    }
    return {
        level : LevelData.length-1,
        expPer : 100.0,
        content : preLevel.content
    };
};
cc.Global.GetVip = function (exp) {
    if(!VipData){
        if(cc.sys.isNative){
            VipData = JSON.parse(jsb.fileUtils.getStringFromFile("res/data/VipData.json"));
        }
        else{
            VipData = cc.loader.getRes("res/data/VipData.json");
        }
    }

    var preLevel = VipData[0];
    for(var i=1;i<VipData.length;i++){
        var obj = VipData[i];
        if(exp >= preLevel.exp && exp < obj.exp){
            var expPer = 100.0 * (exp - preLevel.exp) / (obj.exp - preLevel.exp);
            return {
                level : i-1,
                expPer : expPer,
                content : preLevel.content
            };
        }
        preLevel = obj;
    }
    return {
        level : VipData.length-1,
        expPer : 100.0,
        content : preLevel.content
    };
};

cc.Global.GetLevelMe = function () {
    return cc.Global.GetLevel(PlayerMe.exp);
};
cc.Global.GetVipMe = function () {
    return cc.Global.GetVip(PlayerMe.vipExp);
};

cc.Global.GetSetting = function (setting, defaultValue) {
    var value = cc.sys.localStorage.getItem(JSON.stringify(setting));
    if(value){
        return JSON.parse(value);
    }
    return defaultValue;
};
cc.Global.SetSetting = function (setting, value) {
    cc.sys.localStorage.setItem(JSON.stringify(setting), JSON.stringify(value));
};

var ApplicationConfig = ApplicationConfig || {};
ApplicationConfig.VERSION = "1.0.0";
ApplicationConfig.BUNBLE = "com.iluckystarvn.daisiu";
ApplicationConfig.DISPLAY_TYPE = "room"; //room - betting
(function () {
    if(cc.sys.isNative){
        if(cc.sys.os === cc.sys.OS_IOS){
            ApplicationConfig.PLATFORM = 1;
        }
        else if(cc.sys.os === cc.sys.OS_ANDROID){
            ApplicationConfig.PLATFORM = 2;
        }
        else if(cc.sys.os === cc.sys.OS_WINRT){
            ApplicationConfig.PLATFORM = 3;
        }
        else if(cc.sys.os === cc.sys.OS_WINDOWS){
            ApplicationConfig.PLATFORM = 3;
        }
        else{
            ApplicationConfig.PLATFORM = 4;
        }
    }
    else{
        ApplicationConfig.PLATFORM = 4;
    }
})();

cc.Global.NodeIsVisible = function (node) {
    while(node){
        if(!node.visible){
            return false;
        }
        node = node.getParent();
    }
    return true;
};