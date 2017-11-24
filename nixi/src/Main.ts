//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {
    /**
     * 加载进度界面
     * loading process interface
     */
    private loadingView: LoadingUI;

    public constructor() {
        super();
        var stage: egret.Stage = egret.MainContext.instance.stage;

        //跨域问题
        egret.ImageLoader.crossOrigin = "anonymous";

        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        stage.registerImplementation("eui.IAssetAdapter", assetAdapter);
        stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        //Config loading process interface
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        stage.addChild(this.loadingView);

        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.setMaxLoadingThread(8); //设置最大并发加载线程数量
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }
    // protected createChildren(): void {
    //     super.createChildren();
    //     //inject the custom material parser
    //     //注入自定义的素材解析器
    //     var assetAdapter = new AssetAdapter();
    //     this.stage.registerImplementation("eui.IAssetAdapter",assetAdapter);
    //     this.stage.registerImplementation("eui.IThemeAdapter",new ThemeAdapter());
    //     //Config loading process interface
    //     //设置加载进度界面
    //     this.loadingView = new LoadingUI();
    //     this.stage.addChild(this.loadingView);
    //     // initialize the Resource loading library
    //     //初始化Resource资源加载库
    //     RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
    //     RES.loadConfig("resource/default.res.json", "resource/");
    // }
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // 加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("common");
    }
    private isThemeLoadEnd: boolean = false;
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the 
     */
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
        this.createScene();
    }

    private isResourceLoadEnd: boolean = false;
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        this.stage.removeChild(this.loadingView);
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        this.isResourceLoadEnd = true;
        this.createScene();
    }

    private createScene() {
        if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
            this.startCreateScene();
        }
    }
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
    }
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected startCreateScene(): void {
        //初始化依赖模块
        this.initGameDependance();
    }

    private initGameDependance() {
        HttpMgr.init();

        window["OPEN_DATA"] = {
            openid: "aaaa",
            openkey: "bbbbb",
            platform: 1
        }

        LoginData.config_UUID();
        SceneMgr.gotoLogin();


        // console.log(window["OPEN_DATA"]);
        // this.WanbaLogin();
        // this.WanbaShare();

        var logo = window["logo"];
        if (logo) {
            logo.parentNode.removeChild(logo);
        }
    }

    private WanbaLogin() {
        window["getOpenKey"](function (result) {
            console.log(JSON.stringify(result));
            if (result["code"] == 0) {

            } else {
                alert("获取登录态失败");
            }
            var urlRequest = new egret.URLRequest(ConstData.Conf.WanbaLoginAddr);
            urlRequest.method = egret.URLRequestMethod.POST;
            var data: string = "";
            data = "openid=" + window["OPEN_DATA"].openid + "&openkey=" + window["OPEN_DATA"].openkey + "&platform=" + window["OPEN_DATA"].platform;
            urlRequest.data = data;
            var urlLoader = new egret.URLLoader();
            urlLoader.addEventListener(egret.Event.COMPLETE, function (evt: egret.Event) {
                var loader = <egret.URLLoader>evt.target;
                var data: {} = JSON.parse(loader.data);
                if (data["result"] == "SUCCESS") {
                    LoginData.configWanbaUUID(data);
                    SceneMgr.gotoLogin();
                }
            }, this);
            urlLoader.load(urlRequest);
        });
    }

    private WanbaShare() {
        window["mqq"].ui.setOnShareHandler(function (type) {
            window["mqq"].ui.shareMessage({
                title: '逆袭之星途闪耀',
                desc: '逆袭成为超级巨星，霸道总裁、温柔暖男、绝色男神随你挑！',
                share_type: type,
                share_url: window["OPEN_DATA"].shareurl,
                image_url: window["OPEN_DATA"].appicon,
                back: true
            }, function (result) {
                //result
                if (result["retCode"] == 0) {
                    window["mqq"].ui.showTips({
                        text: "分享成功！"
                    });

                    if (ShareData.shareTimes == 0) {
                        var request = HttpProtocolMgr.take_share_reward_175("do_share_reward");
                        HttpMgr.postRequest(request);

                        DataMgr.checkNews();
                    }
                } else if (result["retCode"] == 1) {
                    window["mqq"].ui.showTips({
                        text: "分享取消！"
                    });
                }
            });
        });
    }
}
