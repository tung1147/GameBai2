/**
 * Created by QuyetNguyen on 11/10/2016.
 */

var cc = cc || {};
cc.Label = cc.Label || {};
cc.Label.createWithBMFont = function () {
    //str, fntFile, alignment, width, imageOffset
    if(arguments.length == 2){
        return new cc.LabelBMFont(arguments[1], arguments[0]);
    }
    else if(arguments.length == 3){
        return new cc.LabelBMFont(arguments[1], arguments[0], 0, arguments[2]);
    }
    else if(arguments.length == 4){
        return new cc.LabelBMFont(arguments[1], arguments[0], arguments[3], arguments[2]);
    }
    else if(arguments.length == 5){
        return new cc.LabelBMFont(arguments[1], arguments[0], arguments[3], arguments[2], arguments[4]);
    }
};

cc.LabelBMFont.prototype.getLineHeight = function () {
    return 0;
};

cc.LabelBMFont.prototype.setDimensions = function () {

};

var jsb = jsb || {};
jsb.fileUtils = jsb.fileUtils || {};
jsb.fileUtils.getStringFromFile = function (fileName) {
    var str =  cc.loader.getRes(fileName);
    return 0;
   // return fileName;
};

cc.PointZero = function () {
    return cc.p(0,0);
}

ccui.Button.prototype.getRendererNormal = function () {
    return this._buttonNormalRenderer;
};