class MonthCardPanel extends eui.Component {
	public group: eui.Group;
	public group2: eui.Group;
	public timeGroup: eui.Group;
	public timeLabel: eui.Label;
	public btn_buy: eui.Image;

	private curId: string = "";

	public constructor() {
		super();

		this.skinName = "MonthCardPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		this.initView();

		CustomEventMgr.addEventListener("157", this.result_of_157, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("157", this.result_of_157, this);
	}

	private initView() {
		if (PurchaseData.MonthCards["status"] == 0) {
			//未购买月卡
			this.timeGroup.visible = false;
			this.btn_buy.source = "month_btn_buy_png";
		} else if (PurchaseData.MonthCards["status"] == 1) {
			this.timeGroup.visible = true;
			this.timeLabel.text = PurchaseData.MonthCards["left"];
			this.btn_buy.source = "month_btn_lingqu_png";
		} else if (PurchaseData.MonthCards["status"] == 2) {
			this.timeGroup.visible = true;
			this.timeLabel.text = PurchaseData.MonthCards["left"];
			this.btn_buy.source = "month_state_yilng_png";
			this.btn_buy.touchEnabled = false;
		}

		this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
	}

	private onBuy() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_buy, function () {
			SoundManager.instance().buttonSound();
			if (PurchaseData.MonthCards["status"] == 0) {
				//支付购买
				self.onPay();
			} else if (PurchaseData.MonthCards["status"] == 1) {
				NetLoading.showLoading();
				var request = HttpProtocolMgr.take_monthly_card2_daily_reward_157();
				HttpMgr.postRequest(request);
			}
		});
	}

	private onPay() {
		var urlRequest = new egret.URLRequest(ConstData.Conf.KuaikanOrderAddr);
		urlRequest.method = egret.URLRequestMethod.POST;

		var product_id: string = "tiegao_9";

		var order_id = LoginData.uuid + "-" + CommonFunc.curTimeStamp() + "-" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10);
		TDGA.onChargeRequest({
			orderId: order_id,
			iapId: "tiegao_9",
			currencyType: "CNY",
			currencyAmount: "" + 30,
			virtualCurrencyAmount: "月卡"
		});	

		this.curId = product_id;

		var urlData = "product_id=" + product_id+ "&sid=" + LoginData.sid + "&uuid=" + LoginData.uuid;
		urlRequest.data = urlData;
		var urlLoader = new egret.URLLoader();
		urlLoader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
		urlLoader.load(urlRequest);
	}

	private onLoadComplete(evt: egret.Event) {
		var loader = <egret.URLLoader>evt.target;
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

	private result_of_157(evt: egret.Event) {
		NetLoading.removeLoading();
		this.playRewardAnimation(evt.data);

		this.updateView();
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

	private updateView() {
		if (PurchaseData.MonthCards["status"] == 0) {
			//未购买月卡
			this.timeGroup.visible = false;
			this.btn_buy.source = "month_btn_buy_png";
		} else if (PurchaseData.MonthCards["status"] == 1) {
			this.timeGroup.visible = true;
			this.timeLabel.text = PurchaseData.MonthCards["left"];
			this.btn_buy.source = "month_btn_lingqu_png";
		} else if (PurchaseData.MonthCards["status"] == 2) {
			this.timeGroup.visible = true;
			this.timeLabel.text = PurchaseData.MonthCards["left"];
			this.btn_buy.source = "month_state_yilng_png";
			this.btn_buy.touchEnabled = false;
		}
	}

	private onTouch(evt: egret.TouchEvent) {
		var rectAngle = this.group2.getTransformedBounds(this.stage);
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