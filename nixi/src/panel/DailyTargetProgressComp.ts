class DailyTargetProgressComp extends eui.Component {
	public pgBar: eui.ProgressBar;
	public tgGroup1: eui.Group;
	public target1: eui.Label;
	public tgGroup2: eui.Group;
	public target2: eui.Label;
	public tgGroup3: eui.Group;
	public target3: eui.Label;
	public group1: eui.Group;
	public ac1: eui.Image;
	public boxGroup1: eui.Group;
	public boxBg1: eui.Image;
	public countLab1: eui.Label;
	public typeImg1: eui.Image;
	public group2: eui.Group;
	public ac2: eui.Image;
	public boxGroup2: eui.Group;
	public boxBg2: eui.Image;
	public countLab2: eui.Label;
	public typeImg2: eui.Image;
	public group3: eui.Group;
	public ac3: eui.Image;
	public boxGroup3: eui.Group;
	public boxBg3: eui.Image;
	public countLab3: eui.Label;
	public typeImg3: eui.Image;

	public constructor() {
		super();

		this.skinName = "DailyTargetProgressCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.pgBar.maximum = WelfareData.items.length;
		this.pgBar.minimum = 0;
		this.pgBar.value = WelfareData.statis["total_progress"];

		this.pgBar.slideDuration = 0;

		this.updateView();

		this.boxGroup1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBoxTouch, this);
		this.boxGroup2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBoxTouch, this);
		this.boxGroup3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBoxTouch, this);

		CustomEventMgr.addEventListener("633", this.result_of_633, this);
	}

	private onExit() {
		this.boxGroup1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBoxTouch, this);
		this.boxGroup2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBoxTouch, this);
		this.boxGroup3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBoxTouch, this);
		CustomEventMgr.removeEventListener("633", this.result_of_633, this);
	}

	public updateView() {
		this.pgBar.value = WelfareData.statis["total_progress"];

		this.group1.x = this.pgBar.width * (WelfareData.statis["1"]["goal"] / WelfareData.items.length);
		this.group2.x = this.pgBar.width * (WelfareData.statis["2"]["goal"] / WelfareData.items.length);
		this.group3.x = this.pgBar.width * (WelfareData.statis["3"]["goal"] / WelfareData.items.length);

		this.tgGroup1.x = this.group1.x;
		this.tgGroup2.x = this.group2.x;
		this.tgGroup3.x = this.group3.x;

		this.target1.text = WelfareData.statis["1"]["goal"] + "";
		this.target2.text = WelfareData.statis["2"]["goal"] + "";
		this.target3.text = WelfareData.statis["3"]["goal"] + "";

		this.countLab1.text = WelfareData.statis["1"]["num"] + "";
		this.countLab2.text = WelfareData.statis["2"]["num"] + "";
		this.countLab3.text = WelfareData.statis["3"]["num"] + "";

		this.typeImg1.source = "base_" + WelfareData.statis["1"]["type"] + "_png";
		this.typeImg2.source = "base_" + WelfareData.statis["2"]["type"] + "_png";
		this.typeImg3.source = "base_" + WelfareData.statis["3"]["type"] + "_png";

		switch (WelfareData.statis["1"]["status"]) {
			case 0://不能领奖
				this.ac1.visible = false;
				egret.Tween.removeTweens(this.ac1);
				this.boxBg1.source = "task_pg_box1_1_png";
				break;
			case 1://可以领奖
				this.ac1.visible = true;
				this.boxBg1.source = "task_pg_box1_1_png";
				this.playAnimation(this.ac1);
				break;
			case -1://已领奖
				this.ac1.visible = false;
				egret.Tween.removeTweens(this.ac1);
				this.boxBg1.source = "task_pg_box1_2_png";
				break;
		}

		switch (WelfareData.statis["2"]["status"]) {
			case 0://不能领奖
				this.ac2.visible = false;
				egret.Tween.removeTweens(this.ac2);
				this.boxBg2.source = "task_pg_box2_1_png";
				break;
			case 1://可以领奖
				this.ac2.visible = true;
				this.boxBg2.source = "task_pg_box2_1_png";
				this.playAnimation(this.ac2);
				break;
			case -1://已领奖
				this.ac2.visible = false;
				egret.Tween.removeTweens(this.ac2);
				this.boxBg2.source = "task_pg_box2_2_png";
				break;
		}

		switch (WelfareData.statis["3"]["status"]) {
			case 0://不能领奖
				this.ac3.visible = false;
				egret.Tween.removeTweens(this.ac3);
				this.boxBg3.source = "task_pg_box3_1_png";
				break;
			case 1://可以领奖
				this.ac3.visible = true;
				this.boxBg3.source = "task_pg_box3_1_png";
				this.playAnimation(this.ac3);
				break;
			case -1://已领奖
				this.ac3.visible = false;
				egret.Tween.removeTweens(this.ac3);
				this.boxBg3.source = "task_pg_box3_2_png";
				break;
		}

	}

	private onBoxTouch(evt: egret.TouchEvent) {
		var targetId: string = "";
		switch (evt.currentTarget) {
			case this.boxGroup1:
				targetId = "1";
				break;
			case this.boxGroup2:
				targetId = "2";
				break;
			case this.boxGroup3:
				targetId = "3";
				break;
		}

		var self = this;
		DisplayMgr.buttonScale(evt.currentTarget, function () {
			switch (WelfareData.statis[targetId]["status"]) {
				case 0:
					Prompt.showPrompt(self.stage, "未达领取条件!")
					return;
				case 1:
					NetLoading.showLoading();
					var request = HttpProtocolMgr.take_welfare_progress_reward_633(targetId);
					HttpMgr.postRequest(request);
					break;
				case -1:
					Prompt.showPrompt(self.stage, "奖励已领取!");
					self.updateView();
					return;
			}

		});
	}

	private result_of_633(evt: egret.Event) {
		NetLoading.removeLoading();
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		// Prompt.showPrompt(this.stage, "领取成功!");
		this.updateView();
		var reward: {} = {
				type: WelfareData.statis[evt.data]["type"],
				num: WelfareData.statis[evt.data]["num"]
			};
		var rewArr: {}[] = [];
		rewArr.push(reward);
		var panel = new CommonRewardPanel(rewArr);
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}

	private playAnimation(target: egret.DisplayObject) {
		var tw = egret.Tween.get(target, { loop: true });
		tw.to({ rotation: 360 }, 10000);
	}
}