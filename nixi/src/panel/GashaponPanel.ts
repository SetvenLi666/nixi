class GashaponPanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public freeGroup: eui.Group;
	public freeImg: eui.Image;
	public freeTip: eui.Image;
	public label_1: eui.Label;
	public freeDiam: eui.Image;
	public tenGroup: eui.Group;
	public label_2: eui.Label;
	public timeCD: eui.Label;
	public freeText: eui.Image;

	private freeTime: number;
	private hour: number;
	private minute: number;
	private second: number;

	private timer: egret.Timer;

	private acTimer: egret.Timer;
	private result_10: {}[];

	// private isGuideDesk: boolean = false;

	public constructor() {
		super();

		this.skinName = "GashaponPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);

		this.label_1.text = GashaponData.cost["single_cost"];
		this.label_2.text = GashaponData.cost["ten_cost"];

		this.updateFreeGroup();

		this.freeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFreeGroup, this);
		this.tenGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTenGroup, this);
		CustomEventMgr.addEventListener("307", this.result_of_307, this);
		CustomEventMgr.addEventListener("309", this.result_of_309, this);
		CustomEventMgr.addEventListener("Start Next Animation", this.startNextAnimation, this);

		this.timer = new egret.Timer(1000, 0);
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimerCallback, this);

		if(PlayerData.guide == 6) {
			// this.isGuideDesk = true;
			var guidePanel = new NewGuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.stage.addChild(guidePanel);
			guidePanel.currentState = "guide_step_6_1";
			guidePanel.playAnimation();
			CustomEventMgr.addEventListener("Guide_Step_6_1", this.onFreeGroup, this);
		}
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		this.freeGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onFreeGroup, this);
		this.tenGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTenGroup, this);
		CustomEventMgr.removeEventListener("Start Next Animation", this.startNextAnimation, this);
		CustomEventMgr.removeEventListener("307", this.result_of_307, this);
		CustomEventMgr.removeEventListener("309", this.result_of_309, this);
		if(PlayerData.guide == 6) {
			CustomEventMgr.removeEventListener("Guide_Step_6_1", this.onFreeGroup, this);
		}

		this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimerCallback, this);
		this.timer.stop();
		this.timer.reset();
		if(this.acTimer) {
			this.acTimer.removeEventListener(egret.TimerEvent.TIMER, this.onAcTimerCallback, this);
			this.acTimer.stop();
			this.acTimer.reset();
		}
	}

	private onFreeGroup() {
		DisplayMgr.buttonScale(this.freeGroup, function() {
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.single_lottery_307();
			HttpMgr.postRequest(request);
		});
	}

	private onTenGroup() {
		DisplayMgr.buttonScale(this.tenGroup, function() {
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.multiply_lottery_309();
			HttpMgr.postRequest(request);
		});
	}

	private updateFreeGroup() {
		this.freeTime = GashaponData.gashapon["free_point"];
		
		if(this.freeTime == 0) {
			//免费
			this.freeImg.source = "gashapon_btn_free_png";
			this.freeTip.visible = true;
			this.label_1.visible = false;
			this.freeDiam.visible = false;
			this.timeCD.text = "每日免费抽一次";
			this.timeCD.visible = false;
			this.freeText.visible = true;
		}else {
			//60钻
			this.freeImg.source = "gashapon_btn_one_png";
			this.freeTip.visible = false;;
			this.label_1.visible = true;
			this.freeDiam.visible = true;

			this.hour = Math.floor(this.freeTime / 3600);
			this.minute = Math.floor((this.freeTime - this.hour * 3600) / 60);
			this.second = Math.floor(this.freeTime - this.hour * 3600 - this.minute * 60);

			if (this.hour > 0) {
				this.timeCD.text = "免费倒计时" + (this.hour < 10 ? "0" + this.hour : this.hour) + ":" + (this.minute < 10 ? "0" + this.minute : this.minute);
			} else if (this.minute > 0) {
				this.timeCD.text = "免费倒计时" + (this.minute < 10 ? "0" + this.minute : this.minute) + ":" + (this.second < 10 ? "0" + this.second : this.second);
			} else if (this.second > 0) {
				this.timeCD.text = "免费倒计时" + "00:" + (this.second < 10 ? "0" + this.second : this.second);
			}

			this.timeCD.visible = true;
			this.freeText.visible = false;
		}
	}

	private onTimerCallback() {
		this.freeTime--;

		this.updateFreeGroup();
	}

	private result_of_307(evt: egret.Event) {
		NetLoading.removeLoading();
		this.freeTime = GashaponData.gashapon["free_point"];
		this.updateFreeGroup();

		// this.AnimationOneTime(evt.data);
		this.playRewardAnimation(evt.data);
	}

	private result_of_309(evt: egret.Event) {
		this.touchEnabled = false;
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		
		var request = HttpProtocolMgr.take_welfare_data_630();
		HttpMgr.postRequest(request);

		NetLoading.removeLoading();
		// this.result_10 = evt.data;
		// this.AnimationTenTimes();
		this.playRewardAnimation(evt.data);
	}

	private playRewardAnimation(reward: {}[]) {
		var panel = new CommonRewardPanel(reward);
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}

	private AnimationOneTime(result: {}[]) {
		var panel = new GashaponRewardComp("1", result[0]);
		DisplayMgr.set2Center(panel);
		egret.MainContext.instance.stage.addChild(panel);
	}

	private AnimationTenTimes() {
		this.acTimer = new egret.Timer(200, 10);
		this.acTimer.addEventListener(egret.TimerEvent.TIMER, this.onAcTimerCallback, this);
		this.acTimer.start();
	}

	private onAcTimerCallback(evt: egret.TimerEvent) {
		this.acTimer.stop();
		var index = this.acTimer.currentCount - 1;
		var result = this.result_10[index];
		var panel = new GashaponRewardComp("10", result);
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}

	private startNextAnimation() {
		if(this.acTimer.currentCount < 10) {
			this.acTimer.start();
		}else {
			this.touchEnabled = true;
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
			// if(this.isGuideDesk) {
			// 	var panel = new ShareDeskPanel("desk");
			// 	DisplayMgr.set2Center(panel);
			// 	this.stage.addChild(panel);
			// 	panel.isCanbeClose = false;
			// }
			this.parent.removeChild(this);
		}
	}
}