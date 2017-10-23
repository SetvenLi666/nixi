class SelfPanelComp extends eui.Component {
	public bg: eui.Image;
	public btn_get: eui.Image;
	public nickname: eui.Label;
	public clothes_count: eui.Label;
	public tili_label: eui.Label;

	public constructor() {
		super();

		this.skinName = "SelfPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {

	}
}