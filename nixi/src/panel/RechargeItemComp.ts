class RechargeItemComp extends eui.Component{
	public icon: eui.Image;
	
	public constructor() {
		super();

		this.skinName = "RechargeItemSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {

	}
}