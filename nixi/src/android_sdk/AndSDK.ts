// TypeScript file
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

egret.ExternalInterface.addCallback("callLoginSuccess", loginSuccess);