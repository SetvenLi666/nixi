class TaskUnlockPanel extends eui.Component {
	public group: eui.Group;
	public unlockGroup: eui.Group;
	public textlab: eui.Label;
	public btn_back: eui.Image;
	public btn_go: eui.Image;

	private index: number = 1;

	public constructor() {
		super();

		this.skinName = "TaskUnlockPanelSkin";

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.unlockGroup.scaleX = 0;
		this.unlockGroup.scaleY = 0;

		var id_str = TaskData.totalMissionData()[TaskData.curTaskID - 1]["biaozhiwei"];
		this.textlab.text = "第" + StoryData.getHanziText(parseInt(id_str)) + "章";

		var tw = egret.Tween.get(this.unlockGroup);
		tw.to({ scaleX: 1, scaleY: 1 }, 500);

		if (PlayerData.guide == 5) {
			var guidePanel = new NewGuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.stage.addChild(guidePanel);
			guidePanel.currentState = "guide_step_5_1";
			guidePanel.playAnimation();
			CustomEventMgr.addEventListener("Guide_Step_5_1", this.guide_step_5_1, this);
		}

		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBack, this);
		this.btn_go.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGo, this);
	}

	private onExit() {
		if (PlayerData.guide == 5) {
			CustomEventMgr.removeEventListener("Guide_Step_5_1", this.guide_step_5_1, this);
		}
	}

	private onBack() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_back, function () {
			SoundManager.instance().buttonSound();
			CustomEventMgr.dispatchEventWith("Check Scene", false);
			self.closePanel();
		});
	}

	private onGo() {
		DisplayMgr.buttonScale(this.btn_go, function () {
			SoundManager.instance().buttonSound();
			SceneMgr.gotoNewStoryScene();
		});
	}

	private closePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}

	private guide_step_5_1() {
		SceneMgr.gotoNewStorySelectScene();
	}
}