class ChatTextComp extends eui.Component{
	public textLabel:eui.Label;

	public constructor() {
		super();

		this.skinName = "ChatTextSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {

	}
}