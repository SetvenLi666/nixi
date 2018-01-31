/**
 * 游戏自定义网络协议，非游戏内协议请勿使用
 * 规则：通过返回信息中的cid调用
*/
class HttpMgr {
    static handlers: Object = {};
    static getter: egret.URLLoader = new egret.URLLoader();
    static postter: egret.URLLoader = new egret.URLLoader();

    static init() {
        console.log("HttpMgr::init()");
        HttpMgr.getter.addEventListener(egret.Event.COMPLETE, this._onGetComplete, this);
        HttpMgr.postter.addEventListener(egret.Event.COMPLETE, this._onPostComplete, this);
    }

    static getRequest(urlReq: egret.URLRequest) {
        console.log("HttpMgr::getRequest()");
        this.getter.load(urlReq);
    }

    static postRequest(urlReq: egret.URLRequest) {
        console.log("HttpMgr::postRequest()");
        this.postter.load(urlReq);
    }

    static _onGetComplete(event: egret.Event): void {
        console.log("HttpMgr::_onGetComplete()");
        var loader: egret.URLLoader = <egret.URLLoader>event.target;
        // console.log(data.toString());
        this._handleResoult(loader.data);
    }

    static _onPostComplete(event: egret.Event): void {
        console.log("HttpMgr::_onPostComplete()");
        var loader: egret.URLLoader = <egret.URLLoader>event.target;
        this._handleResoult(loader.data);
    }

    static _handleResoult(data: string) {
        try {
            var obj = JSON.parse(data);
        } catch (e) {
            return;
        }

        console.log(obj);
        var cid: number = obj["cid"];
        var code: number = obj["code"];
        var content: Object = obj["content"];
        console.log(content);

        var extraData: any = null;
        if (0 !== code) {
            if (code == 11000) {
                Prompt.showPrompt(egret.MainContext.instance.stage, "玩家已离线，正在重新登录!");
                SceneMgr.gotoLogin();
                NetLoading.removeLoading();
                return;
            } else if (code == 11601) {
                NetLoading.removeLoading();
            } else {
                console.log("Error: - " + cid + " - " + content);
                Prompt.showPrompt(egret.MainContext.instance.stage, <string>content);
                NetLoading.removeLoading();
                return;
            }
        }

        if (900 === cid) {
            LoginData.update(content);
        }
        else if (902 === cid) {
            /* {"sign":"17f2ba008f5dd96de42aad9436392694",
                    "content":{
                        "show":{"reset":0,"ornaments":{"20":70000,"19":70000,"18":70000,"17":70000,"16":70000,"15":70000,"14":70000,"13":70000,"12":70000,"11":70000},"ondress":{"9":90000,"8":80000,"6":60000,"5":50000,"4":40000,"3":30000,"2":20000,"10":100000,"1":10000},
                            "nickname":"游客8A79B644","collected":0},
                        "purchase":{"last":0,"energy_gain":100,"energy_cost":50,"eb_times":0,"eb_limit":3,"deals":{},"deadline":0,"coin_gain":1500,"coin_cost":80,"ce_times":0,"ce_limit":3},
                        "player":{"update":1473851277940397869,"rating":{"8":0,"7":0,"6":0,"5":0,"4":0,"3":0,"2":0,"1":0,"0":0},"phase":1,"mission":1,"left":360,"guide":1,"energy":100,"diam":100,"coin":1000},
                        "news":{"SC":0,"S7":0,"S30":0,"PA":0,"P":0,"O":0,"M":0,"I":0,"EL2":1,"EL1":0,"C":1}},
                        "code":0,
                        "cid":902}
            */
            PlayerData.update(content["player"]);
            PurchaseData.update(content["purchase"]);
            NewsData.update(content["news"]);
            ShowData.update(content["show"]);
            GashaponData.replace_gashapon_user(content["gashapon"]);

            ClothesData.updateUserClohtes(content["clothes"])

            //触发引导
            ClientMapData.updateClientMapData(content["client_setting_map"]);

            //礼包
            WanbaData.updatePackageData(content["h5wanba"]["buy_libao_list"])
            //分享发送桌面
            ShareData.update(content["h5wanba"]);

            //邀请数据
            InviteData.updateInviteData(content["invite"]);

            //每日必做
            WelfareData.updateWelfareData(content["welfare"]);

            ChatData.notice = content["notif"];
            ClothesData.setClothesCache(ShowData.dresses, ShowData.ornaments);
            EnergyCD.init();
            EnergyCD.updateEnergyCD();
            egret.setInterval(DataMgr.checkNews, DataMgr, 60000);
        }
        else if (904 === cid) {
            ShowData.update(content["show"]);
        }
        else if (910 === cid) {
            console.log("HttpMgr 910 callback");
            NewsData.update(content["news"]);
        }

        else if (907 === cid) {
            PlayerData.update(content["player"]);
            // this.createEnergyTime();
            EnergyCD.updateEnergyCD();
            ShowData.update(content["show"]);
        }

        else if (905 === cid) {
            PlayerData.update(content["player"]);
            // this->creat_Energy_Time();
            EnergyCD.updateEnergyCD();
        }

        else if (831 === cid) {
            PlayerData.update(content["player"]);
        }

        else if (827 === cid) {
            CompetitionData.createSelfInfo(content["competition"]);
            CompetitionData.createOpponentInfo(content["opponent"]);
        }

        else if (825 === cid) {
            PlayerData.update(content["player"]);
            CompetitionData.createSelfInfo(content["competition"]);
        }

        else if (823 === cid) {
            PlayerData.update(content["player"]);
            CompetitionData.createSelfInfo(content["competition"]);
        }

        else if (821 === cid) {
            PlayerData.update(content["player"]);
            CompetitionData.createSelfInfo(content["competition"]);
            CompetitionData.createOpponentInfo(content["opponent"]);
        }

        else if (820 === cid) {
            CompetitionData.createThemeInfo(content["theme"]);
            CompetitionData.createSelfInfo(content["competition"]);
            CompetitionData.createRanklist(content["ranklist"]);
        }

        else if (813 === cid) {
            SocialData.update(content["social"]);
            FriendData.update(content["friends"]);
        }

        else if (811 === cid) {
            PaperData.delete_paper(content["id"]);
        }

        else if (809 === cid) {

        }

        else if (808 === cid) {
            SocialData.init_friends(content["friends"]);
            PaperData.initPaperData(content["paper"]);
            NewsData.update(content["news"]);
            // nc->postNotification("UPDATE_NEWS_STATUS");
        } else if (807 === cid) {
            PlayerData.update(content["player"]);
            EnergyCD.updateEnergyCD();
            SocialData.update(content["social"]);
            extraData = content["info"];
        }

        else if (806 === cid) {
            FriendData.update(content["friends"]);
        }

        else if (805 === cid) {
            SocialData.update(content["social"]);
            MessageData.update(content["messages"]);
        }

        else if (803 === cid) {
            SocialData.update(content["social"]);
            extraData = content["type"];
        }

        else if (804 === cid) {
            MessageData.update(content["messages"]);
            NewsData.update(content["news"]);
            // nc->postNotification("UPDATE_NEWS_STATUS");
        }

        else if (802 === cid) {
            StrangerData.initStrangerData(content["strangers"]);
        }

        else if (801 === cid) {
            extraData = content["other"];
        }

        else if (800 === cid) {
            SocialData.update(content["social"]);
        }

        else if (707 === cid) {
            extraData = content["first"];
        }

        else if (705 === cid) {
            PlayerData.update(content["player"]);
            HomeData.replace_home_info(content["home"]);
            if (content["player"]) {
                extraData = "购买成功~";
            } else {
                extraData = "切换成功~";
            }
        }

        else if (704 === cid) {
            HomeData.init_house_template(content["template"]);
            HomeData.replace_home_info(content["home"]);
        }

        else if (701 === cid) {
            if (content["player"]) {
                PlayerData.update(content["player"]);
                if (content["purchase"]) {
                    PurchaseData.update(content["purchase"]);
                }
                ClothesData.updateUserClohtes(content["clothes"]);
                EnergyCD.updateEnergyCD();
                extraData = {};
                extraData.info = content["info"];
                extraData.reward = content["reward"];
                if (content["h5wanba"]) {
                    ShareData.update(content["h5wanba"]);
                }
                // extraData = content["info"];
            } else {
                extraData = content;
            }
        }

        else if (700 === cid) {
            MailData.initMailData(content["mail"]);
            NewsData.update(content["news"]);
            // nc->postNotification("UPDATE_NEWS_STATUS");
        }

        else if (600 === cid) {
            TaskData.updateUserData(content["mission"]);

            CofferData.initTemplateData(content["template"]);
            CofferData.updateUserData(content["coffers"]);
        }
        else if (603 === cid) {
            TaskData.gameTask = false;
            PlayerData.update(content["player"]);
            EnergyCD.updateEnergyCD();
            TaskData.updateUserData(content["mission"]);
            extraData = content["result"];
            ClothesData.addDropClothes(extraData["clothes"]);
        }

        else if (605 === cid) {
            TaskData.gameTask = false;
            PlayerData.update(content["player"]);
            EnergyCD.updateEnergyCD();
            TaskData.updateUserData(content["mission"]);
            extraData = content["result"];
        }

        else if (610 === cid) {
            EventData.init_precondition(content["precon"]);
            EventData.init_template(content["template"]);
            EventData.update_user_data(content["mystery"]);
        }

        else if (611 === cid) {
            PlayerData.update(content["player"]);
            EnergyCD.updateEnergyCD();
            extraData = content["id"];
        }

        else if (615 === cid) {
            PlayerData.update(content["player"]);
            ClothesData.updateUserClohtes(content["clothes"]);
            EventData.update_user_data(content["mystery"]);

            if (content["id"]) {
                extraData = content["id"];
            } else {
                extraData = content["category"];
            }
        }

        else if (630 === cid) {
            WelfareData.updateWelfareData(content["welfare"]);
        }

        else if (631 === cid) {
            WelfareData.updateWelfareData(content["welfare"]);
            PlayerData.update(content["player"]);
            extraData = content["id"];
        }

        else if (633 === cid) {
            WelfareData.updateWelfareData(content["welfare"]);
            PlayerData.update(content["player"]);
            extraData = content["id"];
        }

        else if (500 === cid) {
            StoryData.updateCompletedStory(content["story"]);
        }
        else if (501 === cid) {
            PlayerData.update(content["player"]);
            EnergyCD.updateEnergyCD();
        }
        else if (503 === cid) {
            PlayerData.update(content["player"]);
            EnergyCD.updateEnergyCD();
            StoryData.updateCompletedStory(content["story"]);
            extraData = content["extra"];
        }

        else if (504 === cid) {
            StoryData.updateCompletedVipStory(content["story2"]);
        }

        else if (507 === cid) {
            StoryData.updateCompletedVipStory(content["story2"]);
        }
        else if (509 === cid) {
            PlayerData.update(content["player"]);
            EnergyCD.updateEnergyCD();
        }
        else if (515 === cid) {
            PlayerData.update(content["player"]);
            EnergyCD.updateEnergyCD();
            StoryData.updateCompletedVipStory(content["story2"]);
        }

        else if (400 === cid) {
            ClothesData.updateUserClohtes(content["clothes"])
        }

        // else if (401 === cid) {
        //     PlayerData.update(content["player"]);
        //     EnergyCD.updateEnergyCD();
        //     ShowData.update(content["show"]);
        //     ClothesData.updateOwnClothes(content["newclothes"]);
        // }

        else if (403 === cid) {
            PlayerData.update(content["player"]);
            EnergyCD.updateEnergyCD();
            ShowData.update(content["show"]);
            ClothesData.updateOwnClothes(content["newclothes"]);
            GashaponData.replace_gashapon_user(content["gashapon"]);
        }

        else if (405 === cid) {
            PlayerData.update(content["player"]);
            EnergyCD.updateEnergyCD();
            ShowData.update(content["show"]);
            ClothesData.updateOwnClothes(content["newclothes"]);
            GashaponData.replace_gashapon_user(content["gashapon"]);
            CompetitionData.createSelfInfo(content["competition"]);
        }

        else if (340 === cid) {
            ShuangdanData.updateTemplate(content);
        }

        else if (341 === cid) {
            PlayerData.update(content["player"]);
            ClothesData.updateUserClohtes(content["clothes"]);
            ShuangdanData.updateInfo(content["info"]);
        }

        else if (333 === cid) {
            PlayerData.update(content["player"]);
            extraData = content["result"];
        }

        else if (323 === cid) {
            NewsData.update(content["news"]);
            // nc->postNotification("UPDATE_NEWS_STATUS");
            PlayerData.update(content["player"]);
            EnergyCD.updateEnergyCD();
            GashaponData.replace_gashapon_user(content["gashapon"]);
            extraData = content["reward"];
        }

        else if (313 === cid) {
            PlayerData.update(content["player"]);
            EnergyCD.updateEnergyCD();
            NewSignData.updateSignInfo(content["signin7"]);
            ClothesData.updateUserClohtes(content["clothes"]);
            ShowData.update(content["show"]);
            GashaponData.replace_gashapon_user(content["gashapon"]);
            extraData = content["rewards"];
        }

        else if (312 === cid) {
            NewSignData.initTemplate(content["template"]);
            NewSignData.updateSignInfo(content["signin7"]);
        }

        else if (311 === cid) {
            ClothesData.updateUserClohtes(content["clothes"]);
            GashaponData.replace_gashapon_user(content["gashapon"]);
        }

        else if (309 === cid) {
            PlayerData.update(content["player"]);
            // this->creat_Energy_Time();
            EnergyCD.updateEnergyCD();
            ClothesData.updateUserClohtes(content["clothes"]);
            GashaponData.replace_gashapon_user(content["gashapon"]);
            GashaponData.init_extra(content["extra"]);
            extraData = content["result"];
        }

        else if (307 === cid) {
            PlayerData.update(content["player"]);
            // this->creat_Energy_Time();
            EnergyCD.updateEnergyCD();
            ClothesData.updateUserClohtes(content["clothes"]);
            GashaponData.replace_gashapon_user(content["gashapon"]);
            extraData = content["result"];
            var isFree: boolean = content["free"];
        }

        else if (306 === cid) {
            GashaponData.init_gashapon_template(content["template"]);
            GashaponData.init_cost(content["cost"]);
            GashaponData.replace_gashapon_user(content["gashapon"]);
        }

        else if (305 === cid) {
            RechargeData.replace_purchase_achievement(content["pAchievement"]);
            ClothesData.updateUserClohtes(content["clothes"]);
        }

        else if (304 === cid) {
            RechargeData.init_purchase_achievement_template(content["template"]);
            RechargeData.replace_purchase_achievement(content["pAchievement"]);
        }

        else if (303 === cid) {
            PlayerData.update(content["player"]);
            // this->creat_Energy_Time();
            EnergyCD.updateEnergyCD();
            SigninData.updateSignInfo(content["signin7"]);
            ClothesData.updateUserClohtes(content["clothes"]);
            NewsData.update(content["news"]);
            // nc->postNotification("UPDATE_NEWS_STATUS");
        }

        else if (302 === cid) {
            SigninData.initTemplate(content["template"]);
            SigninData.updateSignInfo(content["signin7"]);
        }

        else if (301 === cid) {
            PlayerData.update(content["player"]);
            // this.create_energy_time();
            EnergyCD.updateEnergyCD();
            NewsData.update(content["news"]);
            // nc->postNotification("UPDATE_NEWS_STATUS");
            extraData = content["reward"];
        }

        else if (300 === cid) {
            RankData.update(content);
        }


        else if (200 === cid) {
            CofferData.initTemplateData(content["template"]);
            CofferData.updateUserData(content["coffers"]);
        }
        else if (201 === cid) {
            CofferData.updateUserData(content["coffers"]);
        }
        else if (203 === cid) {
            PlayerData.update(content["player"]);
            EnergyCD.updateEnergyCD();
            CofferData.updateUserData(content["coffers"]);
        }
        else if (205 === cid) {
            PlayerData.update(content["player"]);
            EnergyCD.updateEnergyCD();
            CofferData.updateUserData(content["coffers"]);
            extraData = content["result"];
        }

        else if (175 === cid) {
            ShareData.update(content["h5wanba"]);
            PlayerData.update(content["player"]);
            extraData = { reward: content["reward"], type: content["type"] };
        }

        else if (174 === cid) {
            PlayerData.update(content["player"]);
        }

        else if (172 === cid) {
            ClientMapData.updateClientMapData(content);
        }

        else if (170 === cid) {
            ClothesData.updateUserClohtes(content["clothes"]);
            PlayerData.update(content["player"]);
            ShareData.update(content["h5wanba"]);
            if (content["type"] == "firstpay_lottery") {
                extraData = content["reward"];
            } else {
                extraData = content["result"];
            }
        }

        else if (169 === cid) {
            PlayerData.update(content["player"]);
            ShareData.update(content["h5wanba"]);
            extraData = content["result"];
        }

        else if (168 === cid) {
            PlayerData.update(content["player"]);
        }

        else if (161 === cid) {
            PlayerData.update(content["player"]);
            EnergyCD.updateEnergyCD();
            ClothesData.updateUserClohtes(content["clothes"]);
            ShowData.update(content["show"]);
        }

        else if (160 === cid) {
            DiscountData.config(content);
        }

        else if (164 === cid) {
            PlayerData.update(content["player"]);
            InviteData.updateInviteData(content["invite"]);
        }

        else if (165 === cid) {
            InviteData.updateInviteData(content["invite"]);
        }

        else if (166 === cid) {
            console.log("invite success");
        }

        else if (167 === cid) {
            PlayerData.update(content["player"]);
            InviteData.updateInviteData(content["invite"]);
        }

        else if (157 === cid) {
            PlayerData.update(content["player"]);
            ClothesData.updateUserClohtes(content["clothes"]);
            EnergyCD.updateEnergyCD();
            PurchaseData.update(content["purchase"]);
            extraData = content["rewards"];
        }

        else if (153 === cid) {
            PlayerData.update(content["player"]);
            EnergyCD.updateEnergyCD();
            PurchaseData.update(content["purchase"]);

            extraData = content["rewards"];             //首次购买获得
        }

        else if (151 === cid) {
            PlayerData.update(content["player"]);
            EnergyCD.updateEnergyCD();
            PurchaseData.update(content["purchase"]);
            GashaponData.replace_gashapon_user(content["gashapon"]);

            extraData = content["rewards"];              //首次购买获得
        }

        else if (133 === cid) {
            NetLoading.removeLoading();
            var result = content;
            ShareData.update(result["h5wanba"]);
            if (result["product_id"]) {
                if (result["product_id"] == "libao_1" || result["product_id"] == "libao_2" || result["product_id"] == "libao_3") {
                    // WanbaData.updatePackageData(result["h5wanba"]["buy_libao_list"]);
                    CustomEventMgr.dispatchEventWith("Update Libao View", false);
                    Prompt.showPrompt(egret.MainContext.instance.stage, "请前往邮箱领取礼包!");
                } else if (result["product_id"] == "tiegao_17" || result["product_id"] == "tiegao_18") {
                    TLDiscountData.resetDL();
                    Prompt.showPrompt(egret.MainContext.instance.stage, "请前往邮箱领取礼包!");
                } else if (result["product_id"] == "tiegao_9") {
                    Prompt.showPrompt(egret.MainContext.instance.stage, "请前往邮箱领取激活!");
                } else {
                    Prompt.showPrompt(egret.MainContext.instance.stage, "请前往邮箱领取钻石!");
                }
            }

            if (result["h5wanba"]) {
                // ShareData.update(result["h5wanba"]);
                if ((ShareData.isFirstPay && (ShareData.firstpay_lottery_times == 0))) {
                    var panel = new FirstPayPanel();
                    DisplayMgr.set2Center(panel);
                    egret.MainContext.instance.stage.addChild(panel);
                } else if ((ShareData.isDailyPay && (ShareData.dailypay_lottery_times == 0 || ShareData.dailypay_normal_times == 0))) {
                    var onePanel = new ScPanel();
                    DisplayMgr.set2Center(onePanel);
                    egret.MainContext.instance.stage.addChild(onePanel);
                }
            }
        }

        else if (121 === cid) {
            PlayerData.update(content["player"]);
            // this->creat_Energy_Time();
            EnergyCD.updateEnergyCD();
            PurchaseData.update(content["purchase"]);
        }

        else if (116 === cid) {
            NetLoading.removeLoading();
            var result = content;
            ShareData.update(result["h5wanba"]);
            if (result["product_id"]) {
                if (result["product_id"] == "libao_1" || result["product_id"] == "libao_2" || result["product_id"] == "libao_3") {
                    // WanbaData.updatePackageData(result["h5wanba"]["buy_libao_list"]);
                    CustomEventMgr.dispatchEventWith("Update Libao View", false);
                    Prompt.showPrompt(egret.MainContext.instance.stage, "请前往邮箱领取礼包!");
                } else if (result["product_id"] == "tiegao_17" || result["product_id"] == "tiegao_18") {
                    TLDiscountData.resetDL();
                    Prompt.showPrompt(egret.MainContext.instance.stage, "请前往邮箱领取礼包!");
                } else if (result["product_id"] == "tiegao_9") {
                    Prompt.showPrompt(egret.MainContext.instance.stage, "请前往邮箱领取激活!");
                } else {
                    Prompt.showPrompt(egret.MainContext.instance.stage, "请前往邮箱领取钻石!");
                }
            }

            if (result["h5wanba"]) {
                // ShareData.update(result["h5wanba"]);
                if ((ShareData.isFirstPay && (ShareData.firstpay_lottery_times == 0))) {
                    var panel = new FirstPayPanel();
                    DisplayMgr.set2Center(panel);
                    egret.MainContext.instance.stage.addChild(panel);
                } else if ((ShareData.isDailyPay && (ShareData.dailypay_lottery_times == 0 || ShareData.dailypay_normal_times == 0))) {
                    var onePanel = new ScPanel();
                    DisplayMgr.set2Center(onePanel);
                    egret.MainContext.instance.stage.addChild(onePanel);
                }
            }

            DataMgr.checkNews();
        }

        else if (115 === cid) {
            PlayerData.update(content["player"]);
            TujianData.update(content["tujian"]);
            extraData = content["reward"];
        }

        else if (114 === cid) {
            TujianData.update(content["tujian"]);
        }

        else if (112 === cid) {
            InviteData.updateInviteData(content["invite"]);
            ClothesData.updateUserClohtes(content["clothes"]);
            extraData = content["reward"];
        }

        else if (110 === cid) {
            InviteData.updateInviteData(content["invite"]);
            ClothesData.updateUserClohtes(content["clothes"]);
            extraData = content["reward"];
        }

        else if (108 === cid) {
            InviteData.updateInviteData(content["invite"]);
            ClothesData.updateUserClohtes(content["clothes"]);
            extraData = content["reward"];
        }

        else if (106 === cid) {
            TLDiscountData.updateDiscountData(content);
        }

        else if (104 === cid) {
            WanbaData.initPackageData(content);
        }

        else if (103 === cid) {
            PlayerData.update(content["player"]);
            // this->creat_Energy_Time();
            EnergyCD.updateEnergyCD();
            PurchaseData.update(content["purchase"]);
        }

        else if (101 === cid) {
            PlayerData.update(content["player"]);
            // this->creat_Energy_Time();
            EnergyCD.updateEnergyCD();
            PurchaseData.update(content["purchase"]);
        }

        else if (100 === cid) {
            PurchaseData.init_products(content);
        }

        CustomEventMgr.dispatchEventWith(cid.toString(), false, extraData);
    }
}