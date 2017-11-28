class ScPanel extends eui.Component {
	public group: eui.Group;
	public group2: eui.Group;
	public btn_cz: eui.Image;
	public btn_lq1: eui.Image;
	public btn_lq2: eui.Image;

	public constructor() {
		super();

		this.skinName = "ScPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		this.updateView();

		this.btn_cz.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCz, this);
		this.btn_lq1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLq1, this);
		this.btn_lq2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLq2, this);

		CustomEventMgr.addEventListener("170", this.result_of_170, this);
		CustomEventMgr.addEventListener("Update SC View", this.updateView, this);

		this.group2.scaleX = 0;
		this.group2.scaleY = 0;
		this.touchEnabled = false;
		this.touchChildren = false;
		var tw = egret.Tween.get(this.group2);
		tw.to({ scaleX: 1, scaleY: 1 }, 500, egret.Ease.backOut).call(function () {
			this.touchEnabled = true;
			this.touchChildren = true;
		}, this);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("170", this.result_of_170, this);
		CustomEventMgr.removeEventListener("Update SC View", this.updateView, this);
		egret.Tween.removeTweens(this.group2);
	}

	private updateView() {
		if ((ShareData.isDailyPay && ShareData.dailypay_lottery_times == 0)) {
			this.btn_lq1.source = "sc_panel_lq_png";
			this.btn_lq1.touchEnabled = true;
		} else {
			this.btn_lq1.source = "sc_panel_lq2_png";
			this.btn_lq1.touchEnabled = false;
		}

		if ((ShareData.isDailyPay && ShareData.dailypay_normal_times == 0)) {
			this.btn_lq2.source = "sc_panel_lq_png";
			this.btn_lq2.touchEnabled = true;
		} else {
			this.btn_lq2.source = "sc_panel_lq2_png";
			this.btn_lq2.touchEnabled = false;
		}

		if (ShareData.isDailyPay && ShareData.dailypay_normal_times == 1 && ShareData.dailypay_lottery_times == 1) {
			return;
		}

		if (ShareData.isDailyPay && (ShareData.dailypay_normal_times == 0 || ShareData.dailypay_lottery_times == 0)) {
			this.btn_cz.visible = false;
			this.btn_lq1.visible = true;
			this.btn_lq2.visible = true;
		} else {
			this.btn_cz.visible = true;
			this.btn_lq1.visible = false;
			this.btn_lq2.visible = false;
		}
	}

	private onCz() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_cz, function () {
			SoundManager.instance().buttonSound();
			NetLoading.showLoading();
			var request = HttpProtocolMgr.all_products_100();
			HttpMgr.postRequest(request);
			self.closePanel();
		});
	}

	private onLq1() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_lq1, function () {
			SoundManager.instance().buttonSound();
			if (ShareData.isFirstPay && ShareData.firstpay_lottery_times == 0) {
				NetLoading.showLoading();
				var request: egret.URLRequest = HttpProtocolMgr.take_daily_recharge_170("firstpay_lottery");
				HttpMgr.postRequest(request);
			} else if (ShareData.isDailyPay && ShareData.dailypay_lottery_times == 0) {
				NetLoading.showLoading();
				var request: egret.URLRequest = HttpProtocolMgr.take_daily_recharge_170("dailypay_lottery");
				HttpMgr.postRequest(request);
			} else {
				Prompt.showPrompt(self.stage, "该奖励已领取~");
			}
		});
	}

	private onLq2() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_lq2, function () {
			SoundManager.instance().buttonSound();
			if (ShareData.isDailyPay && ShareData.dailypay_normal_times == 0) {
				NetLoading.showLoading();
				var request: egret.URLRequest = HttpProtocolMgr.take_daily_recharge_170("dailypay_normal");
				HttpMgr.postRequest(request);
			} else {
				Prompt.showPrompt(self.stage, "该奖励已领取~");
			}
		});
	}

	private result_of_170(evt: egret.Event) {
		NetLoading.removeLoading();
		var reward: {}[] = [];
		if (evt.data.diam) {
			reward.push({ type: "diam", num: evt.data.diam });
		} else {
			reward = evt.data;
		}
		this.playRewardAnimation(reward);

		CustomEventMgr.dispatchEventWith("Update Player Info", false);

		this.updateView();
		//更新首冲视图
		CustomEventMgr.dispatchEventWith("Update Sc View", false);
	}

	private playRewardAnimation(reward: {}[]) {
		var panel = new CommonRewardPanel(reward);
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
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