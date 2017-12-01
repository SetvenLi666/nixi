var urlData: string = "";
var tdData: {} = null;


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

			var urlRequest = new egret.URLRequest(ConstData.Conf.WanbaOrderAddr);
			urlRequest.method = egret.URLRequestMethod.POST;

			var order_id = LoginData.uuid + "-" + CommonFunc.curTimeStamp() + "-" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10);
			TDGA.onChargeRequest({
				orderId: order_id,
				iapId: data["id"],
				currencyType: "CNY",
				currencyAmount: "" + data["money"],
				virtualCurrencyAmount: data["diam"]
			});

			tdData = {
				orderId: order_id,
				iapId: data["id"],
				currencyType: "CNY",
				currencyAmount: "" + data["money"],
				virtualCurrencyAmount: data["diam"]
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

		if (obj && obj["result"] == "SUCCESS") {
			if (obj["h5wanba"]) {
				ShareData.update(obj["h5wanba"]);
				if ((ShareData.isFirstPay && (ShareData.firstpay_lottery_times == 0))) {
					var panel = new FirstPayPanel();
					DisplayMgr.set2Center(panel);
					egret.MainContext.instance.stage.addChild(panel);
				} else if ((ShareData.isDailyPay && (ShareData.dailypay_lottery_times == 0 || ShareData.dailypay_normal_times == 0))) {
					var onePanel = new ScPanel();
					DisplayMgr.set2Center(onePanel);
					egret.MainContext.instance.stage.addChild(onePanel);
				}
				// CustomEventMgr.dispatchEventWith("Update SC View", false);
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


function __paySuccess() {
	TDGA.onChargeSuccess(tdData);

	var urlRequest = new egret.URLRequest(ConstData.Conf.WanbaOrderAddr);
	urlRequest.method = egret.URLRequestMethod.POST;
	urlRequest.data = urlData;
	var urlLoader = new egret.URLLoader();
	urlLoader.addEventListener(egret.Event.COMPLETE, function (evt: egret.Event) {
		var loader = <egret.URLLoader>evt.target;
		console.log(loader.data);
		var obj: {} = JSON.parse(loader.data);

		if (obj["product_id"]) {
			if (obj["product_id"] == "libao_1" || obj["product_id"] == "libao_2" || obj["product_id"] == "libao_3") {
				WanbaData.updatePackageData(obj["buy_libao_list"]);
				CustomEventMgr.dispatchEventWith("Update Libao View", false);
			}else if(obj["product_id"] == "tiegao_17" || obj["product_id"] == "tiegao_18") {
				TLDiscountData.resetDL();
			}
		}

		if (obj["h5wanba"]) {
			ShareData.update(obj["h5wanba"]);
			if ((ShareData.isFirstPay && (ShareData.firstpay_lottery_times == 0))) {
				var panel = new FirstPayPanel();
				DisplayMgr.set2Center(panel);
				egret.MainContext.instance.stage.addChild(panel);
			} else if ((ShareData.isDailyPay && (ShareData.dailypay_lottery_times == 0 || ShareData.dailypay_normal_times == 0))) {
				var onePanel = new ScPanel();
				DisplayMgr.set2Center(onePanel);
				egret.MainContext.instance.stage.addChild(onePanel);
			}
			// CustomEventMgr.dispatchEventWith("Update SC View", false);
		}
		DataMgr.checkNews();

	}, null);
	urlLoader.load(urlRequest);

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

	// if (window["OPEN_DATA"] && window["OPEN_DATA"].platform == 2 && window["OPEN_DATA"].qua["app"] == "SQ") {
	// 	console.log("支付成功！！！");
	// 	var tip = new IosPayTipPanel();
	// 	DisplayMgr.set2Center(tip);
	// 	egret.MainContext.instance.stage.addChild(tip);
	// }
}


function __payError() {

	window["mqq"].ui.showDialog({
		title: "提示",
		text: "支付取消!",
		needOkBtn: true,
		needCancelBtn: false,
		okBtnText: "确认",
		cancelBtnText: ""
	});
}

function __payClose() {

	window["mqq"].ui.showDialog({
		title: "提示",
		text: "支付取消!",
		needOkBtn: true,
		needCancelBtn: false,
		okBtnText: "确认",
		cancelBtnText: ""
	});
}