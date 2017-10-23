class PkAnimScene extends eui.UILayer{
	public constructor() {
		super();

		var mask = DisplayMgr.createSceneMask();
		this.addChild(mask);
        this.mask = mask;
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		var bg = new egret.Bitmap(RES.getRes("pk_bg_png"));
		bg.anchorOffsetX = bg.width / 2;
		bg.anchorOffsetY = bg.height / 2;
		bg.x = DisplayMgr.stageW / 2;
		bg.y = DisplayMgr.stageH / 2;
		this.addChild(bg);

		var layer = new PkAnimLayerComp();
		DisplayMgr.setCenter(layer);
		this.addChild(layer);
	}
}