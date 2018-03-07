class NewTaskScene extends eui.Component {
	public container: eui.Group;
	public group: eui.Group;

	private baseComp: BaseComp;
	private taskComp: NewTaskComp;

	private phase: number;
	public btn_back: eui.Image;

	public btn_left: eui.Image;
	public btn_right: eui.Image;
	// private pageCount: number = 3;
	private pageCount: number = 1;

	private taskIndex: number = 1;

	public constructor(phase: number, index: number) {
		super();

		this.skinName = "NewTaskSceneSkin";

		var mask = DisplayMgr.createSceneMask();
		this.addChild(mask);
		this.mask = mask;

		//开放任务等级限制
		this.phase = phase > 5 ? 5 : phase;
		this.taskIndex = index > 200 ? 200 : index;
		this.pageCount = PlayerData.phase;

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);

		this.container.width = DisplayMgr.stageW;
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.initView();

		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBack, this);
		this.btn_left.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLeft, this);
		this.btn_right.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRight, this);
		CustomEventMgr.addEventListener("Show DialogComp", this.showDialog, this);

		if (PlayerData.guide == 2) {
			var guidePanel = new NewGuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.stage.addChild(guidePanel);
		}

		console.log(ClientMapData.taskGuide);
		if (ClientMapData.taskGuide == 2 && (PlayerData.guide == 6 || PlayerData.guide == 0)) {
			var guidePanel = new NewGuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.stage.addChild(guidePanel);

			if (PlayerData.guide == 6) {
				guidePanel.currentState = "guide_step_6_14";
			} else if (PlayerData.guide == 0) {
				guidePanel.currentState = "guide_step_6_16";
			}

			guidePanel.playAnimation();
			CustomEventMgr.addEventListener("Guide_Step_6_16", this.guide_step_6_16, this);
		} else if (ClientMapData.taskGuide == 3 && (PlayerData.guide == 6 || PlayerData.guide == 0)) {
			var guidePanel = new NewGuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.stage.addChild(guidePanel);
			guidePanel.currentState = "guide_step_6_17";
			guidePanel.playAnimation();
			CustomEventMgr.addEventListener("Guide_Step_6_17", this.guide_step_6_17, this);
		} else if (ClientMapData.taskGuide == 4 && (PlayerData.guide == 6 || PlayerData.guide == 0)) {
			var guidePanel = new NewGuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.stage.addChild(guidePanel);
			guidePanel.currentState = "guide_step_6_18";
			guidePanel.playAnimation();
			CustomEventMgr.addEventListener("Guide_Step_6_18", this.guide_step_6_18, this);
		}

		SoundManager.instance().startBgSound("main");
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("Show DialogComp", this.showDialog, this);
		this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBack, this);
		this.btn_left.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onLeft, this);
		this.btn_right.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRight, this);

		CustomEventMgr.removeEventListener("Guide_Step_6_16", this.guide_step_6_16, this);
		CustomEventMgr.removeEventListener("Guide_Step_6_17", this.guide_step_6_17, this);
		CustomEventMgr.removeEventListener("Guide_Step_6_18", this.guide_step_6_18, this);

		egret.Tween.removeAllTweens();
		// SoundManager.instance().destroyStartSound();
	}

	private initView() {
		this.taskComp = new NewTaskComp(this.phase, this.taskIndex);
		this.taskComp.x = (DisplayMgr.stageW - this.taskComp.width) / 2;
		this.container.addChild(this.taskComp);
		this.container.setChildIndex(this.taskComp, 1);

		this.baseComp = new BaseComp(ShowData.nickname, PlayerData.coin, PlayerData.diam, PlayerData.energy, PlayerData.heart);
		this.addChild(this.baseComp);

		this.updateView();
	}

	private updateView() {
		if (this.pageCount == 1) {
			this.btn_right.visible = false;
			this.btn_left.visible = false;
		} else if (this.pageCount > 1) {
			if (this.phase == 1) {
				this.btn_right.visible = false;
				this.btn_left.visible = true;
				this.btn_left.touchEnabled = true;
			} else if (this.phase == this.pageCount) {
				this.btn_right.visible = true;
				this.btn_left.visible = false;
				this.btn_right.touchEnabled = true;
			} else if (this.phase > 1 && this.phase < this.pageCount) {
				this.btn_right.visible = true;
				this.btn_left.visible = true;
				this.btn_right.touchEnabled = true;
				this.btn_left.touchEnabled = true;
			}
		}
	}

	private showDialog(evt: egret.Event) {
		var dialogComp = new NewTaskDialogComp(evt.data);
		this.addChild(dialogComp);
	}

	private onLeft() {
		var self = this;
		SoundManager.instance().buttonSound("flip");
		self.btn_left.touchEnabled = false;
		self.btn_right.touchEnabled = false;
		self.phase += 1;
		console.log(self.btn_left.touchEnabled);
		var newComp = new NewTaskComp(self.phase, 1);
		newComp.x = (DisplayMgr.stageW - self.taskComp.width) / 2 - self.taskComp.width;
		self.container.addChild(newComp);
		self.container.setChildIndex(newComp, 1);
		var tw = egret.Tween.get(self.taskComp);
		tw.to({ x: (DisplayMgr.stageW - self.taskComp.width) / 2 + self.taskComp.width }, 500);
		var tw2 = egret.Tween.get(newComp);
		tw2.to({ x: (DisplayMgr.stageW - self.taskComp.width) / 2 }, 500).call(function () {
			self.container.removeChild(self.taskComp);
			self.taskComp = newComp;
			self.updateView();
		}, this);
	}

	private onRight() {
		var self = this;
		SoundManager.instance().buttonSound("flip");
		self.btn_left.touchEnabled = false;
		self.btn_right.touchEnabled = false;
		self.phase -= 1;
		var newComp = new NewTaskComp(self.phase, 1);
		newComp.x = (DisplayMgr.stageW - self.taskComp.width) / 2 + self.taskComp.width
		self.container.addChild(newComp);
		self.container.setChildIndex(newComp, 1);

		var tw = egret.Tween.get(self.taskComp);
		tw.to({ x: (DisplayMgr.stageW - self.taskComp.width) / 2 - self.taskComp.width }, 500);
		var tw2 = egret.Tween.get(newComp);
		tw2.to({ x: (DisplayMgr.stageW - self.taskComp.width) / 2 }, 500).call(function () {
			self.container.removeChild(self.taskComp);
			self.taskComp = newComp;
			self.updateView();
		}, this);
	}

	private onBack() {
		DisplayMgr.buttonScale(this.btn_back, function () {
			SoundManager.instance().buttonSound();
			SceneMgr.gotoMainScene();
		});
	}

	private guide_step_6_16() {
		var dialogComp = new NewTaskDialogComp(2);
		this.addChild(dialogComp);
	}

	private guide_step_6_17() {
		var dialogComp = new NewTaskDialogComp(3);
		this.addChild(dialogComp);
	}

	private guide_step_6_18() {
		var dialogComp = new NewTaskDialogComp(4);
		this.addChild(dialogComp);
	}
}


class TaskItemRenderer extends eui.ItemRenderer {
	public itemComp: eui.Component;

	public constructor() {
		super();

		this.skinName = "TaskItemRendererSkin";
	}

	protected createChildren() {
		super.createChildren();

		this.itemComp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	}

	protected dataChanged() {
		var taskid = parseInt(this.data);
		if (this.itemIndex == TaskData.curCountsofMission(PlayerData.phase) - 1) {
			this.itemComp.x = 213;
		} else {
			switch (taskid % 4) {
				case 1:
					this.itemComp.x = 213;
					break;
				case 2:
					this.itemComp.x = 426;
					break;
				case 3:
					this.itemComp.x = 213;
					break;
				case 0:
					this.itemComp.x = 0;
					break;
			}
		}


		this.itemComp["item_bg"].source = "task_ui_json.task_item_bg_" + (Math.floor(Math.random() * 5) + 1);

		var numGroup = <eui.Group>this.itemComp["numGroup"];
		numGroup.removeChildren();
		if (taskid < 10) {
			// this.itemComp["num_center"].visible = true;
			// this.itemComp["num_left"].visible = false;
			// this.itemComp["num_right"].visible = false;
			// this.itemComp["num_center"].source = "task_ui_json.task_num_" + taskid;
			var num_center = new eui.Image("task_ui_json.task_num_" + taskid);
			numGroup.addChild(num_center);
		} else if (taskid >= 10 && taskid < 100) {
			// this.itemComp["num_center"].visible = false;
			// this.itemComp["num_left"].visible = true;
			// this.itemComp["num_right"].visible = true;
			// this.itemComp["num_left"].source = "task_ui_json.task_num_" + Math.floor(taskid / 10);
			// this.itemComp["num_right"].source = "task_ui_json.task_num_" + taskid % 10;
			var num_left = new eui.Image("task_ui_json.task_num_" + Math.floor(taskid / 10));
			numGroup.addChild(num_left);
			var num_right = new eui.Image("task_ui_json.task_num_" + taskid % 10);
			numGroup.addChild(num_right);
		} else if (taskid >= 100) {
			var num_left = new eui.Image("task_ui_json.task_num_" + Math.floor(taskid / 100));
			numGroup.addChild(num_left);
			var num_center = new eui.Image("task_ui_json.task_num_" + (Math.floor(taskid / 10)) % 10);
			numGroup.addChild(num_center);
			var num_right = new eui.Image("task_ui_json.task_num_" + (taskid % 100) % 10);
			numGroup.addChild(num_right);
		}

		if (taskid == 1) {
			this.itemComp["item_lock"].visible = false;
		} else {
			if (TaskData.userData()[(taskid - 1).toString()] && PlayerData.phase >= parseInt(TaskData.totalMissionData()[taskid - 1]["phase"])) {
				this.itemComp["item_lock"].visible = false;
			} else {
				this.itemComp["item_lock"].visible = true;
			}
		}

		if (TaskData.userData()[taskid.toString()]) {
			this.itemComp.currentState = "state_" + TaskData.userData()[taskid.toString()];
		} else {
			this.itemComp.currentState = "state_0";
		}

	}

	private onTap() {
		//当前任务id
		SoundManager.instance().buttonSound();
		var taskid = parseInt(this.data);
		if (PlayerData.phase < parseInt(TaskData.totalMissionData()[taskid - 1]["phase"])) {
			Prompt.showPrompt(this.stage, "角色等级不足!");
			return;
		}
		if (taskid == 1 || TaskData.userData()[(taskid - 1).toString()]) {
			CustomEventMgr.dispatchEventWith("Show DialogComp", false, taskid);
		} else {
			Prompt.showPrompt(this.stage, "请先完成上一个任务");
		}
	}
}