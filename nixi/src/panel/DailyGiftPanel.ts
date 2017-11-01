class DailyGiftPanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public rewardGroup: eui.Group;

	private type: string = "1";
	private id: string;

	public constructor(type: string, id: string) {
		super();

		this.type = type;
		this.id = id;
		this.skinName = "DailyGiftPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		if(this.id == "101") {
			this.bg.source = "daily_gift_bg_" + this.id + "_png"
		}else {
			this.bg.source = "daily_gift_bg_" + this.type + "_png";
		}
		

		var item: {} = ShareData.giftList[this.id];
		for(var i in item) {
			var rewardItem = new RewardItemComp();
			rewardItem.icon.source = "panel_ui_json.ac_reward_" + i;
			rewardItem.label.text = item[i] + "";
			this.rewardGroup.addChild(rewardItem);
		}

		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}

	private onTouch(evt: egret.TouchEvent) {
		var rectAngle = this.bg.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			CustomEventMgr.dispatchEventWith("Update Player Info", false);
			this.closePanel();
		}
	}

	private closePanel() {
		if (this && this.parent) {
			this.parent.removeChild(this);
		}
	}
}