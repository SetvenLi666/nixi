class TaskProgressComp extends eui.Component {
	public progressBar: eui.ProgressBar;
	public box_1: eui.Component;
	public box_2: eui.Component;
	public box_3: eui.Component;
	public light: eui.Image;
	private itemArr: {}[];
	private selectedBox: eui.Component = null;

	public constructor() {
		super();

		this.skinName = "TaskProgressCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		var curPhase = PlayerData.phase;
		var totalRating = PlayerData.phaseRating(curPhase);

		this.itemArr = CofferData.phase_goals(curPhase);
		var end = this.itemArr[2]["goal"];

		this.progressBar.maximum = end;
		this.progressBar.minimum = 0;
		this.progressBar.value = totalRating;

		
		if(CofferData.has_taken_reward(this.itemArr[0]["id"])) {
			this.box_1.currentState = "state_open";
		}

		if(CofferData.has_taken_reward(this.itemArr[1]["id"])) {
			this.box_2.currentState = "state_open";
		}

		if(CofferData.has_taken_reward(this.itemArr[2]["id"])) {
			this.box_3.currentState = "state_open";
		}

		(<eui.Label>this.box_1["lab"]).text = this.itemArr[0]["reward_value"];
		if(this.itemArr[0]["reward_type"] == "coin") {
			(<eui.Image>this.box_1["type"]).source = "base_json.gj_coin";
		}else if(this.itemArr[0]["reward_type"] == "diam") {
			(<eui.Image>this.box_1["type"]).source = "base_json.gj_gold";
		}else {
			(<eui.Image>this.box_1["type"]).source = "base_json.gj_debris";
		}

		(<eui.Label>this.box_2["lab"]).text = this.itemArr[1]["reward_value"];
		if(this.itemArr[1]["reward_type"] == "coin") {
			(<eui.Image>this.box_2["type"]).source = "base_json.gj_coin";
		}else if(this.itemArr[1]["reward_type"] == "diam") {
			(<eui.Image>this.box_2["type"]).source = "base_json.gj_gold";
		}else {
			(<eui.Image>this.box_2["type"]).source = "base_json.gj_debris";
		}

		(<eui.Label>this.box_3["lab"]).text = this.itemArr[2]["reward_value"];
		if(this.itemArr[2]["reward_type"] == "coin") {
			(<eui.Image>this.box_3["type"]).source = "base_json.gj_coin";
		}else if(this.itemArr[2]["reward_type"] == "diam") {
			(<eui.Image>this.box_3["type"]).source = "base_json.gj_gold";
		}else {
			(<eui.Image>this.box_3["type"]).source = "base_json.gj_debris";
		}

		this.light.x = this.progressBar.x + this.progressBar.width * (this.progressBar.value / this.progressBar.maximum) - this.light.width / 2;

		this.box_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.boxCallback, this);
		this.box_2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.boxCallback, this);
		this.box_3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.boxCallback, this);

		CustomEventMgr.addEventListener("205", this.result_of_205, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("205", this.result_of_205, this);
	}

	private boxCallback(evt: egret.TouchEvent) {
		var self = this;
		var id: string = "";

		switch (evt.currentTarget) {
			case this.box_1:
				DisplayMgr.buttonScale(this.box_1, function () {
					self.selectedBox = self.box_1;
					id = self.itemArr[0]["id"];

					if(CofferData.has_taken_reward(self.itemArr[0]["id"])) {
						Prompt.showPrompt(self.stage, "奖励已经领取过了~");
					}else if(self.progressBar.value < self.itemArr[0]["goal"]) {
						Prompt.showPrompt(self.stage, "领取条件未达到~");
					}else {
						NetLoading.showLoading();
						var request = HttpProtocolMgr.take_company_reward_205(id);
						HttpMgr.postRequest(request);
					}
				});
				break;
			case this.box_2:
				DisplayMgr.buttonScale(this.box_2, function () {
					self.selectedBox = self.box_2;
					id = self.itemArr[1]["id"];

					if(CofferData.has_taken_reward(self.itemArr[1]["id"])) {
						Prompt.showPrompt(self.stage, "奖励已经领取过了~");
					}else if(self.progressBar.value < self.itemArr[1]["goal"]) {
						Prompt.showPrompt(self.stage, "领取条件未达到~");
					}else {
						NetLoading.showLoading();
						var request = HttpProtocolMgr.take_company_reward_205(id);
						HttpMgr.postRequest(request);
					}
				});
				break;
			case this.box_3:
				DisplayMgr.buttonScale(this.box_3, function () {
					self.selectedBox = self.box_3;
					id = self.itemArr[2]["id"];

					if(CofferData.has_taken_reward(self.itemArr[2]["id"])) {
						Prompt.showPrompt(self.stage, "奖励已经领取过了~");
					}else if(self.progressBar.value < self.itemArr[2]["goal"]) {
						Prompt.showPrompt(self.stage, "领取条件未达到~");
					}else {
						NetLoading.showLoading();
						var request = HttpProtocolMgr.take_company_reward_205(id);
						HttpMgr.postRequest(request);
					}
				});
				break;
		}
	}

	private result_of_205(evt: egret.Event) {
		NetLoading.removeLoading();
		this.selectedBox.currentState = "state_open";
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		// Prompt.showPrompt(this.stage, "领取成功~");
	}
}