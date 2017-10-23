class CommonRewardPanel extends eui.Component {
	public group: eui.Group;
	public rewardGroup: eui.Group;
	public icon: eui.Image;
	public count: eui.Label;

	private reward: {}[] = null;
	private rewardCount: number = 0;
	private curIndex: number = 0;

	private isComplete: boolean = false;

	public constructor(reward: {}[]) {
		super();

		this.reward = reward;
		this.rewardCount = this.reward.length;
		this.skinName = "CommonRewardPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);

		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		this.curIndex = 0;
		this.updateRewardItem(this.curIndex);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		this.group.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}

	private updateRewardItem(index: number) {
		this.isComplete = false;
		var curRewrad = this.reward[index];

		this.rewardGroup.scaleX = 0;
		this.rewardGroup.scaleY = 0;

		if (curRewrad["type"] == "clothes") {
			this.icon.source = "icon" + curRewrad["num"] + "_png";
			this.right = NaN;
			this.count.horizontalCenter = 0;
			this.count.text = ClothesData.clothesTemplateData(Math.floor(curRewrad["num"] / 10000) + "", curRewrad["num"] + "")["name"];
		} else {
			this.icon.source = "panel_ui_json.ac_reward_" + curRewrad["type"];
			this.count.horizontalCenter = NaN;
			this.count.right = 163;
			this.count.text = curRewrad["num"];
		}

		this.startTween();
	}

	private startTween() {
		var self = this;
		var tw = egret.Tween.get(this.rewardGroup);
		tw.to({ scaleX: 1, scaleY: 1}, 500, egret.Ease.backOut).call(function () {
			self.curIndex++;
			self.isComplete = true;
		}, this);
	}

	private onTouch(evt: egret.TouchEvent) {
		var rectAngle = this.rewardGroup.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY) && this.isComplete) {
			this.checkNextAnimation();
		}
	}

	private checkNextAnimation() {
		if(this.curIndex < this.rewardCount) {
			this.updateRewardItem(this.curIndex);
		}else {
			this.close();
		}
	}

	private close() {
		if (this.parent) {
			// Prompt.showPrompt(this.stage, "领取成功!");
			this.parent.removeChild(this);
		}
	}
}