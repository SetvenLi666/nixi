class FindPanelComp extends eui.Component {
	public group: eui.Group;
	public btn_find: eui.Image;
	public btn_back: eui.Image;
	public nickname: eui.EditableText;
	private curName: string = null;

	public constructor(name?: string) {
		super();

		this.curName = name;
		this.skinName = "FindPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.btn_find.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFind, this);
		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBack, this);

		if(this.curName) {
			this.nickname.text = this.curName;
		}

		CustomEventMgr.addEventListener("801", this.search_success_801, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("801", this.search_success_801, this);
	}

	private onFind() {
		NetLoading.showLoading();
		var request: egret.URLRequest = HttpProtocolMgr.search_other_801(this.nickname.text);
		HttpMgr.postRequest(request);
	}

	private onBack() {
		egret.log("on back");
		this.closePanel();
	}

	private closePanel() {
		if(this.parent) {
			this.parent.removeChild(this);
		}
	}

	private search_success_801() {
		NetLoading.removeLoading();
		Prompt.showPrompt(egret.MainContext.instance.stage, "好友请求发送成功");
	}
}