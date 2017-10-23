class NewProgressbarComp extends eui.Component {
	public pgBar: eui.ProgressBar;
	public boxComp1: eui.Group;
	public label1: eui.Label;
	public boxComp2: eui.Group;
	public label2: eui.Label;
	public boxComp3: eui.Group;
	public label3: eui.Label;
	public boxImg1: eui.Image;
	public boxImg2: eui.Image;
	public boxImg3: eui.Image;
	public tip1: eui.Image;
	public tip2: eui.Image;
	public tip3: eui.Image;

	private itemArr: {}[];

	private curId: string = "";

	public constructor() {
		super();

		this.skinName = "NewProgressbarCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {

		this.boxComp1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.boxCallback, this);
		this.boxComp2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.boxCallback, this);
		this.boxComp3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.boxCallback, this);

		CustomEventMgr.addEventListener("205", this.result_of_205, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("205", this.result_of_205, this);
	}

	public updateViewByPhase(phase: number) {
		var curPhase = phase;
		var totalRating = PlayerData.phaseRating(curPhase);

		this.itemArr = CofferData.phase_goals(curPhase);
		var end = this.itemArr[2]["goal"];

		this.pgBar.maximum = end;
		this.pgBar.minimum = 0;
		this.pgBar.value = totalRating;

		if(CofferData.has_taken_reward(this.itemArr[0]["id"])) {
			this.boxImg1.source = "task_pg_box1_2_png";
		}else if(this.pgBar.value >= this.itemArr[0]["goal"]) {
			this.tip1.visible = true;
			var tw_tip1 = egret.Tween.get(this.tip1, {loop: true});
			tw_tip1.to({scaleX: 1.1, scaleY: 1.1}, 300)
				.to({scaleX: 1, scaleY: 1}, 300);
		}

		if(CofferData.has_taken_reward(this.itemArr[1]["id"])) {
			this.boxImg2.source = "task_pg_box2_2_png";
		}else if(this.pgBar.value >= this.itemArr[1]["goal"]) {
			this.tip2.visible = true;
			var tw_tip2 = egret.Tween.get(this.tip2, {loop: true});
			tw_tip2.to({scaleX: 1.1, scaleY: 1.1}, 300)
				.to({scaleX: 1, scaleY: 1}, 300);
		}

		if(CofferData.has_taken_reward(this.itemArr[2]["id"])) {
			this.boxImg3.source = "task_pg_box3_2_png";
		}else if(this.pgBar.value >= this.itemArr[2]["goal"]) {
			this.tip3.visible = true;
			var tw_tip3 = egret.Tween.get(this.tip3, {loop: true});
			tw_tip3.to({scaleX: 1.1, scaleY: 1.1}, 300)
				.to({scaleX: 1, scaleY: 1}, 300);
		}

		this.label1.text = this.itemArr[0]["goal"];
		this.label2.text = this.itemArr[1]["goal"];
		this.label3.text = this.itemArr[2]["goal"];

		this.boxComp1.y = (1 - this.itemArr[0]["goal"] / end) * this.pgBar.height;
		this.boxComp2.y = (1 - this.itemArr[1]["goal"] / end) * this.pgBar.height;
		this.boxComp3.y = (1 - this.itemArr[2]["goal"] / end) * this.pgBar.height;
	}

	private boxCallback(evt: egret.TouchEvent) {
		var self = this;
		self.curId = "";

		switch (evt.currentTarget) {
			case this.boxComp1:
				DisplayMgr.buttonScale(this.boxComp1, function () {
					self.curId = self.itemArr[0]["id"];

					if(CofferData.has_taken_reward(self.itemArr[0]["id"])) {
						Prompt.showPrompt(self.stage, "奖励已经领取过了~");
					}else if(self.pgBar.value < self.itemArr[0]["goal"]) {
						// Prompt.showPrompt(self.stage, "领取条件未达到~");
						var panel = new StarsRewardPanel(self.itemArr[0]);
						DisplayMgr.set2Center(panel);
						self.stage.addChild(panel);
					}else {
						NetLoading.showLoading();
						var request = HttpProtocolMgr.take_company_reward_205(self.curId);
						HttpMgr.postRequest(request);
					}
				});
				break;
			case this.boxComp2:
				DisplayMgr.buttonScale(this.boxComp2, function () {
					self.curId = self.itemArr[1]["id"];

					if(CofferData.has_taken_reward(self.itemArr[1]["id"])) {
						Prompt.showPrompt(self.stage, "奖励已经领取过了~");
					}else if(self.pgBar.value < self.itemArr[1]["goal"]) {
						// Prompt.showPrompt(self.stage, "领取条件未达到~");
						var panel = new StarsRewardPanel(self.itemArr[1]);
						DisplayMgr.set2Center(panel);
						self.stage.addChild(panel);
					}else {
						NetLoading.showLoading();
						var request = HttpProtocolMgr.take_company_reward_205(self.curId);
						HttpMgr.postRequest(request);
					}
				});
				break;
			case this.boxComp3:
				DisplayMgr.buttonScale(this.boxComp3, function () {
					self.curId = self.itemArr[2]["id"];

					if(CofferData.has_taken_reward(self.itemArr[2]["id"])) {
						Prompt.showPrompt(self.stage, "奖励已经领取过了~");
					}else if(self.pgBar.value < self.itemArr[2]["goal"]) {
						// Prompt.showPrompt(self.stage, "领取条件未达到~");
						var panel = new StarsRewardPanel(self.itemArr[2]);
						DisplayMgr.set2Center(panel);
						self.stage.addChild(panel);
					}else {
						NetLoading.showLoading();
						var request = HttpProtocolMgr.take_company_reward_205(self.curId);
						HttpMgr.postRequest(request);
					}
				});
				break;
		}
	}

	private result_of_205() {
		NetLoading.removeLoading();
		if(this.curId == "1") {
			this.tip1.visible = false;
			egret.Tween.removeTweens(this.tip1);
		}else if(this.curId == "2") {
			this.tip2.visible = false;
			egret.Tween.removeTweens(this.tip2);
		}else if(this.curId == "3") {
			this.tip3.visible = false;
			egret.Tween.removeTweens(this.tip3);
		}
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		Prompt.showPrompt(this.stage, "领取成功!");
	}
}