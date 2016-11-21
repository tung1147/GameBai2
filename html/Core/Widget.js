/**
 * Created by QuyetNguyen on 11/9/2016.
 */
var newui = newui || {};
newui.Widget = ccui.Widget.extend({
    ctor : function (containerSize) {
        this._super();
        this._ignoreSize = true;
        this.setVirtualRendererSize(containerSize);
    },
    setVirtualRendererSize : function (containerSize) {
        cc.log("aa: "+containerSize.width + " - "+containerSize.height);
        this._vitualSize = cc.size(containerSize);
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