class StarsRewardPanel extends eui.Component {
	public group: eui.Group;
	public rewardGroup: eui.Group;
	public icon: eui.Image;
	public count: eui.Label;
	public stars_lab: eui.Label;

	private reward: {} = null;
	private isComplete: boolean = false;

	public constructor(reward: {}) {
		super();

		this.reward = reward;
		this.skinName = "StarsRewardPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);

		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		this.icon.source = "panel_ui_json.ac_reward_" + this.reward["reward_type"];
		this.count.text = this.reward["reward_value"];
		this.stars_lab.text = this.reward["goal"] + "";

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
		tw.to({ scaleX: 1, scaleY: 1 }, 500, egret.Ease.backOut).call(function () {
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
		if(this.parent && this.isComplete) {
			this.parent.removeChild(this);
		}
	}
}