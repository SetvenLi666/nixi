class CountDownComp extends eui.Component{
	public timeLabel: eui.Label;
	public constructor() {
		super();

		this.skinName = "CountDownSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		CustomEventMgr.addEventListener("COUNTDOWN_HIDE", this.hideComp, this);
		CustomEventMgr.addEventListener("COUNTDOWN_UNHIDE", this.unhideComp, this);
		CustomEventMgr.addEventListener("Update CountDown", this.update, this);

		if(PlayerData.energy < 100) {
			this.visible = true;
		}else {
			this.visible = false;
		}

		this.timeLabel.text = (Math.floor(PlayerData.left / 60) < 10 ? "0" + Math.floor(PlayerData.left / 60) : Math.floor(PlayerData.left / 60)) + ":" + (PlayerData.left % 60 < 10 ? "0" + PlayerData.left % 60 : PlayerData.left % 60);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("COUNTDOWN_HIDE", this.hideComp, this);
		CustomEventMgr.removeEventListener("COUNTDOWN_UNHIDE", this.unhideComp, this);
		CustomEventMgr.removeEventListener("Update CountDown", this.update, this);
	}

	private hideComp() {
		this.visible = false;
	}

	private unhideComp() {
		this.visible = true;
	}

	private update() {
		this.timeLabel.text = (Math.floor(PlayerData.left / 60) < 10 ? "0" + Math.floor(PlayerData.left / 60) : Math.floor(PlayerData.left / 60)) + ":" + (PlayerData.left % 60 < 10 ? "0" + PlayerData.left % 60 : PlayerData.left % 60);
	}
}