/**
 * Created by Quyet Nguyen on 7/20/2016.
 */
var LobbyClient = LobbyClient || {};
LobbyClient.Error = {
    6 : {
        message : "Tài khoản không tồn tại",
        logout : true,
    },
    7 : {
        message : "Sai mật khẩu", //change password
        logout : false,
    },
    10 : {
        message : "Tài khoản đã tồn tại",
        logout : true,
    },
    11 : {
        message : "Bạn phải cập nhật phiên bản",
        logout : true,
    },
    12 : {
        message : "Đăng nhập phòng chơi thất bại",
        logout : false,
    },
    13 : {
        message : "Đăng nhập facebook hết hạn",
        logout : true,
    },
    14 : {
        message : "Số điện thoại không hợp lệ",
        logout : false,
    },
    15 : {
        message : "Bạn không thể gửi yêu cầu trong 5 phút",
        logout : false,
    },
    19 : {
        message : "Tài khoản chưa được xác thực", //đổi thưởng
        logout : false,
    },
    20 : {
        message : "Sai số điện thoại",
        logout : false,
    },
    21 : {
        message : "Nhập code sai quá 5 lần", //đổi thưởng
        logout : false,
    },
    25 : {
        message : "Số điện thoại đã được sử dụng",
        logout : false,
    },
    27 : {
        message : "Bạn không đủ tiền",
        logout : false,
    },
    28 : {
        message : "Bạn nhập sai mật khẩu", //login
        logout : true,
    },
    29 : {
        message : "Tài khoản không được chứa ký tự đặc biệt",
        logout : true,
    },
    30 : {
        message : "Tài khoản phải dài từ 6-32 kí tự",
        logout : true,
    },
    31 : {
        message : "Bạn đăng ký quá nhiều tài khoản",
        logout : true,
    },
    32 : {
        message : "Mật khẩu không hợp lệ",
        logout : true,
    },
    300 : {
        message : "Không đủ tiền đổi thưởng",
        logout : false,
    },
    301 : {
        message : "Sai product id",
        logout : false,
    },
    302 : {
        message : "Sai cashin type",
        logout : false,
    },
    303 : {
        message : "Sai telco id",
        logout : false,
    },
    304 : {
        message : "Sai mã nhà mạng",
        logout : false,
    },
    305 : {
        message : "Không tìm thấy thông tin thẻ",
        logout : false,
    },
    306 : {
        message : "Lỗi nhà cung cấp thẻ",
        logout : false,
    },
    307 : {
        message : "Thẻ đã được sử dụng",
        logout : false,
    },
    308 : {
        message : "Độ dài code ko hợp lệ",
        logout : false,
    },
    309 : {
        message : "Độ dài serial không hợp lệ",
        logout : false,
    },
    310 : {
        message : "Bạn chưa đủ điều kiện đổi thưởng",
        logout : false,
    },
    310 : {
        message : "Vượt quá mức đổi thưởng trong ngày",
        logout : false,
    },
};

LobbyClient.ErrorHandle = function (errorCode) {
    LoadingDialog.getInstance().hide();
    var errorHandler = LobbyClient.Error[errorCode];
    if(!errorHandler){
        errorHandler = {
            message : "Có lỗi xảy ra [" + errorCode +"]",
            logout : true
        }
    }
    if(errorHandler.logout){
        var runningScene = cc.director.getRunningScene();
        if(runningScene.type == "HomeScene"){
            if(runningScene.homeLocation != 1){
                runningScene.startHome();
            }
            MessageNode.getInstance().show(errorHandler.message);
        }
        else{
            var scene = new HomeScene();
            scene.startHome();
            MessageNode.getInstance().showWithParent(errorHandler.message,  scene.popupLayer);
            cc.director.replaceScene(scene);
        }

        LobbyClient.getInstance().close();
        SmartfoxClient.getInstance().close();
    }
    else{
        MessageNode.getInstance().show(errorHandler.message);
    }
};

