class RankSelfPanelComp extends eui.Component {
	public bg_sel: eui.Image;
	public nickname: eui.Label;
	public clothes_count: eui.Label;
	public num_lef: eui.Image;
	public num_mid: eui.Image;
	public num_rig: eui.Image;


	public constructor() {
		super();

		this.skinName = "RankSelfPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.touchChildren = false;
	}
}