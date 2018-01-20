class ShouchongPanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	// public list: eui.List;
	// public tip: eui.Label;
	public btn_icon1: eui.Image;
	public btn_icon2: eui.Image;
	public btn_icon3: eui.Image;
	public btn_icon4: eui.Image;
	public btn_icon5: eui.Image;
	public btn_icon6: eui.Image;

	public price_img1: eui.Image;
	public price_img2: eui.Image;
	public price_img3: eui.Image;
	public price_img4: eui.Image;
	public price_img5: eui.Image;
	public price_img6: eui.Image;

	public img_x2_1: eui.Image;
	public img_x2_2: eui.Image;
	public img_x2_3: eui.Image;
	public img_x2_4: eui.Image;
	public img_x2_5: eui.Image;
	public img_x2_6: eui.Image;

	public tipImg: eui.Image;

	private curId: string = "";

	public constructor() {
		super();

		this.skinName = "ShouChongPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);

		this.initView();

		this.btn_icon1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandle, this);
		this.btn_icon2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandle, this);
		this.btn_icon3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandle, this);
		this.btn_icon4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandle, this);
		this.btn_icon5.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandle, this);
		this.btn_icon6.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandle, this);

		// CustomEventMgr.addEventListener("Update Shouchong View", this.updateView, this);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		this.btn_icon1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandle, this);
		this.btn_icon2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandle, this);
		this.btn_icon3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandle, this);
		this.btn_icon4.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandle, this);
		this.btn_icon5.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandle, this);
		this.btn_icon6.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandle, this);

		// CustomEventMgr.removeEventListener("Update Shouchong View", this.updateView, this);
	}

	private initView() {
		if (window["OPEN_DATA"] && window["OPEN_DATA"].platform == 1) {
			//安卓
			this.price_img1.source = "panel_cz_1_png";
			this.price_img2.source = "panel_cz_2_png";
			this.price_img3.source = "panel_cz_3_png";
			this.price_img4.source = "panel_cz_4_png";
			this.price_img5.source = "panel_cz_5_png";
			this.price_img6.source = "panel_cz_6_png";
		} else if (window["OPEN_DATA"] && window["OPEN_DATA"].platform == 2) {
			//ios
			this.price_img1.source = "panel_cz_ios_1_png";
			this.price_img2.source = "panel_cz_ios_2_png";
			this.price_img3.source = "panel_cz_ios_3_png";
			this.price_img4.source = "panel_cz_ios_4_png";
			this.price_img5.source = "panel_cz_ios_5_png";
			this.price_img6.source = "panel_cz_ios_6_png";
		}

		this.updateView();
	}

	private updateView() {
		if (PurchaseData.deals[PurchaseData.productsArr["tiegao_1"]["id"]]) {
			this.img_x2_1.visible = false;
		} else {
			this.img_x2_1.visible = true;
		}

		if (PurchaseData.deals[PurchaseData.productsArr["tiegao_2"]["id"]]) {
			this.img_x2_2.visible = false;
		} else {
			this.img_x2_2.visible = true;
		}

		if (PurchaseData.deals[PurchaseData.productsArr["tiegao_3"]["id"]]) {
			this.img_x2_3.visible = false;
		} else {
			this.img_x2_3.visible = true;
		}

		if (PurchaseData.deals[PurchaseData.productsArr["tiegao_14"]["id"]]) {
			this.img_x2_4.visible = false;
		} else {
			this.img_x2_4.visible = true;
		}

		if (PurchaseData.deals[PurchaseData.productsArr["tiegao_15"]["id"]]) {
			this.img_x2_5.visible = false;
		} else {
			this.img_x2_5.visible = true;
		}

		if (PurchaseData.deals[PurchaseData.productsArr["tiegao_16"]["id"]]) {
			this.img_x2_6.visible = false;
		} else {
			this.img_x2_6.visible = true;
		}

		if (!this.img_x2_1.visible && !this.img_x2_2.visible && !this.img_x2_3.visible && !this.img_x2_4.visible && !this.img_x2_5.visible && !this.img_x2_2.visible && !this.img_x2_6.visible) {
			this.tipImg.visible = false;
		} else {
			this.tipImg.visible = true;
		}
	}

	private onButtonHandle(evt: egret.TouchEvent) {
		var self = this;
		var target = evt.target;
		DisplayMgr.buttonScale(evt.target, function () {
			SoundManager.instance().buttonSound();
			var data: {} = null;
			switch (target) {
				case self.btn_icon1:
					if (PurchaseData.productsArr["tiegao_1"]) {
						data = PurchaseData.productsArr["tiegao_1"];
					}
					break;
				case self.btn_icon2:
					if (PurchaseData.productsArr["tiegao_2"]) {
						data = PurchaseData.productsArr["tiegao_2"];
					}
					break;
				case self.btn_icon3:
					if (PurchaseData.productsArr["tiegao_3"]) {
						data = PurchaseData.productsArr["tiegao_3"];
					}
					break;
				case self.btn_icon4:
					if (PurchaseData.productsArr["tiegao_14"]) {
						data = PurchaseData.productsArr["tiegao_14"];
					}
					break;
				case self.btn_icon5:
					if (PurchaseData.productsArr["tiegao_15"]) {
						data = PurchaseData.productsArr["tiegao_15"];
					}
					break;
				case self.btn_icon6:
					if (PurchaseData.productsArr["tiegao_16"]) {
						data = PurchaseData.productsArr["tiegao_16"];
					}
					break;
			}

			var urlRequest = new egret.URLRequest(ConstData.Conf.KuaikanOrderAddr);
			urlRequest.method = egret.URLRequestMethod.POST;

			var order_id = LoginData.uuid + "-" + CommonFunc.curTimeStamp() + "-" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10);
			TDGA.onChargeRequest({
				orderId: order_id,
				iapId: data["id"],
				currencyType: "CNY",
				currencyAmount: "" + data["money"],
				virtualCurrencyAmount: data["diam"]
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
		var obj: {} = JSON.parse(loader.data);
		var self = this;
		console.log(obj);

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
