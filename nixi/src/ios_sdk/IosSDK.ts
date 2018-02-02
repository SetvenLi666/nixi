// TypeScript file
var ios_order_info: string = null;

function loginSuccess(uuid: string) {
    if (uuid == "") {
        loginImageBtn.touchEnabled = true;
        // Prompt.showPrompt(egret.MainContext.instance.stage, "参数错误");
    } else {
        NetLoading.showLoading();
        var request: egret.URLRequest = HttpProtocolMgr.easyLogin_900(ConstData.Conf.channel, uuid);
        HttpMgr.postRequest(request);
    }
}

function paySuccess(order_info: string) {
    console.log("pay success");
    NetLoading.showLoading();
    // var request = HttpProtocolMgr.refresh_pay_info_116(curProductId);
    // HttpMgr.postRequest(request);
    var arr: string[] = order_info.split(";");
    var request = HttpProtocolMgr.checkIosOrderInfo_133(arr[0], arr[1], ios_order_info);
    HttpMgr.postRequest(request);
}

function payFail() {
    console.log("pay fail");
}

function setIosOrderInfo(info: string) {
    ios_order_info = info;
}

window['ExternalInterface']['addCallback']("callLoginSuccess", loginSuccess);
window['ExternalInterface']['addCallback']("paySuccess", paySuccess);
window['ExternalInterface']['addCallback']("payFail", payFail);
window['ExternalInterface']['addCallback']("setIosOrderInfo", setIosOrderInfo);