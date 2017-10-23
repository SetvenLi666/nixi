class GashaponButton extends eui.Component {
	public icon: eui.Image;
	public label: eui.Label;
	public costLabel: eui.Label;
	public dia_image: eui.Image;

	public constructor() {
		super();

		this.skinName = "GashaponButtonSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {

	}
}