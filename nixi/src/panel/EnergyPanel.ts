class EnergyPanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public btn_energy: eui.Image;


	public constructor() {
		super();

		this.skinName = "EnergyPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);

		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);
		this.btn_energy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEnergyBtn, this);		
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		this.group.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);
		this.btn_energy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEnergyBtn, this);
	}

	private onEnergyBtn() {
		if (NewsData.energy1 == 1 || NewsData.energy2 == 1) {
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.take_energy_reward_301();
			HttpMgr.postRequest(request);
		}else {
			Prompt.showPrompt(this.stage, "暂未到开放时间");
		}
	}

	private touchTap(evt: egret.TouchEvent) {
		var rectAngle = this.bg.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.closePanel();
		}
	}

	private closePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}