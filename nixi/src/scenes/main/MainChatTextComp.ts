class MainChatTextComp extends eui.Component{
	public textLabel:eui.Label;

	public constructor() {
		super();

		this.skinName = "MainChatTextSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {

	}
}