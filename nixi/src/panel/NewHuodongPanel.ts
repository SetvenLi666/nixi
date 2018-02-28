class NewHuodongPanel extends eui.Component {
	public group: eui.Group;
	public group2: eui.Group;
	public scroller: eui.Scroller;
	public tabBar: eui.TabBar;

	public constructor() {
		super();

		this.skinName = "NewHuodongPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);

		this.tabBar.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onBarItemTap, this);
	}

	private onBarItemTap(evt: eui.ItemTapEvent) {
		console.log(evt.itemIndex);
	}

	private touchTap(evt: egret.TouchEvent) {
		var rectAngle = this.group2.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.close();
		}
	}

	private close() {
		if(this.parent) {
			this.parent.removeChild(this);
		}
	}
}