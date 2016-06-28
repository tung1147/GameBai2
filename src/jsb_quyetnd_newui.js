/**
 * Created by Quyet Nguyen on 6/28/2016.
 */
newui.TableView.prototype._ctor = function (size, row) {
    this.initWithSize(size, row);
    return true;
};

newui.EditBox.prototype._ctor = function () {
    if(arguments.length == 1){
        this.initWithSize(arguments[0]);
    }
    else if(arguments.length == 3){
        this.initWithSizeAndBackgroundSprite(arguments[0], arguments[1], arguments[2]);
    }
    return true;
};