class TaskUpgradePanel extends eui.Component {
	public group: eui.Group;
	public img_lv1: eui.Image;
	public img_lv2: eui.Image;
	public img_lv3: eui.Image;
	public img_lv4: eui.Image;
	public img_lv5: eui.Image;

	private curLv: number = 1;

	public constructor() {
		super();

		this.curLv = PlayerData.phase;
		this.skinName = "TaskUpgradePanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.playAnimation();
	}

	private playAnimation() {
		var target: eui.Image = this["img_lv" + this.curLv];
		this.setChildIndex(target, this.numChildren - 1);
		var endx = this.group.width / 2 - 230;
		var endy = 110;

		var tw = egret.Tween.get(target);
		tw.to({ scaleX: 1.5, scaleY: 1.5 }, 1000, egret.Ease.backOut).wait(500).to({ x: endx, y: endy, scaleX: 1, scaleY: 1 }, 1000).to({ alpha: 0 }, 200).call(function () {
			CustomEventMgr.dispatchEventWith("Update Player Info", false);

			var id_str = TaskData.totalMissionData()[TaskData.curTaskID - 1]["biaozhiwei"];
			if (id_str != "" && id_str != "0" && StoryData.completedStory[id_str] == null) {//有解锁剧情且未完成
				
			}else {
				CustomEventMgr.dispatchEventWith("Check Scene", false);
			}
			
			this.closePanel();
		}, this);
	}

	private closePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}