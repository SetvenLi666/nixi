class MainChatComp extends eui.Component {
	public scroller: eui.Scroller;
	public list: eui.List;

	public constructor() {
		super();

		this.skinName = "MainChatCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);

		this.list.dataProvider = ChatData.msg;
		this.list.itemRenderer = MainChatItemRenderer;
		this.scroller.validateNow();
		this.scroller.viewport.scrollV = this.scroller.viewport.contentHeight - this.scroller.viewport.height;

		CustomEventMgr.addEventListener("UPDATE_SCROLLER_VIEW", this.updateView, this);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("UPDATE_SCROLLER_VIEW", this.updateView, this);
	}

	private updateView() {
		this.scroller.validateNow();
		this.scroller.viewport.scrollV = this.scroller.viewport.contentHeight - this.scroller.viewport.height;
	}
}



class MainChatItemRenderer extends eui.ItemRenderer {
	private nicknameLabel: eui.Label;
	private textComp: MainChatTextComp;

	public constructor() {
		super();

		this.skinName = "MainChatItemRendererSkin";
	}

	protected createChildren() {
		super.createChildren();
	}

	protected dataChanged() {
		this.nicknameLabel.text = this.data["name"] + ":";
		this.textComp.textLabel.text = this.data["chat"];

		if (this.data["channel"] && this.data["channel"] == 1) {
			this.nicknameLabel.textColor = 0xdc143c;
		} else {
			this.nicknameLabel.textColor = 0x5b94db;
		}

		var msgWidth = this.getTextWidth(this.textComp.textLabel.text);
		var tempWidth: number = msgWidth - this.width;
		if (tempWidth > 0) {
			while (tempWidth > 0) {
				this.height += 16;
				this.textComp.height += 16;
				this.textComp.width = this.width;
				tempWidth -= this.width;
			}
		}else {
			this.height = 50;
			this.textComp.height = 28;
			this.textComp.width = msgWidth;
		}
	}

	private getTextWidth(text: string): number {
		var label = new eui.Label(text);
		label.size = 16;
		label.height = 16;
		return label.width;
	}
}