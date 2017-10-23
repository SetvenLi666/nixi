class SetComp extends eui.Component {
	public editText: eui.EditableText;
	public btn_newName: eui.Button;
	public btn_gift: eui.Image;
	public sid: eui.Label;

	public constructor() {
		super();

		this.skinName = "SetCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.sid.text = LoginData.sid;

		(<eui.Label>this.btn_newName.labelDisplay).size = 20;

		if (ShowData.reset == 0) {
			this.btn_newName.label = "首次免费";
		} else {
			this.btn_newName.label = ShowData.reset + "钻石";
		}
		this.btn_newName.addEventListener(egret.TouchEvent.TOUCH_TAP, this.resetName, this);
		this.btn_gift.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGift, this);

		CustomEventMgr.addEventListener("907", this.afterFetchData_907, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("907", this.afterFetchData_907, this);
	}

	private resetName() {
		var newName = this.editText.text;
		if (newName == "") {
			Prompt.showPrompt(this.stage, "请输入新昵称");
		} else {
			for (var i = 0; i < newName.length; i++) {
				var s = newName[i]
				if (/[a-zA-Z0-9]/g.test(s) || /^[\u4e00-\u9fa5]+$/i.test(s)) {
					//数字及英文字母             //中文
				} else {
					Prompt.showPrompt(this.stage, "仅限汉字,英文字母及数字");
					return;
				}
			}

			if (IllegalWords.is_learnWords(newName)) {
				Prompt.showPrompt(this.stage, "输入内容包含敏感字");
			} else {
				NetLoading.showLoading();
				var request: egret.URLRequest = HttpProtocolMgr.reset_nickname_907(newName);
				HttpMgr.postRequest(request);
			}
		}
	}

	private onGift() {
		if (this.parent.parent) {
			var panel = new GiftPanel();
			DisplayMgr.set2Center(panel);
			this.stage.addChild(panel);
			this.parent.parent.removeChild(this.parent);
		}
	}

	private afterFetchData_907() {
		NetLoading.removeLoading();
		CustomEventMgr.dispatchEventWith("Need Update nickname", false);
		this.editText.text = "";
		this.btn_newName.label = ShowData.reset + "钻石";
		Prompt.showPrompt(this.stage, "改名成功");
	}
}