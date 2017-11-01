class SixPanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public item_1: SignItemComp;
	public item_2: SignItemComp;
	public item_3: SignItemComp;
	public item_4: SignItemComp;
	public item_5: SignItemComp;

	public id: string;

	// public shower: Model;
	public btn_rev: eui.Image;

	public constructor() {
		super();

		this.skinName = "SixPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);

		this.initSignView();
		this.btn_rev.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnRev, this);
	}

	private onExit() {
		// CustomEventMgr.removeEventListener("303", this.afterFetchInfo_303, this);
	}

	private initSignView() {
		var arr:number[] = WanbaData.libao_2["clothes"];
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
			item.itemBg.source = "ac_res_json.ac_6_item_bg";
			item.icon.source = "icon" + id + "_png";
			item.clothes_name.text = tempData["name"];
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

	private onBtnRev() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_rev, function() {
			if(WanbaData.packageData.indexOf("libao_2") != -1) {
				Prompt.showPrompt(self.stage, "已购买该礼包，请勿重复购买!");
				return;
			}
			
			var data = WanbaData.libao_2;
			var urlRequest = new egret.URLRequest(ConstData.Conf.WanbaOrderAddr);
			urlRequest.method = egret.URLRequestMethod.POST;

			var order_id = LoginData.uuid + "-" + CommonFunc.curTimeStamp() + "-" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10);
			TDGA.onChargeRequest({
				orderId: order_id,
				iapId: data["id"],
				currencyType: "CNY",
				currencyAmount: "" + data["money"],
				virtualCurrencyAmount: "6元礼包"
			});

			tdData = {
				orderId: order_id,
				iapId: data["id"],
				currencyType: "CNY",
				currencyAmount: "" + data["money"],
				virtualCurrencyAmount: "6元礼包"
			};

			urlData = "product_id=" + data["id"] + "&sid=" + LoginData.sid + "&openid=" + window["OPEN_DATA"].openid +
				"&openkey=" + window["OPEN_DATA"].openkey + "&platform=" + window["OPEN_DATA"].platform;
			urlRequest.data = urlData;
			var urlLoader = new egret.URLLoader();
			urlLoader.addEventListener(egret.Event.COMPLETE, self.onLoadComplete, self);
			urlLoader.load(urlRequest);
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
}