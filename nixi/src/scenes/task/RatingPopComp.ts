class RatingPopComp extends eui.Component {
	public num_label: eui.Label;
	public flag1: eui.Image;
	public flag2: eui.Image;
	public pgBar: eui.ProgressBar;
	public flagGroup: eui.Group;
	public curNum_label: eui.Label;

	private curPhase: number;
	private rating: number;

	private timer: egret.Timer;

	public constructor(phase: number, rating: number) {
		super();

		this.curPhase = phase;
		this.rating = rating;
		this.skinName = "RatingPopCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.flag1.source = "base_lv" + this.curPhase + "_png";
		this.flag2.source = "base_lv" + Math.min(5, this.curPhase + 1) + "_png";

		var missionData = TaskData.curMissionofPhase(this.curPhase);
		var len = TaskData.curCountsofMission(this.curPhase);
		var itemsArr: string[] = [];
		for (var i = 0; i < len; i++) {
			var item = missionData[i];
			if (itemsArr.indexOf(item["taskID"]) == -1) {
				itemsArr.push(item["taskID"]);
			}
		}

		this.pgBar.maximum = TaskData.totalMissionData()[parseInt(itemsArr[itemsArr.length - 1]) - 1]["upgrade"];
		this.pgBar.minimum = 0;
		// this.pgBar.value = Math.max(PlayerData.phaseRating(this.curPhase) - this.rating, 0);
		this.pgBar.value = 0;

		this.num_label.text = "" + Math.max((this.pgBar.maximum - PlayerData.phaseRating(this.curPhase)), 0);
		this.curNum_label.text = "0";

		// this.addEventListener(egret.Event.ENTER_FRAME, this.updateFlagGroup, this);

		var dealy = (this.rating * 300) / PlayerData.phaseRating(this.curPhase);
		this.timer = new egret.Timer(dealy, PlayerData.phaseRating(this.curPhase))
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.onCallback, this);
	}

	private onExit() {
		this.timer.stop();
		this.timer.reset();
		this.timer = null;
	}

	public playAnimation() {
		// this.pgBar.slideDuration = this.rating * 8000;
		// this.pgBar.value = PlayerData.phaseRating(this.curPhase);
		// this.addEventListener(egret.Event.ENTER_FRAME, this.updateFlagGroup, this);
		this.timer.start();
	}

	private updateFlagGroup() {
		if(this.pgBar.value < PlayerData.phaseRating(this.curPhase)) {
			this.pgBar.value ++;
			this.curNum_label.text = this.pgBar.value + "";
			this.flagGroup.x = this.pgBar.x + (this.pgBar.value / this.pgBar.maximum) * this.pgBar.width;
		}
	}

	private onCallback(evt: egret.TimerEvent) {
		if(this.pgBar.value < PlayerData.phaseRating(this.curPhase)) {
			this.pgBar.value ++;
			this.curNum_label.text = this.pgBar.value + "";
			this.flagGroup.x = this.pgBar.x + (this.pgBar.value / this.pgBar.maximum) * this.pgBar.width;
		}
	}
}