class FriendMainScene extends eui.UILayer{
	public constructor() {
		super();

		var mask = DisplayMgr.createSceneMask();
		this.addChild(mask);
        this.mask = mask;
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		var bg = new egret.Bitmap(RES.getRes("social_bg_png"));
		bg.anchorOffsetX = bg.width / 2;
		bg.anchorOffsetY = bg.height / 2;
		bg.x = DisplayMgr.stageW / 2;
		bg.y = DisplayMgr.stageH / 2;
		this.addChild(bg);

		var model = new Model();
		model.horizontalCenter = 0;
		model.y = -160;
		model.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);
	    this.addChild(model);

		var uiLayer = new FriendUILayer();
		DisplayMgr.setCenter(uiLayer);
		this.addChild(uiLayer);

		var baseView = new BaseComp(ShowData.nickname, PlayerData.coin, PlayerData.diam, PlayerData.energy);
		this.addChild(baseView);
	}
}