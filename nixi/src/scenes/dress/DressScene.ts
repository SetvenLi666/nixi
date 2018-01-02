/**
 *
 * @author 
 *
 */
class DressScene extends egret.DisplayObjectContainer {
    private _model: Shower;
	private taskId: string;
	private tag1: string;
	private tag2: string;
	private tag3: string;

	private data: any = null;

	public constructor(taskId: string, tag1: string, tag2: string, tag3: string) {
		super();

		this.taskId = taskId;
		this.tag1 = tag1;
		this.tag2 = tag2;
		this.tag3 = tag3;

		var mask = DisplayMgr.createSceneMask();
		this.addChild(mask);
        this.mask = mask;

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.whenEnter, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.whenExit, this);
	}

	private whenEnter() {
		this.initView();

		EventMgr.inst.addEventListener(CustomEvents.ChangeClothes, this.changeClothes, this);

		CustomEventMgr.addEventListener("603", this.after_commit_mission_603, this);
		CustomEventMgr.addEventListener("DRESS DOWN ALL CLOTHES", this.onTap, this);
		CustomEventMgr.addEventListener("905", this.afterGuideData_905, this);
	}

	private whenExit() {
		EventMgr.inst.removeEventListener(CustomEvents.ChangeClothes, this.changeClothes, this);
		CustomEventMgr.removeEventListener("603", this.after_commit_mission_603, this);
		CustomEventMgr.removeEventListener("DRESS DOWN ALL CLOTHES", this.onTap, this);
		CustomEventMgr.removeEventListener("905", this.afterGuideData_905, this);
	}

	private after_commit_mission_603(evt: egret.Event) {
		if (PlayerData.guide == 2) {
			this.data = evt.data;
			var request = HttpProtocolMgr.update_guide_905(5);
			HttpMgr.postRequest(request);
		} else {
			NetLoading.removeLoading();
			console.log("after_commit_mission_603: " + evt.data);
			// {"rating":4,"levelup":false,"energy":6,"coin":40, "clothes":"71311"}
			SceneMgr.gotoTaskRatingScene(evt.data);
		}
	}

	private afterGuideData_905() {
		NetLoading.removeLoading();
		SceneMgr.gotoTaskRatingScene(this.data);
	}

	private initView() {
		var bg = new egret.Bitmap(RES.getRes("phase_bg_" + PlayerData.phase + "_png"));
		bg.anchorOffsetX = bg.width / 2;
		bg.anchorOffsetY = bg.height / 2;
		bg.x = DisplayMgr.stageW / 2;
		bg.y = DisplayMgr.stageH / 2;
		this.addChild(bg);

		var clothesComp = new ClothesListComp(this.taskId, this.tag1, this.tag2, this.tag3);
        this.addChild(clothesComp);

		var base = new BaseComp(ShowData.nickname, PlayerData.coin, PlayerData.diam, PlayerData.energy);
		this.addChild(base);

		if (PlayerData.guide == 3) {
			var guidePanel = new NewGuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.stage.addChild(guidePanel);
			guidePanel.currentState = "guide_step_2_6";
			guidePanel.playAnimation();
		} else if (PlayerData.guide == 4) {
			var guidePanel = new NewGuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.stage.addChild(guidePanel);
			guidePanel.currentState = "guide_step_2_14";
			guidePanel.playAnimation();
		}

	}

	private onTap(evt: egret.TouchEvent) {
		ClothesData.ondressCache = { 1: 10000, 2: 20000, 3: 30000, 4: 40000, 5: 50000, 6: 60000, 8: 80000, 9: 90000, 10: 100000 };
		ClothesData.ornamentsCache = { 11: 70000, 12: 70000, 13: 70000, 14: 70000, 15: 70000, 16: 70000, 17: 70000, 18: 70000, 19: 70000, 20: 70000 };
		this._model.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);
		CustomEventMgr.dispatchEventWith("Update Clothes Status", false);
	}

	private changeClothes(evt: CustomEvents) {
		this._model.dressItem(evt.data["sub_part"], evt.data["id"]);
	}
}
