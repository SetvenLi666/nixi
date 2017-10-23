class RewardItemComp extends eui.Component {
	public bg: eui.Image;
	public icon: eui.Image;
	public label: eui.Label;

	public constructor() {
		super();

		this.skinName = "RewardItemSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {

	}
}