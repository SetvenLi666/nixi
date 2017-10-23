class TaskTipComp extends eui.Component {
	public tag_1: eui.Image;
	public tag_2: eui.Image;
	public tag_3: eui.Image;
	public filterImage: eui.Image;
	public filteredImage: eui.Image;

	public constructor() {
		super();

		this.skinName = "TaskTipSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {

	}
}