class NewRankSelfComp extends eui.Component {
	public bg: eui.Image;
	public nickname: eui.Label;
	public flag: eui.Image;
	public value: eui.Label;
	public num_lef: eui.Image;
	public num_mid: eui.Image;
	public num_rig: eui.Image;


	public constructor() {
		super();

		this.skinName = "NewRankSelfCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.touchChildren = false;
	}
}