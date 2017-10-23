class NicknamePanel extends eui.Component implements eui.UIComponent {
	// Export ----------------------------------------------
	public constructor() {
		super();

		this.skinName = "resource/skins/login/NicknameSkin.exml";
	}

	// Event && Callback -----------------------------------
	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();

		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.nameInput.text = "游客" + LoginData.sid;

		this.btnConfirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnConfirm, this);
	}

	private onBtnConfirm(evt: egret.TouchEvent) {
		var self = this;
		var btn: egret.DisplayObject = evt.target;
		DisplayMgr.buttonScale(btn, function () {
			for (var i = 0; i < self.nameInput.text.length; i++) {
				var s = self.nameInput.text[i]
				if (/[a-zA-Z0-9]/g.test(s) || /^[\u4e00-\u9fa5]+$/i.test(s)) {
					//数字及英文字母             //中文
				} else {
					Prompt.showPrompt(self.stage, "仅限汉字,英文字母及数字");
					return;
				}
			}

			if (IllegalWords.is_learnWords(self.nameInput.text)) {
				Prompt.showPrompt(self.stage, "输入内容包含敏感字");
			} else {
				CustomEventMgr.dispatchEventWith("ON_SAVE_NICKNAME", false, self.nameInput.text);
			}
		});
	}

	// Inner -----------------------------------------------
	private group: eui.Group;
	private nameInput: eui.EditableText;
	private btnConfirm: eui.Image;
}