class MothCardPanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public btn_diam: eui.Group;
	public btn_money: eui.Group;
	public lab_1: eui.Label;
	public lab_2: eui.Label;
	public leftGroup_1: eui.Group;
	public leftGroup_2: eui.Group;
	public btn_get1: eui.Image;
	public btn_get2: eui.Image;

	public constructor() {
		super();

		this.skinName = "MothCardPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		// this.lab_1.text = PurchaseData.MonthCards["1"]["left"];
		this.lab_1.text = Math.min(999, PurchaseData.MonthCards["1"]["left"]) + "";
		this.lab_2.text = Math.min(999, PurchaseData.MonthCards["2"]["left"]) + "";

		if (PurchaseData.MonthCards["1"]["status"] == 0) {
			this.leftGroup_1.visible = false;
			this.btn_get1.visible = false;
		} else if (PurchaseData.MonthCards["1"]["status"] == 1) {
			this.leftGroup_1.visible = true;
			this.btn_get1.visible = true;
			var tw1 = egret.Tween.get(this.btn_get1, { loop: true });
			tw1.to({ scaleX: 1.1, scaleY: 1.1 }, 500)
				.to({ scaleX: 1.0, scaleY: 1.0 }, 500);
		} else if (PurchaseData.MonthCards["1"]["status"] == 2) {
			this.leftGroup_1.visible = true;
			this.btn_get1.visible = true;
		}

		if (PurchaseData.MonthCards["2"]["status"] == 0) {
			this.leftGroup_2.visible = false;
			this.btn_get2.visible = false;
		} else if (PurchaseData.MonthCards["2"]["status"] == 1) {
			this.leftGroup_2.visible = true;
			this.btn_get2.visible = true;
			var tw2 = egret.Tween.get(this.btn_get2, { loop: true });
			tw2.to({ scaleX: 1.1, scaleY: 1.1 }, 500)
				.to({ scaleX: 1.0, scaleY: 1.0 }, 500);
		} else if (PurchaseData.MonthCards["2"]["status"] == 2) {
			this.leftGroup_2.visible = true;
			this.btn_get2.visible = true;
		}

		this.btn_diam.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonDiam, this);
		this.btn_money.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonMoney, this);
		this.btn_get1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetDiam, this);
		this.btn_get2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetMoney, this);
		CustomEventMgr.addEventListener("151", this.result_of_151, this);
		CustomEventMgr.addEventListener("153", this.result_of_153, this);
		CustomEventMgr.addEventListener("157", this.result_of_157, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("151", this.result_of_151, this);
		CustomEventMgr.removeEventListener("153", this.result_of_153, this);
		CustomEventMgr.removeEventListener("157", this.result_of_157, this);
	}

	private onButtonDiam() {
		DisplayMgr.buttonScale(this.btn_diam, function () {
			NetLoading.showLoading();
			var request = HttpProtocolMgr.buy_monthly_card1_151();
			HttpMgr.postRequest(request);
		});
	}

	private result_of_151(evt: egret.Event) {
		NetLoading.removeLoading();
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		Prompt.showPrompt(this.stage, "购买成功~");
		// this.lab_1.text = PurchaseData.MonthCards["1"]["left"];
		this.lab_1.text = Math.min(999, PurchaseData.MonthCards["1"]["left"]) + "";
		this.leftGroup_1.visible = true;
		this.btn_get1.visible = true;
		if (PurchaseData.MonthCards["1"]["status"] == 1) {
			egret.Tween.removeTweens(this.btn_get1);
			var tw1 = egret.Tween.get(this.btn_get1, { loop: true });
			tw1.to({ scaleX: 1.1, scaleY: 1.1 }, 500)
				.to({ scaleX: 1.0, scaleY: 1.0 }, 500);
		}
	}

	private onButtonMoney() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_money, function () {
			var urlRequest = new egret.URLRequest("");
			urlRequest.method = egret.URLRequestMethod.POST;
			urlRequest.data = "product_id=tiegao_9" + "&uid=" + LoginData.uuid + "&sid=" + LoginData.sid;
			var urlLoader = new egret.URLLoader();
			urlLoader.addEventListener(egret.Event.COMPLETE, self.onComplete, self);
			urlLoader.load(urlRequest);
		});
	}

	private onComplete(evt: egret.Event) {
		var loader = <egret.URLLoader>evt.target;
		var obj: {} = JSON.parse(loader.data);
		//========支付接入========
	}

	private onGetDiam() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_get1, function () {
			if (PurchaseData.MonthCards["1"]["status"] == 1) {
				NetLoading.showLoading();
				var request = HttpProtocolMgr.take_monthly_card1_daily_reward_153();
				HttpMgr.postRequest(request);
			} else if (PurchaseData.MonthCards["1"]["status"] == 2) {
				Prompt.showPrompt(self.stage, "今日已领取~");
			}
		});
	}

	private result_of_153(evt: egret.Event) {
		NetLoading.removeLoading();
		egret.Tween.removeTweens(this.btn_get1);
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		Prompt.showPrompt(this.stage, "领取成功~");
	}

	private onGetMoney() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_get2, function () {
			if (PurchaseData.MonthCards["2"]["status"] == 1) {
				NetLoading.showLoading();
				var request = HttpProtocolMgr.take_monthly_card2_daily_reward_157();
				HttpMgr.postRequest(request);
			} else if (PurchaseData.MonthCards["2"]["status"] == 2) {
				Prompt.showPrompt(self.stage, "今日已领取~");
			}
		});
	}

	private result_of_157(evt: egret.Event) {
		NetLoading.removeLoading();
		egret.Tween.removeTweens(this.btn_get2);
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
	}

	private onTouch(evt: egret.TouchEvent) {
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