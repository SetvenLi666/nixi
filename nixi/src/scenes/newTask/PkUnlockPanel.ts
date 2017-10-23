class PkUnlockPanel extends eui.Component {
	public group: eui.Group;
	public unlockGroup: eui.Group;
	public btn_back: eui.Image;
	public btn_go: eui.Image;

	public constructor() {
		super();

		this.skinName = "PkUnlockPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.unlockGroup.scaleX = 0;
		this.unlockGroup.scaleY = 0;

		var self = this;
		
		self.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onBack, self);
		self.btn_go.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onGo, self);
		self.btn_back.touchEnabled = false;
		self.btn_go.touchEnabled = false;

		var tw = egret.Tween.get(self.unlockGroup);
		tw.to({ scaleX: 1, scaleY: 1 }, 500).call(function () {
			var guidePanel = new PkGuidePanel();
			DisplayMgr.set2Center(guidePanel);
			self.stage.addChild(guidePanel);
			guidePanel.currentState = "pkGuide_step_1";
			guidePanel.playAnimation();
			CustomEventMgr.addEventListener("PkGuide_Step_1", self.pkGuide_step_1_1, self);
			self.btn_back.touchEnabled = true;
			self.btn_go.touchEnabled = true;	
		}, self);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("PkGuide_Step_1", this.pkGuide_step_1_1, this);
	}

	private pkGuide_step_1_1() {
		this.onGo();
	}

	private onBack() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_back, function () {
			self.closePanel();
		});
	}

	private onGo() {
		DisplayMgr.buttonScale(this.btn_go, function () {
			SceneMgr.gotoMainScene();
		});
	}

	private closePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}