class DeleteFriendPanel extends eui.Component {
	public group: eui.Group;
	public title: eui.Label;
	public tip: eui.Label;
	public btn_cancel: eui.Image;
	public btn_confirm: eui.Image;

	private id: string;
	private nickname: string;

	public constructor(id: string, nickname: string) {
		super();

		this.id = id;
		this.nickname = nickname;
		this.skinName = "DeleteFriendPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.tip.text = "是否删除好友 " + this.nickname + "?";

		this.btn_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel, this);
		this.btn_confirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirm, this);
		CustomEventMgr.addEventListener("813", this.result_of_813, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("813", this.result_of_813, this);
	}

	private onCancel() {
		this.closePanel();
	}

	private onConfirm() {
		NetLoading.showLoading();
		var request = HttpProtocolMgr.delete_friend_813(this.id);
		HttpMgr.postRequest(request);
	}

	private result_of_813() {
		NetLoading.removeLoading();
		CustomEventMgr.dispatchEventWith("Delete Friend", false);
		this.closePanel();
	}

	private closePanel() {
		if(this.parent) {
			this.parent.removeChild(this);
		}
	}
}