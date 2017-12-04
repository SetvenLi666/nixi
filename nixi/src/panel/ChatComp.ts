class ChatComp extends eui.Component {
	public list: eui.List;
	public btn_close: eui.Image;
	public btn_send: eui.Image;
	public btn_send2: eui.Image;
	public noticeText: eui.Label;
	public editText: eui.EditableText;
	public scroller: eui.Scroller;
	// private timer: egret.Timer;
	// private isChatOk: boolean = true;

	public constructor() {
		super();

		this.skinName = "ChatCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
		this.btn_send.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSend, this);
		this.btn_send2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSend2, this);
		CustomEventMgr.addEventListener("UPDATE_SCROLLER_VIEW", this.updateView, this);
		CustomEventMgr.addEventListener("831", this.resutl_of_831, this);

		// this.noticeText.text = ChatData.notice;
		if (ChatData.lastNotice) {
			this.noticeText.textFlow = <Array<egret.ITextElement>>[
				{ text: ChatData.lastNotice["name"] + ": ", style: { textColor: 0xdc143c } },
				{ text: ChatData.lastNotice["chat"], style: { textColor: 0x000000 } }
			];
		}else {
			this.noticeText.text = ChatData.notice;
		}

		ChatData.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
		ChatData.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComplete, this);

		this.list.dataProvider = ChatData.msg;
		this.list.itemRenderer = ChatItemRenderer;
		// if (this.list.contentHeight < 630) {
		// 	this.scroller.touchEnabled = false;
		// 	this.scroller.touchChildren = false;
		// }
		this.scroller.validateNow();
		this.scroller.viewport.scrollV = this.scroller.viewport.contentHeight - this.scroller.viewport.height;
	}

	private onExit() {
		CustomEventMgr.removeEventListener("UPDATE_SCROLLER_VIEW", this.updateView, this);
		CustomEventMgr.removeEventListener("831", this.resutl_of_831, this);
	}

	private updateView(evt: egret.Event) {
		this.scroller.validateNow();
		this.scroller.viewport.scrollV = this.scroller.viewport.contentHeight - this.scroller.viewport.height;

		// if (this.list.contentHeight < 630) {
		// 	this.scroller.touchEnabled = false;
		// 	this.scroller.touchChildren = false;
		// } else {
		// 	this.scroller.touchEnabled = true;
		// 	this.scroller.touchChildren = true;
		// }

		if (evt.data["channel"] && evt.data["channel"] == 1) {
			// this.noticeText.text = evt.data["name"] + ": " + evt.data["chat"];
			this.noticeText.textFlow = <Array<egret.ITextElement>>[
				{ text: evt.data["name"] + ": ", style: { textColor: 0xdc143c } },
				{ text: evt.data["chat"], style: { textColor: 0x000000 } }
			];
		}
	}

	private onClose() {
		if (this.parent) {
			if (this.parent.parent.parent == this.stage) {
				this.stage.removeChild(this.parent.parent);
			} else {
				this.visible = false;
			}
		}
	}

	private onSend() {
		if (this.editText.text == "") {
			Prompt.showPrompt(this.stage, "发送内容不可为空!");
		} else {
			if (IllegalWords.is_learnWords(this.editText.text)) {
				Prompt.showPrompt(this.stage, "输入内容包含敏感字");
			} else {
				if (ChatData.isChatOk) {
					WebSocketMagr.send(this.editText.text, 0);
					this.editText.text = "";

					this.updateSendTime();
				} else {
					Prompt.showPrompt(this.stage, "发言频率过快," + (ChatData.timer.repeatCount - ChatData.timer.currentCount) + "秒后可继续发言");
				}
			}
		}
	}

	private updateSendTime() {
		console.log("updateSendTime");
		var now_time = CommonFunc.curTimeStamp();
		var last_time = ChatData.lastChatTime == 0 ? now_time : ChatData.lastChatTime;
		var delta_time = ChatData.deltaTime;

		var new_delta: number = 0;
		if (now_time - last_time >= 10000) {
			new_delta = 0;
			ChatData.chatCount = 0;
			ChatData.deltaTime = 0;
		} else {
			new_delta = delta_time + (now_time - last_time);
		}

		if (ChatData.chatCount + 1 >= 3) {
			if (new_delta < 10000) {
				//禁言10秒
				ChatData.isChatOk = false;
				// this.timer.start();
				ChatData.timer.start();
			}

			ChatData.chatCount = 0;
			ChatData.deltaTime = 0;
		} else {
			ChatData.chatCount++;
			ChatData.deltaTime = new_delta;
			ChatData.lastChatTime = CommonFunc.curTimeStamp();
		}

	}

	private onSend2() {
		if (this.editText.text == "") {

		} else {
			if (IllegalWords.is_learnWords(this.editText.text)) {
				Prompt.showPrompt(this.stage, "输入内容包含敏感字");
			} else {
				var request = HttpProtocolMgr.before_send_shout_831();
				HttpMgr.postRequest(request);
			}
		}
	}

	private resutl_of_831() {
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		WebSocketMagr.send(this.editText.text, 1);
		this.editText.text = "";
	}

	private timerFunc(evt: egret.TimerEvent) {
		// this.leftTime = this.timer.repeatCount - this.timer.currentCount
	}

	private timerComplete(evt: egret.TimerEvent) {
		ChatData.chatCount = 0;
		ChatData.deltaTime = 0;
		ChatData.lastChatTime = 0;
		ChatData.isChatOk = true;
		ChatData.timer.reset();
	}
}


class ChatItemRenderer extends eui.ItemRenderer {
	public nicknameLabel: eui.Label;
	public textComp: ChatTextComp;

	public constructor() {
		super();

		this.skinName = "ChatItemRendererSkin";
	}

	protected createChildren() {
		super.createChildren();

		this.nicknameLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
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
		if (msgWidth + 20 > this.width - 14) {
			this.height = 70 + 20;
			this.textComp.height = 40 + 20;
			this.textComp.width = this.width - 14;
		} else {
			this.height = 70;
			this.textComp.height = 40;
			this.textComp.width = msgWidth + 20;
		}
	}

	private getTextWidth(text: string): number {
		var label = new eui.Label(text);
		label.size = 20;
		label.height = 20;
		return label.width;
	}

	private onTouch() {
		var panel = new FindPanelComp(this.data.name);
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}
}

