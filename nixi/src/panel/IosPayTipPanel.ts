class IosPayTipPanel extends eui.Component{
	public group: eui.Group;
	public bg: eui.Image;

	public constructor() {
		super();

		this.skinName = "IosPayTipPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);
	}

	private touchTap(evt: egret.TouchEvent) {
		this.closePanel();
	}

	private closePanel() {
		if(this.parent) {
			this.parent.removeChild(this);
		}
	}
}