/**
 * Created by QuyetNguyen on 11/9/2016.
 */
var newui = newui || {};
// newui.TextField = ccui.TextField;
// newui.TextField.prototype.setAlignment = function () {
//
// };
// newui.TextField.prototype.setReturnCallback = function () {
//
// };


newui.TextField = cc.Node.extend({
    ctor : function () {
        this._super()
       // this.init();
    },

    /**
     * @method setPasswordEnable
     * @param {bool} arg0
     */
    setPasswordEnable : function (bool)
    {

    },

    /**
     * @method setText
     * @param {String} arg0
     */
    setText : function (str)
    {

    },

    /**
     * @method setReturnCallback
     * @param {function} arg0
     */
    setReturnCallback : function (func) {

    },

    /**
     * @method getText
     * @return {String}
     */
    getText : function ()
    {
        return "";
    },

    /**
     * @method initWithBMFont
     * @param {size_object} arg0
     * @param {String} arg1
     * @param {String} arg2
     */
    initWithBMFont : function (size, str, str)
    {
    },

    /**
     * @method setMaxLength
     * @param {int} arg0
     */
    setMaxLength : function (int)
    {
    },

    /**
     * @method setPlaceHolder
     * @param {String} arg0
     */
    setPlaceHolder : function (str)
    {
    },

    /**
     * @method initWithTTFFont
     * @param {size_object} arg0
     * @param {String} arg1
     * @param {float} arg2
     * @param {String} arg3
     * @param {float} arg4
     */
    initWithTTFFont : function (size, str, float, str, float)
    {
    },

    /**
     * @method initWithSize
     * @param {size_object} arg0
     */
    initWithSize : function (size)
    {
    },

    /**
     * @method setPlaceHolderColor
     * @param {color4b_object|color3b_object} color4b
     */
    setPlaceHolderColor : function(color3b)
    {
    },

    /**
     * @method setTextColor
     * @param {color4b_object|color3b_object} color4b
     */
    setTextColor : function(color3b)
    {

    },

    /**
     * @method showKeyboard
     *
     */
    showKeyboard : function(){

    },

    /**
     * @method hideKeyboard
     *
     */
    hideKeyboard : function(){

    },

    /**
     * @method setAlignment
     *
     */
    setAlignment : function(){

    }
});