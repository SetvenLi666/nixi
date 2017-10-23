class DropComp extends eui.Component{
	public icon: eui.Image;
	public clothes_name: eui.Label;

	public constructor() {
		super();

		this.skinName = "DropCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {

	}
}