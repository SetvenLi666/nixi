class StrangerSelfPanelComp extends eui.Component {
	public bg_nor: eui.Image;
	public bg_sel: eui.Image;
	public nickname: eui.Label;
	public clothes_count: eui.Label;

	public constructor() {
		super();

		this.skinName = "StrangerSelfPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.bg_nor.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNorCallback, this);
		this.bg_sel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelCallback, this);
	}

	private onNorCallback() {
		egret.log("on nor callback");
		this.currentState = "down";
	}

	private onSelCallback() {
		egret.log("on sel callback");
		this.currentState = "up";
	}
}