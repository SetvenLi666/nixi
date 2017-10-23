class TaskRewardPanel extends eui.Component{
	private group: eui.Group;
	private rewardComp: TaskRewardComp;
	public isOver: boolean = false;
	private type: string;
	private count: number = 0;
	private type2: string = "1";

	public constructor(type: string, count: number, type2: string) {
		super();

		this.skinName = "TaskRewardPanelSkin";
		this.type = type;
		this.type2 = type2;
		this.count = count;
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);

		this.group.width = DisplayMgr.stageW;
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		if(this.type2 == "1") {
			this.rewardComp.bg.source = "panel_ui_json.ac_reward_bg";
		}else {
			this.rewardComp.bg.source = "task_reward_bg_png";
		}

		if(this.type == "clothes") {
			this.rewardComp.icon.source = "icon" + this.count + "_png";
			this.rewardComp.count.text = ClothesData.clothesTemplateData(Math.floor(this.count / 10000).toString(), this.count.toString())["name"];
		}else if(this.type == "coin") {
			this.rewardComp.icon.source = "panel_ui_json.ac_reward_coin";
			this.rewardComp.count.text = this.count.toString();
		}else if(this.type == "diam") {
			this.rewardComp.icon.source = "panel_ui_json.ac_reward_diam";
			this.rewardComp.count.text = this.count.toString();
		}
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		this.group.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}

	private onTouch(evt: egret.TouchEvent) {
		if(this.isOver) {
			this.closePanel();
		}
	}

	private closePanel() {
		if (this.parent) {
			CustomEventMgr.dispatchEventWith("Check Next Panel", false);
			this.parent.removeChild(this);
		}
	}
}