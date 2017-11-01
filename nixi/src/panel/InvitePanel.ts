class InvitePanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public list: eui.List;

	public constructor() {
		super();

		this.skinName = "InvitePanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

	}

	private onTouch(evt: egret.TouchEvent) {
		var rectAngle = this.bg.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.close();
		}
	}

	private close() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}


class InviteItemRenderer extends eui.ItemRenderer {
	public indexGroup: eui.Group;
	public player_icon: eui.Image;

	public constructor() {
		super();

		this.skinName = "InviteItemRendererSkin";
	}

	protected createChildren() {
		super.createChildren();
	}

	protected dataChanged() {

	}
}