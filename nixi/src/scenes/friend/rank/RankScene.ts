class RankScene extends eui.UILayer{
	public constructor() {
		super();

		var mask = DisplayMgr.createSceneMask();
		this.addChild(mask);
        this.mask = mask;

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		
		var bg = new egret.Bitmap(RES.getRes("newmain_ui_json.main_bg"));
		bg.anchorOffsetX = bg.width / 2;
		bg.anchorOffsetY = bg.height / 2;
		bg.x = DisplayMgr.stageW / 2;
		bg.y = DisplayMgr.stageH / 2;
		this.addChild(bg);

		var layer = new NewRankListComp();
		DisplayMgr.setCenter(layer);
		this.addChild(layer);

		var baseView = new BaseComp(ShowData.nickname, PlayerData.coin, PlayerData.diam, PlayerData.energy);
		this.addChild(baseView);
	}
}