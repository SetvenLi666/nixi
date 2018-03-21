class ShopScene extends eui.UILayer{
	private taskid: string = null;
	private tag1: string = null;
	private tag2: string = null;
	private tag3: string = null;

	public constructor(taskid?: string, tag1?: string, tag2?: string, tag3?: string) {
		super();

		var mask = DisplayMgr.createSceneMask();
		this.addChild(mask);
        this.mask = mask;

		this.taskid = taskid;
		this.tag1 = tag1;
		this.tag2 = tag2;
		this.tag3 = tag3;
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		var bg = new egret.Bitmap(RES.getRes("newmain_ui_json.main_bg"));
		bg.anchorOffsetX = bg.width / 2;
		bg.anchorOffsetY = bg.height / 2;
		bg.x = DisplayMgr.stageW / 2;
		bg.y = DisplayMgr.stageH / 2;
		this.addChild(bg);

		var layer = new ShopLayer(this.taskid, this.tag1, this.tag2, this.tag3);
		this.addChild(layer);

		var baseView = new BaseComp(ShowData.nickname, PlayerData.coin, PlayerData.diam, PlayerData.energy, PlayerData.heart);
		this.addChild(baseView);

		if(PlayerData.guide == 3) {
			var guidePanel = new NewGuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.stage.addChild(guidePanel);
			guidePanel.currentState = "guide_step_2_7";
			guidePanel.playAnimation();
		}
	}
}