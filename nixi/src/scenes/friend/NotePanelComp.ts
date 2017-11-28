class NotePanelComp extends eui.Component {
	public group: eui.Group;
	public note_image: eui.Image;
	public title: eui.Label;
	public btn_send: eui.Image;
	public textDisplay: eui.EditableText;
	public inputTip: eui.Label;
	public curWordNum: eui.Label;
	public id: string;
	public nickname: string;

	public constructor(id: string, nickname: string) {
		super();

		this.id = id;
		this.nickname = nickname;
		this.skinName = "NotePanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit,  this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.title.text = "发送给 " + this.nickname + " 的纸条";

		this.textDisplay.addEventListener(egret.FocusEvent.FOCUS_IN, this.onFocusIn, this);
		this.textDisplay.addEventListener(egret.FocusEvent.FOCUS_OUT, this.onFocusOut, this);
		this.textDisplay.addEventListener(egret.Event.CHANGE, this.onChange, this);

		this.btn_send.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSend, this);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		CustomEventMgr.addEventListener("809", this.afterSendNote, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("809", this.afterSendNote, this);
	}

	private onFocusIn() {
		egret.log("on focus in");
		this.inputTip.visible = false;
	}

	private onFocusOut() {
		egret.log("on focus out");
		if(this.textDisplay.text == "") {
			this.inputTip.visible = true;
		}
	}

	private onChange(evt: egret.Event) {
		egret.log("on change");
		egret.log("curText count = " + this.textDisplay.text.length);
		var curNum = this.textDisplay.text.length;
		if(curNum > 50) {
			this.textDisplay.text = this.textDisplay.text.slice(0, 50);
		}

		this.curWordNum.text = "" + this.textDisplay.text.length;
	}


	private onSend() {
		SoundManager.instance().buttonSound();
		if(this.textDisplay.text == "") {
			Prompt.showPrompt(this.stage, "发送内容不能为空!");
		}else {
			if(IllegalWords.is_blankWords(this.textDisplay.text)) {
				Prompt.showPrompt(this.stage, "输入内容包含敏感字");
			}else {
				NetLoading.showLoading();
				var request: egret.URLRequest = HttpProtocolMgr.send_papar_809(this.id, this.textDisplay.text);
				HttpMgr.postRequest(request);
			}
		}
	}

	private onTouch(evt: egret.TouchEvent) {
		var rectAngle = this.note_image.getTransformedBounds(this.stage);
		if(!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.closePanel();
		}
	}

	private closePanel() {
		if(this.parent) {
			this.parent.removeChild(this);
		}
	}

	private afterSendNote(evt: egret.Event) {
		NetLoading.removeLoading();
		Prompt.showPrompt(egret.MainContext.instance.stage, "发送成功");
		this.closePanel();
	}
}