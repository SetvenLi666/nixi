class GiftPanel extends eui.Component {
	public group: eui.Group;
	public giftGroup: eui.Group;
	public editText: eui.EditableText;
	public btn_receive: eui.Button;

	public constructor() {
		super();

		this.skinName = "GiftPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		(<eui.Label>this.btn_receive.labelDisplay).size = 20;

		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		this.btn_receive.addEventListener(egret.TouchEvent.TOUCH_TAP, this.receiveCallback, this);

		CustomEventMgr.addEventListener("333", this.result_of_333, this);
	}

	private receiveCallback() {
		var text = this.editText.text;
		if (text.length < 8) {
			Prompt.showPrompt(this.stage, "礼包码无效~");
		} else {
			NetLoading.showLoading();
			var request = HttpProtocolMgr.take_gift_333(0, text);
			HttpMgr.postRequest(request);
		}
	}

	private result_of_333(evt: egret.Event) {
		NetLoading.removeLoading();
		var coin: number = evt.data["coin"];
		var diam: number = evt.data["diam"];
		var energy: number = evt.data["energy"];
		var tipStr: string = "";
		if (diam > 0) {
			if (coin > 0) {
				if (energy > 0) {
					tipStr = "成功领取" + diam + "钻石," + coin + "金币," + energy + "体力~!"
				} else {
					tipStr = "成功领取" + diam + "钻石," + coin + "金币~!";
				}
			} else {
				if (energy > 0) {
					tipStr = "成功领取" + diam + "钻石," + energy + "体力~!"
				} else {
					tipStr = "成功领取" + diam + "钻石~!";
				}
			}
		} else if (coin > 0) {
			if (energy > 0) {
				tipStr = "成功领取" + coin + "金币," + energy + "体力~!"
			} else {
				tipStr = "成功领取" + coin + "金币~!";
			}
		} else {
			tipStr = "成功领取" + energy + "体力~!";
		}

		Prompt.showPrompt(this.stage, tipStr);
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		this.closePanel();
	}

	private onTouch(evt: egret.TouchEvent) {
		var rectRangle = this.giftGroup.getTransformedBounds(this.stage);
		if (!rectRangle.contains(evt.stageX, evt.stageY)) {
			this.closePanel();
		}
	}

	private onExit() {
		CustomEventMgr.removeEventListener("333", this.result_of_333, this);
	}

	private closePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}