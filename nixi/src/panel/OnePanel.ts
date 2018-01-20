class OnePanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public item_1: SignItemComp;
	public item_2: SignItemComp;
	public item_3: SignItemComp;
	public item_4: SignItemComp;
	public item_5: SignItemComp;
	public item_6: SignItemComp;
	public item_7: SignItemComp;
	public item_8: SignItemComp;
	public item_9: SignItemComp;

	public btn_rev: eui.Image;

	private curId: string = "";

	// public shower: Model;

	public constructor() {
		super();

		this.skinName = "OnePanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);

		this.initSignView();
		this.btn_rev.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnRev, this);
		CustomEventMgr.addEventListener("Update Libao View", this.closePanel, this);
	}

	private onExit() {
		this.btn_rev.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnRev, this);
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("Update Libao View", this.closePanel, this);
	}

	private initSignView() {
		var arr: number[] = WanbaData.libao_1["clothes"];
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
			item.itemBg.source = "ac_res_json.ac_1_item_bg";
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

	private onBtnRev() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_rev, function () {
			SoundManager.instance().buttonSound();
			if (WanbaData.packageData.indexOf("libao_1") != -1) {
				Prompt.showPrompt(self.stage, "已购买该礼包，请勿重复购买!");
				return;
			}

			var data = WanbaData.libao_1;
			var urlRequest = new egret.URLRequest(ConstData.Conf.KuaikanOrderAddr);
			urlRequest.method = egret.URLRequestMethod.POST;

			var order_id = LoginData.uuid + "-" + CommonFunc.curTimeStamp() + "-" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10);
			TDGA.onChargeRequest({
				orderId: order_id,
				iapId: data["id"],
				currencyType: "CNY",
				currencyAmount: "" + data["money"],
				virtualCurrencyAmount: "1元礼包"
			});

			self.curId = data["id"];

			var urlData = "product_id=" + data["id"] + "&sid=" + LoginData.sid + "&uuid=" + LoginData.uuid;
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
		var self = this;

		if (obj["result"] == "SUCCESS") {
			kkH5sdk.callPayPage({
				transData: obj["transData"],
				sign: obj["sign"],
				IframePayClose: function (res) {
					// addLoadingElements("数据加载中...");
					// queryOrderStatus(…);
					console.log("IframePayClose");
					console.log(res);
					NetLoading.showLoading();
					var request = HttpProtocolMgr.refresh_pay_info_116(self.curId);
					HttpMgr.postRequest(request);
				},
				error: function (res) {
				},
				IframePayReady: function () {
					// removeLoadingElements();
					console.log("IframePayReady");
				}
			});
		}
	}

	private closePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}

}