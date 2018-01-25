class ThirtyPanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	// public shower: Model;
	public item_1: SignItemComp;
	public item_2: SignItemComp;
	public item_3: SignItemComp;
	public item_4: SignItemComp;
	public item_5: SignItemComp;
	public item_6: SignItemComp;
	public item_7: SignItemComp;
	public btn_rev: eui.Image;
	public btn_invite: eui.Image;
	public label_count: eui.Label;

	public constructor() {
		super();

		this.skinName = "ThirdPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);

		this.initView();
		this.btn_rev.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnRev, this);
		this.btn_invite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnInvite, this);
		CustomEventMgr.addEventListener("112", this.result_of_112, this);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("112", this.result_of_112, this);
	}

	private initView() {
		var arr: number[] = WanbaData.libao_3["clothes"];
		var len = arr.length;
		for (var i = 0; i < len; i++) {
			var id: number = arr[i];
			var part: string = Math.floor(id / 10000) + "";
			var sub_part: string;
			var tempData = ClothesData.clothesTemplateData(part, id + "");
			if (part == "7") {
				sub_part = tempData["sub_part"];
			} else {
				sub_part = tempData["part"];
			}

			// this.shower.dressItem(sub_part, id);
			// this.shower.dressItemOfSuit(sub_part, id);

			var item = <SignItemComp>this["item_" + (i + 1)];
			item.itemBg.source = "ac_res_json.ac_30_item_bg";
			item.icon.source = "icon" + id + "_png";
			item.clothes_name.text = tempData["name"];
		}

		if (InviteData.reward10_state == 1) {
			//人数不足
			this.btn_invite.source = "libao_btn_invite_png";
		} else {
			this.btn_invite.source = "libao_btn_lingqu_png";
		}
		this.label_count.text = InviteData.inviteCount + "/15";
	}

	private onBtnInvite() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_invite, function () {
			if (InviteData.reward10_state == 1 && InviteData.inviteCount < 10) {
				//人数不足，打开邀请
				NetLoading.showLoading();
				var request = HttpProtocolMgr.take_invite_info_165();
				HttpMgr.postRequest(request);
				self.closePanel();
			} else if (InviteData.reward10_state == 2) {
				//可以领取
				NetLoading.showLoading();
				var request = HttpProtocolMgr.take_free_30_reward_112();
				HttpMgr.postRequest(request);
			} else if (InviteData.reward10_state == 3) {
				//已经领取
				Prompt.showPrompt(self.stage, "奖励已经领取");
			}
		});
	}

	private result_of_112(evt: egret.Event) {
		NetLoading.removeLoading();
	
		this.playRewardAnimation(evt.data);

		CustomEventMgr.dispatchEventWith("Update Libao View", false);
	}

	private playRewardAnimation(reward: {}) {
		var new_reward: {}[] = [];
		for (var p in reward) {
			if (p == "clothes") {
				var arr: number[] = reward["clothes"];
				var len = arr.length;
				for (var i = 0; i < len; i++) {
					var item: {} = {
						type: "clothes",
						num: arr[i]
					}
					new_reward.push(item);
				}
			} else {
				var item: {} = {
					type: p,
					num: reward[p]
				}
				new_reward.push(item);
			}
		}

		var panel = new CommonRewardPanel(new_reward);
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);

		CustomEventMgr.dispatchEventWith("Update Player Info", false);
	}

	private onBtnRev() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_rev, function () {
			SoundManager.instance().buttonSound();
			if (WanbaData.packageData.indexOf("libao_3") != -1) {
				Prompt.showPrompt(self.stage, "已购买该礼包，请勿重复购买!");
				return;
			}

			var data = WanbaData.libao_3;
			curProductId = data["id"];

			egret.ExternalInterface.call("setGoldSAndMondy", 0 + ";" + data["money"] + "00");
			egret.ExternalInterface.call("isGamePay", data["id"]);
			// var urlRequest = new egret.URLRequest(ConstData.Conf.WanbaOrderAddr);
			// urlRequest.method = egret.URLRequestMethod.POST;

			// var order_id = LoginData.uuid + "-" + CommonFunc.curTimeStamp() + "-" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10);
			// TDGA.onChargeRequest({
			// 	orderId: order_id,
			// 	iapId: data["id"],
			// 	currencyType: "CNY",
			// 	currencyAmount: "" + data["money"],
			// 	virtualCurrencyAmount: "30元礼包"
			// });

			// tdData = {
			// 	orderId: order_id,
			// 	iapId: data["id"],
			// 	currencyType: "CNY",
			// 	currencyAmount: "" + data["money"],
			// 	virtualCurrencyAmount: "30元礼包"
			// };

			// urlData = "product_id=" + data["id"] + "&sid=" + LoginData.sid + "&openid=" + window["OPEN_DATA"].openid +
			// 	"&openkey=" + window["OPEN_DATA"].openkey + "&platform=" + window["OPEN_DATA"].platform;
			// urlRequest.data = urlData;
			// var urlLoader = new egret.URLLoader();
			// urlLoader.addEventListener(egret.Event.COMPLETE, self.onLoadComplete, self);
			// urlLoader.load(urlRequest);
		});
	}

	private onLoadComplete(evt: egret.Event) {
		var loader = <egret.URLLoader>evt.target;
		console.log(loader.data);
		var obj: {} = JSON.parse(loader.data);

		// WanbaData.updatePackageData(obj["buy_libao_list"]);
		// CustomEventMgr.dispatchEventWith("Update Libao View", false);

		// if(obj && obj["code"] == 1004) {
		// 	window["popPayTips"]({
		// 		defaultScore: obj["need_score"],
		// 		appid: window["OPEN_DATA"].appid
		// 	});
		// }

		if (obj && obj["result"] == "SUCCESS") {
			//余额足够，无二次请求
			if (obj["product_id"]) {
				if (obj["product_id"] == "libao_1" || obj["product_id"] == "libao_2" || obj["product_id"] == "libao_3") {
					WanbaData.updatePackageData(obj["buy_libao_list"]);
					CustomEventMgr.dispatchEventWith("Update Libao View", false);
				}
			}
			DataMgr.checkNews();

			window["mqq"].ui.showDialog({
				title: "提示",
				text: "支付成功!请前往邮箱领取物品!",
				needOkBtn: true,
				needCancelBtn: false,
				okBtnText: "确认",
				cancelBtnText: ""
			}, function (data) {
				console.log(data);
			});

		} else if (obj && obj["result"] == "FAIL" && obj["code"] == 1004) {
			window["popPayTips"]({
				defaultScore: obj["need_score"],
				appid: window["OPEN_DATA"].appid
			});
		}
	}

	private touchTap(evt: egret.TouchEvent) {
		var rectAngle = this.bg.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.closePanel();
		}
	}

	private closePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}