class GashaponRewardComp extends eui.Component {
	public group: eui.Group;
	public rewardGroup: eui.Group;
	public icon: eui.Image;
	public count: eui.Label;

	private isComplete: boolean = false;//动画是否结束

	private reward: {};
	private type: string;

	public constructor(type: string, reward: {}) {
		super();

		this.type = type;
		this.reward = reward;
		this.skinName = "GashaponRewardCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);

		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		if (this.reward["type"] == "clothes") {
			this.icon.source = "icon" + this.reward["num"] + "_png";
			this.count.horizontalCenter = 0;
			this.count.text = ClothesData.clothesTemplateData(Math.floor(this.reward["num"] / 10000).toString(), this.reward["num"].toString())["name"];
		} else {
			this.icon.source = "panel_ui_json.ac_reward_" + this.reward["type"];
			this.count.text = this.reward["num"];
		}

		this.rewardGroup.scaleX = 0;
		this.rewardGroup.scaleY = 0;
		this.startTween();
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);

		this.group.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}

	private startTween() {
		var self = this;
		var tw = egret.Tween.get(this.rewardGroup);
		tw.to({ scaleX: 1, scaleY: 1}, 500, egret.Ease.backOut).call(function () {
			self.isComplete = true;
		}, this);
	}

	private onTouch(evt: egret.TouchEvent) {
		var rectAngle = this.rewardGroup.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.close();
		}
	}

	private close() {
		if (this.parent && this.isComplete) {
			CustomEventMgr.dispatchEventWith("Update Player Info", false);
			if (this.type == "1") {

			} else if (this.type == "10") {
				CustomEventMgr.dispatchEventWith("Start Next Animation", false);
			}

			this.parent.removeChild(this);
		}
	}
}