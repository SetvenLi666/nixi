class StoryRewardPanel extends eui.Component {
	public group: eui.Group;
	public rewardGroup: eui.Group;
	public icon: eui.Image;
	public count: eui.Label;

	private isComplete: boolean = false;//动画是否结束

	public constructor() {
		super();

		this.skinName = "StoryRewardPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		console.log(this.group);
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		this.rewardGroup.scaleX = 0;
		this.rewardGroup.scaleY = 0;
		this.startTween();
	}

	private startTween() {
		var self = this;
		var tw = egret.Tween.get(this.rewardGroup);
		tw.to({ scaleX: 1, scaleY: 1 }, 1000, egret.Ease.backOut).call(function () {
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
			if (PlayerData.guide == 6) {
				if (ClientMapData.taskGuide) {
					if (ClientMapData.taskGuide == 0) {
						this.parent.removeChild(this);
					}
				}
				var guidePanel = new NewGuidePanel();
				DisplayMgr.set2Center(guidePanel);
				this.stage.addChild(guidePanel);
				guidePanel.currentState = "guide_step_6_11";
				guidePanel.playAnimation();
			}
			this.parent.removeChild(this);
		}
	}
}