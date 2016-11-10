/**
 * Created by QuyetNguyen on 11/9/2016.
 */
var newui = newui || {};
newui.Widget = ccui.Widget.extend({
    ctor : function (size) {
        this._super();
        this.setContentSize(size);
    }

    // setVirtualRendererSize : function (size)
    // {
    //
    // },
    //
    // /**
    //  * @method getVirtualRendererSize
    //  * @return {size_object}
    //  */
    // getVirtualRendererSize : function ()
    // {
    //     return cc.Size;
    // },
});