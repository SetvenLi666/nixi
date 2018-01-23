class CommonRewardPanel extends eui.Component {
	public group: eui.Group;
	public rewardGroup: eui.Group;
	public bg: eui.Image;
	public icon: eui.Image;
	public count: eui.Label;
	public flag: eui.Image;

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
		this.flag.visible = false;
		var curRewrad = this.reward[index];

		this.rewardGroup.scaleX = 0;
		this.rewardGroup.scaleY = 0;

		if (curRewrad["type"] == "clothes") {
			this.flag.visible = true;
			var clothesData = ClothesData.clothesTemplateData(Math.floor(curRewrad["num"] / 10000) + "", curRewrad["num"] + "");
			if(clothesData["phase"] == "1" || clothesData["phase"] == "2") {
				this.bg.source = "reward_pop_bg_1_png";
				this.flag.source = "reward_pop_flag_1_png";
			}else if(clothesData["phase"] == "3" || clothesData["phase"] == "4") {
				this.bg.source = "reward_pop_bg_2_png";
				this.flag.source = "reward_pop_flag_2_png";
			}else if(clothesData["phase"] == "5") {
				this.bg.source = "reward_pop_bg_3_png";
				this.flag.source = "reward_pop_flag_3_png";
			}
			this.icon.source = "icon" + curRewrad["num"] + "_png";
			this.right = NaN;
			this.count.horizontalCenter = 0;
			this.count.text = clothesData["name"];
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

		if(this.flag.visible) {
			this.flag.scaleX = 3;
			this.flag.scaleY = 3;
			var tw_flag = egret.Tween.get(this.flag);
			tw_flag.to({alpha: 1, scaleX: 1, scaleY: 1}, 500);
		}

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