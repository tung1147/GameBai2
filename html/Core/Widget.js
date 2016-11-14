/**
 * Created by QuyetNguyen on 11/9/2016.
 */
var newui = newui || {};
newui.Widget = ccui.Widget.extend({
    ctor : function (containerSize) {
        this._ignoreSize = true;
        this._super();
        this.setVirtualRendererSize(containerSize);
    },
    setVirtualRendererSize : function (vitualSize) {
        this._vitualSize = cc.size(vitualSize);
    },
    getVirtualRendererSize : function () {
        if(this._vitualSize){
            return cc.size(this._vitualSize);
        }
        else{
            return cc.size(this._contentSize);
        }
    }
});