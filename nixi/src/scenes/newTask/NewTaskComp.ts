class NewTaskComp extends eui.Component {
	public group: eui.Group;
	public ac_star: eui.Image;
	public pkq_bg: eui.Image;
	public scroller: eui.Scroller;
	public list: eui.List;
	public pgComp: NewProgressbarComp;
	public upgradeTip: eui.Label;
	public tipLabel: eui.Label;
	public tipGroup: eui.Group;

	private phase: number = 1;
	private index: number = 1;

	public constructor(phase: number, index: number) {
		super();

		this.skinName = "NewTaskCompSkin";
		this.phase = phase;
		if(phase == 1) {
			this.index = index;
		}else if(phase == 2) {
			this.index = index - 20;
		}else if(phase == 3) {
			this.index = index - 52;
		}else if(phase == 4) {
			this.index = index - 89;
		}else if(phase == 5) {
			this.index = index - 129;
		}
		
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.pgComp.updateViewByPhase(this.phase);

		this.ac_star.x = this.group.width / 2;
		this.ac_star.source = "task_ac_json.task_main_ac_star_" + this.phase;
		this.pkq_bg.source = "task_ac_json.task_main_pkq_" + this.phase;

		var missionData = TaskData.curMissionofPhase(this.phase);
		var len = TaskData.curCountsofMission(this.phase);
		var itemsArr: string[] = [];
		for (var i = 0; i < len; i++) {
			var item = missionData[i];
			if (itemsArr.indexOf(item["taskID"]) == -1) {
				itemsArr.push(item["taskID"]);
			}
		}
		
		this.upgradeTip.text = PlayerData.phaseRating(this.phase) + "/" + TaskData.totalMissionData()[parseInt(itemsArr[itemsArr.length - 1]) - 1]["upgrade"];
		var need_stars = (parseInt(TaskData.totalMissionData()[parseInt(itemsArr[itemsArr.length - 1]) - 1]["upgrade"]) - PlayerData.phaseRating(this.phase));
		if(need_stars <= 0) {
			this.tipGroup.visible = false;
		}else {
			this.tipGroup.visible = true;
			this.tipLabel.text = "" + need_stars;
		}

		itemsArr.reverse();
		this.list.dataProvider = new eui.ArrayCollection(itemsArr);
		this.list.itemRenderer = TaskItemRenderer;

		this.scroller.validateNow();
		if(this.index >= 6 && this.index < len - 3) {
			this.scroller.viewport.scrollV = this.scroller.viewport.contentHeight - this.scroller.viewport.height - 128 * (this.index - 5);
		}else if(this.index >= len - 3 ) {
			this.scroller.viewport.scrollV = this.scroller.viewport.contentHeight;
		}else {
			this.scroller.viewport.scrollV = this.scroller.viewport.contentHeight - this.scroller.viewport.height;
		}
		// this.scroller.viewport.scrollV = this.scroller.viewport.contentHeight - this.scroller.viewport.height;

		var tw_star = egret.Tween.get(this.ac_star, { loop: true });
		tw_star.to({ rotation: 360 }, 30000);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		egret.Tween.removeAllTweens();
	}
}