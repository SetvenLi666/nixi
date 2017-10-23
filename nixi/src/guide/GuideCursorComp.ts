class GuideCursorComp extends eui.Component{
	public icon: eui.Image;
	public circle: eui.Image;

	public constructor() {
		super();

		this.skinName = "GuideCursorSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {

	}
}