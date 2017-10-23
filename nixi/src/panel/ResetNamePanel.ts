class ResetNamePanel extends eui.Component {
	public group: eui.Group;
	public content: eui.Label;
	public btn_sure: eui.Image;
	public btn_cancel: eui.Image;

	private newName: string = "";

	public constructor(name: string) {
		super();

		this.newName = name;
		this.skinName = "ResetNamePanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.content.text = "是否花费" + ShowData.reset + "钻石修改昵称";

		this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSure, this);
		this.btn_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel, this);
		CustomEventMgr.addEventListener("907", this.afterFetchData_907, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("907", this.afterFetchData_907, this);
	}

	private onSure() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_sure, function () {
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.reset_nickname_907(self.newName);
			HttpMgr.postRequest(request);
		});
	}

	private onCancel() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_cancel, function () {
			self.closePanel();
		});
	}

	private afterFetchData_907() {
		NetLoading.removeLoading();
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		Prompt.showPrompt(this.stage, "改名成功");
		this.closePanel();
	}

	private closePanel() {
		if(this.parent) {
			this.parent.removeChild(this);
		}
	}
}