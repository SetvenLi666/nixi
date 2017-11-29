class LimitDiscountPanel extends eui.Component{
	public group: eui.Group;
	public group2: eui.Group;
	public diamNumImg: eui.Image;
	public coinNumImg: eui.Image;
	public energyNumImg: eui.Image;
	public btnBuy: eui.Image;

	public constructor() {
		super();

		this.skinName = "LimitDiscountPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);
	}

	private touchTap(evt: egret.TouchEvent) {
		var rectAngle = this.group2.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.closePanel();
		}
	}

	private closePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}