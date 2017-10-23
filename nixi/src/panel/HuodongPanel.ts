class HuodongPanel extends eui.Component{
	private group: eui.Group;
	private bg: eui.Image;
	private list: eui.List;
	private data: eui.ArrayCollection;

	public constructor() {
		super();

		this.skinName = "HuodongPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		var sourceData: string[] = [
			
		];
		this.data = new eui.ArrayCollection(sourceData);
		this.list.dataProvider = this.data;
		this.list.itemRenderer = HuodongPanelRenderer;
	}

	private onTouch(evt: egret.TouchEvent) {
		var rectAngle = this.bg.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.close();
		}
	}

	private close() {
		if(this && this.parent) {
			this.parent.removeChild(this);
		}
	}
}


class HuodongPanelRenderer extends eui.ItemRenderer {
	private imageBg: eui.Image;

	public constructor() {
		super();

		this.skinName = "HuodongPanelRendererSkin";
	}

	protected createChildren() {
		super.createChildren();

		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}

	protected dataChanged() {
		this.imageBg.source = this.data;
	}

	private onTouch() {

	}
}