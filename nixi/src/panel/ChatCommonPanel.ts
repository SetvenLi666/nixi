class ChatCommonPanel extends eui.Component {
	public group: eui.Group;
	public comp: eui.Group;
	public scroller: eui.Scroller;
	public list: eui.List;
	public btn_send: eui.Image;
	public btn_send2: eui.Image;
	public editText: eui.EditableText;
	public btn_close: eui.Image;
	public noticeText: eui.Label;

	public constructor() {
		super();

		this.skinName = "ChatCommonPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		if (ChatData.lastNotice) {
			this.noticeText.textFlow = <Array<egret.ITextElement>>[
				{ text: ChatData.lastNotice["name"] + ": ", style: { textColor: 0xdc143c } },
				{ text: ChatData.lastNotice["chat"], style: { textColor: 0x000000 } }
			];
		} else {
			this.noticeText.text = ChatData.notice;
		}

		ChatData.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComplete, this);

		this.list.dataProvider = ChatData.msg;
		this.list.itemRenderer = ChatItemRenderer;
		if (this.list.contentHeight <= 392) {
			this.scroller.touchEnabled = false;
			this.scroller.touchChildren = false;
		}
		this.scroller.validateNow();
		this.scroller.viewport.scrollV = this.scroller.viewport.contentHeight - this.scroller.viewport.height;

		this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
		this.btn_send.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSend, this);
		this.btn_send2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSend2, this);
		CustomEventMgr.addEventListener("UPDATE_SCROLLER_VIEW", this.updateView, this);
		CustomEventMgr.addEventListener("831", this.resutl_of_831, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("UPDATE_SCROLLER_VIEW", this.updateView, this);
		CustomEventMgr.removeEventListener("831", this.resutl_of_831, this);
	}

	private updateView(evt: egret.Event) {
		this.scroller.validateNow();
		this.scroller.viewport.scrollV = this.scroller.viewport.contentHeight - this.scroller.viewport.height;

		if (this.list.contentHeight <= 490) {
			this.scroller.touchEnabled = false;
			this.scroller.touchChildren = false;
		} else {
			this.scroller.touchEnabled = true;
			this.scroller.touchChildren = true;
		}

		if (evt.data["channel"] && evt.data["channel"] == 1) {
			// this.noticeText.text = evt.data["name"] + ": " + evt.data["chat"];
			this.noticeText.textFlow = <Array<egret.ITextElement>>[
				{ text: evt.data["name"] + ": ", style: { textColor: 0xdc143c } },
				{ text: evt.data["chat"], style: { textColor: 0x000000 } }
			];
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

	private timerComplete(evt: egret.TimerEvent) {
		ChatData.chatCount = 0;
		ChatData.deltaTime = 0;
		ChatData.lastChatTime = 0;
		ChatData.isChatOk = true;
		ChatData.timer.reset();
	}

	private resutl_of_831() {
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		WebSocketMagr.send(this.editText.text, 1);
		this.editText.text = "";
	}

	private onTouch(evt: egret.TouchEvent) {
		var rectAngle = this.comp.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.closePanel();
		}
	}

	private closePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}