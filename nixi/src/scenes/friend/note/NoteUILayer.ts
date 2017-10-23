class NoteUILayer extends eui.Component {
	public group: eui.Group;
	public btn_back: eui.Image;
	public list: eui.List;
	public tip: eui.Group;

	public constructor() {
		super();

		this.skinName = "NoteUISkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goBack, this);

		if (PaperData.paperListData.length == 0) {
			this.tip.visible = true;
		}

		this.list.dataProvider = new eui.ArrayCollection(PaperData.paperListData);
		this.list.itemRenderer = NoteItemRenderer;

		CustomEventMgr.addEventListener("803", this.afterSendMessage_803, this);
		CustomEventMgr.addEventListener("811", this.afterDeleteMessage_811, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("803", this.afterSendMessage_803, this);
		CustomEventMgr.removeEventListener("811", this.afterDeleteMessage_811, this);
	}

	private goBack() {
		DisplayMgr.buttonScale(this.btn_back, function () {
			SceneMgr.gotoMainFriend();
		});
	}

	private afterSendMessage_803() {
		NetLoading.removeLoading();
		Prompt.showPrompt(egret.MainContext.instance.stage, "好友请求已发送");
	}

	private afterDeleteMessage_811() {
		NetLoading.removeLoading();
		this.list.dataProvider = new eui.ArrayCollection(PaperData.paperListData);
		this.list.dataProviderRefreshed();

		if (PaperData.paperListData.length == 0) {
			this.tip.visible = true;
		}
	}
}



class NoteItemRenderer extends eui.ItemRenderer {
	public title: eui.Label;
	public content: eui.Label;
	public btn_delete: eui.Image;
	public btn_add: eui.Image;
	public btn_reply: eui.Image;

	public constructor() {
		super();

		this.skinName = "NoteItemSkin";
	}

	protected createChildren() {
		super.createChildren();

		this.btn_add.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAdd, this);
		this.btn_delete.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDelete, this);
		this.btn_reply.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReply, this);
	}

	protected dataChanged() {
		this.title.text = (this.itemIndex + 1) + ". " + this.data.sender_name + "发给您的纸条";
		this.content.text = this.data.content;
	}

	private onAdd() {
		egret.log("on add");
		if (FriendData.isFriend(this.data.sender)) {
			Prompt.showPrompt(egret.MainContext.instance.stage, "对方已经是您的好友了");
		} else {
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.send_message_803(this.data.sender, 1);
			HttpMgr.postRequest(request);
		}
	}

	private onDelete() {
		egret.log("on delete");
		NetLoading.showLoading();
		var request: egret.URLRequest = HttpProtocolMgr.delete_paper_811(this.data.id);
		HttpMgr.postRequest(request);
	}

	private onReply() {
		var panel = new NotePanelComp(this.data.sender, this.data.sender_name);
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}
}