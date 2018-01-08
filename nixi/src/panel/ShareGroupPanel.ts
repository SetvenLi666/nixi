class ShareGroupPanel extends eui.Component{
	// public container: eui.Group;
	public group: eui.Group;

	public constructor() {
		super();

		this.skinName = "ShareGroupPanelSkin";

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		// this.container.width = DisplayMgr.stageW;
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);
	}

	private touchTap() {
		this.closePanel();
	}

	private closePanel() {
		if(this.parent) {
			this.parent.removeChild(this);
		}
	}
}