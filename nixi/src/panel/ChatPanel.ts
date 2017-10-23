class ChatPanel extends eui.Component {
	public group: eui.Group;
	public chatComp: ChatComp;

	public constructor() {
		super();

		this.skinName = "ChatPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		ChatData.isOpen = true;
	}

	private onTouch(evt: egret.TouchEvent) {
		var rectAngle = this.chatComp.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.closePanel();
		}
	}

	private closePanel() {
		if(this.parent) {
			this.parent.removeChild(this);
			ChatData.isOpen = false;
		}
	}
}