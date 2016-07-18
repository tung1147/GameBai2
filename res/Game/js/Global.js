/**
 * Created by Quyet Nguyen on 7/6/2016.
 */

String.prototype.insertAt=function(index, string) {
    return this.substr(0, index) + string + this.substr(index);
}

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

cc.Global.NumberFormat2 = function (number) {
    return number.toString();
};

//cc.winSize.screenScale = cc.winSize.width / 1280.0;
cc.res = cc.res || {};
cc.res.font = cc.res.font || {};
cc.res.font.Roboto_Condensed = "res/fonts/Roboto-Condensed.ttf";
cc.res.font.Roboto_CondensedBold = "res/fonts/Roboto-BoldCondensed.ttf";
cc.res.font.UTM_AvoBold = "res/fonts/UTM-AvoBold.ttf";

cc.res.font.Roboto_Condensed_40 = "res/fonts/RobotoCondensed_40.fnt";
cc.res.font.Roboto_CondensedBold_40 = "res/fonts/RobotoBoldCondensed_40.fnt";
cc.res.font.UTM_AvoBold_40 = "res/fonts/UTMAvoBold_40.fnt";

cc.res.font.Roboto_Condensed_30 = "res/fonts/RobotoCondensed_30.fnt";
cc.res.font.Roboto_CondensedBold_30 = "res/fonts/RobotoBoldCondensed_30.fnt";
cc.res.font.UTM_AvoBold_30 = "res/fonts/UTMAvoBold_30.fnt";

cc.res.font.Roboto_Condensed_25 = "res/fonts/RobotoCondensed_25.fnt";
cc.res.font.Roboto_CondensedBold_25 = "res/fonts/RobotoBoldCondensed_25.fnt";
cc.res.font.UTM_AvoBold_25 = "res/fonts/UTMAvoBold_25.fnt";

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
GameType.MiniGame_Pocker = 14;

var s_game_id = [
    [
        GameType.GAME_TLMN_Solo, GameType.GAME_TienLenMN,
        GameType.MiniGame_CaoThap, GameType.MiniGame_Pocker,
        GameType.GAME_XocDia, GameType.GAME_TaiXiu,
        GameType.GAME_Sam_Solo, GameType.GAME_Sam,
        GameType.GAME_Phom, GameType.GAME_BaCay,
        GameType.GAME_VongQuayMayMan, GameType.MiniGame_ChanLe,
        GameType.GAME_MauBinh
    ],
    [
        GameType.GAME_TLMN_Solo, GameType.GAME_TienLenMN,
        GameType.GAME_Sam_Solo, GameType.GAME_Sam,
        GameType.GAME_Phom, GameType.GAME_BaCay,
        GameType.GAME_MauBinh
    ],
    [
        GameType.MiniGame_CaoThap, GameType.MiniGame_Pocker,
        GameType.MiniGame_ChanLe
    ],
    [
        GameType.GAME_VongQuayMayMan
    ],
    [
        GameType.GAME_TLMN_Solo, GameType.GAME_TienLenMN,
        GameType.MiniGame_CaoThap, GameType.MiniGame_Pocker
    ]
];

var s_mini_game_id = [GameType.MiniGame_CaoThap, GameType.MiniGame_Pocker, GameType.MiniGame_ChanLe];
var s_games_display_name = [];
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

var PlayerMe = PlayerMe || {};
PlayerMe.username = "quyetnd";
PlayerMe.password = "1234567";
PlayerMe.verify = true;
PlayerMe.phoneNumber = "0123456789";
PlayerMe.gold = 1000;
PlayerMe.exp = 1000;
PlayerMe.vipExp = 1000;
PlayerMe.messageCount = 100;