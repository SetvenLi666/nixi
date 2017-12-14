class SetPanel extends eui.Component {
	public group: eui.Group;
	public setComp: eui.Group;
	public btn_copy: eui.Image;
	public btn_reset: eui.Image;
	public btn_ex: eui.Image;
	public label_id: eui.Label;
	public edit_nickname: eui.EditableText;
	public edit_code: eui.EditableText;

	public constructor() {
		super();

		this.skinName = "SetPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		this.label_id.text = LoginData.sid;
		this.edit_nickname.prompt = ShowData.nickname;


		this.btn_copy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCopy, this);
		this.btn_reset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReset, this);
		this.btn_ex.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEx, this);

		CustomEventMgr.addEventListener("333", this.result_of_333, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("333", this.result_of_333, this);
	}

	private onCopy() {
		DisplayMgr.buttonScale(this.btn_copy, function () {
			SoundManager.instance().buttonSound();
			window["mqq"].data.setClipboard({
				text: LoginData.sid
			}, function (result) {
				if (result) {
					alert('复制成功');
				} else {
					alert('复制失败');
				}
			});
		});
	}

	private onReset() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_reset, function() {
			SoundManager.instance().buttonSound();
			var resetPanel = new ResetNamePanel(self.edit_nickname.text);
			DisplayMgr.set2Center(resetPanel);
			self.stage.addChild(resetPanel);
		});
	}

	private onEx() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_ex, function () {
			SoundManager.instance().buttonSound();
			var text = self.edit_code.text;
			if (text.length < 8) {
				Prompt.showPrompt(self.stage, "礼包码无效~");
			} else {
				NetLoading.showLoading();
				var request = HttpProtocolMgr.take_gift_333(0, text);
				HttpMgr.postRequest(request);
			}
		});
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
	}

	private onTouch(evt: egret.TouchEvent) {
		var rectRangle = this.setComp.getTransformedBounds(this.stage);
		if (!rectRangle.contains(evt.stageX, evt.stageY)) {
			this.closePanel();
		}
	}

	private closePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}