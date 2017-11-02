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

		var data: {}[] = [];
		for(var i = 0; i < 45; i++ ) {
			if(i < 3) {
				data.push({icon: "", state: "1"});
			}else if(i < 5) {
				data.push({icon: "", state: "2"});
			}else {
				data.push({icon: "", state: "0"});
			}
			
		}
		var dataSource = new eui.ArrayCollection(data);
		this.list.dataProvider = dataSource;
		this.list.itemRenderer = InviteItemRenderer;
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

		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}

	protected dataChanged() {
		var index = this.itemIndex + 1;
		var index_str = index + "";
		var len = index_str.length;
		this.indexGroup.removeChildren();
		for(var i = 0; i < len; i++) {
			var image_num = new eui.Image();
			image_num.source = "invite_num_" + index_str[i] + "_png";
			this.indexGroup.addChild(image_num);
		}
		
		// this.player_icon

		this.currentState = "state_" + this.data.state;
	}

	private onTouch() {
		// var request = HttpProtocolMgr.
	}
}