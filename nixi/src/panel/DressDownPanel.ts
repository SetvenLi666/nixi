class DressDownPanel extends eui.Component{
	private group: eui.Group;
	private btn_yes: eui.Image;
	private btn_no: eui.Image;

	public constructor() {
		super();

		this.skinName = "DressDownPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.btn_yes.addEventListener(egret.TouchEvent.TOUCH_TAP, this.yesCallback, this);
		this.btn_no.addEventListener(egret.TouchEvent.TOUCH_TAP, this.noCallback, this);
	}

	private onExit() {

	}

	private yesCallback() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_yes, function () {
			CustomEventMgr.dispatchEventWith("DRESS DOWN ALL CLOTHES", false);
			self.closePanel();
		});
	}

	private noCallback() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_no, function () {
			self.closePanel();
		});
	}

	private closePanel() {
		if(this.parent) {
			this.parent.removeChild(this);
		}
	}
}