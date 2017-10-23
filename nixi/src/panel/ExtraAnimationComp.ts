class ExtraAnimationComp extends eui.Component{
	public item: RewardItemComp;

	public constructor() {
		super();

		this.skinName = "ExtraAnimationSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.item.label.text = "水晶碎片";
		this.item.icon.source = "gashapon_suipian_png";
	}
}