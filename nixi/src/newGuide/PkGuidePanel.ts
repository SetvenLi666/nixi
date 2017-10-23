class PkGuidePanel extends eui.Component{
	public group: eui.Group;
	public acGroup: eui.Group;
	public imgQuan: eui.Image;
	public imgFinger: eui.Image;
	public diamGroup: eui.Group;

	private isActive: boolean = false;

	public constructor() {
		super();

		this.skinName = "PkGuidePanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.acGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.fingerCallback, this);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGroup, this);

		this.imgFinger.scaleX = 0.8;
		this.imgFinger.scaleY = 0.8;

		CustomEventMgr.addEventListener("Play PkGuide Animation", this.playAnimation, this);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("Play PkGuide Animation", this.playAnimation, this);
	}

	private fingerCallback() {
		console.log(this.currentState);
		if(this.currentState == "pkGuide_step_1") {
			CustomEventMgr.dispatchEventWith("PkGuide_Step_1", false);
			this.closeGuidePanel();
		}else if(this.currentState == "pkGuide_step_2") {
			CustomEventMgr.dispatchEventWith("PkGuide_Step_2", false);
			this.closeGuidePanel();
		}else if(this.currentState == "pkGuide_step_4") {
			CustomEventMgr.dispatchEventWith("PkGuide_Step_4", false);
			this.currentState = "pkGuide_step_5";
			this.isActive = false;
		}else if(this.currentState == "pkGuide_step_6") {
			PlayerData.pkGuide = 2;
			CustomEventMgr.dispatchEventWith("PkGuide_Step_6", false);
			this.closeGuidePanel();
		}else if(this.currentState == "pkGuide_step_8") {
			CustomEventMgr.dispatchEventWith("PkGuide_Step_8", false);
			this.currentState = "pkGuide_step_9";
			this.isActive = false;
		}else if(this.currentState == "pkGuide_step_11") {
			PlayerData.pkGuide = 0;
			CustomEventMgr.dispatchEventWith("PkGuide_Step_11", false);
		}
	}

	private onGroup() {
		if(this.currentState == "pkGuide_step_3") {
			this.currentState = "pkGuide_step_4";
		}else if(this.currentState == "pkGuide_step_5") {
			if(this.isActive) {
				this.currentState = "pkGuide_step_6";
			}else {
				this.isActive = true;
			}
		}else if(this.currentState == "pkGuide_step_7") {
			this.currentState = "pkGuide_step_8";
		}else if(this.currentState == "pkGuide_step_9") {
			if(this.isActive) {
				this.currentState = "pkGuide_step_10";
			}else {
				this.isActive = true;
			}
		}else if(this.currentState == "pkGuide_step_10") {
			this.currentState = "pkGuide_step_11";
		}
	}

	public playAnimation() {
		var self = this;
		this.acGroup.visible = true;

		var tw_1 = egret.Tween.get(this.imgFinger, { loop: true });

		tw_1.to({ scaleX: 0.6, scaleY: 0.6 }, 500).call(function () {
			var tw_2 = egret.Tween.get(self.imgQuan);
			tw_2.to({ source: "newguide_quan_1_png" })
				.wait(100)
				.to({ source: "newguide_quan_2_png" })
				.wait(100)
				.to({ source: "newguide_quan_3_png" })
				.wait(100)
				.to({ source: "newguide_quan_4_png" })
				.wait(100)
				.to({ source: "" }, 50);
		}, this)
			.to({ scaleX: 0.8, scaleY: 0.8 }, 500);
	}

	public stopAnimation() {
		this.acGroup.visible = false;
		egret.Tween.removeTweens(this.imgFinger);
	}

	private closeGuidePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}