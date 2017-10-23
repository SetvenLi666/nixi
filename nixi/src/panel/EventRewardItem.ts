class EventRewardItem extends eui.Component{
	public icon: eui.Image;
	public count: eui.Label;

	public constructor() {
		super();

		this.skinName = "EventRewardItemSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
	}
}