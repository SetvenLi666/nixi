class MessageUILayer extends eui.Component {
	public group: eui.Group;
	public btn_back: eui.Image;
	public list: eui.List;
	public tip: eui.Group;

	public constructor() {
		super();

		this.skinName = "MessageUISkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goBack, this);

		if (MessageData.messageListData.length == 0) {
			this.tip.visible = true;
		}

		this.list.dataProvider = new eui.ArrayCollection(MessageData.messageListData);
		this.list.itemRenderer = MessageItemRenderer;

		CustomEventMgr.addEventListener("805", this.result_of_805, this);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("805", this.result_of_805, this);

		this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goBack, this);
	}

	private goBack() {
		DisplayMgr.buttonScale(this.btn_back, function () {
			SoundManager.instance().buttonSound();
			SceneMgr.gotoMainFriend();
		});
	}

	private result_of_805() {
		console.log("handle success");
		NetLoading.removeLoading();
		this.list.dataProvider = new eui.ArrayCollection(MessageData.messageListData);
		this.list.dataProviderRefreshed();
		if (MessageData.messageListData.length == 0) {
			this.tip.visible = true;
		}
	}
}



class MessageItemRenderer extends eui.ItemRenderer {
	public btn_delete: eui.Image;
	public btn_agree: eui.Image;
	public title: eui.Label;
	public content: eui.Label;
	public btn_delete2: eui.Image;

	public constructor() {
		super();

		this.skinName = "MessageItemSkin";
	}

	protected createChildren() {
		super.createChildren();

		// this.btn_agree.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAgree, this);
		this.btn_delete2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDelete, this);
	}

	protected dataChanged() {
		this.title.text = (this.itemIndex + 1) + ". " + this.data.sender + "发给您的消息";
		switch(this.data.type) {
			case 1:
			this.content.text = this.data.sender + "已经添加你为好友。";
			break;
			case 2:
			this.content.text = "您的好友" + this.data.sender + "赠送了您体力,请前往领取呦~!";
			break;
			case 3:
			this.content.text = this.data.sender + "删除您的好友.";
			break;
		}
	}

	private onAgree() {
		egret.log("on agree");
		NetLoading.showLoading();
		var request: egret.URLRequest = HttpProtocolMgr.response_message_805(MessageData.messageListData[this.itemIndex]["id"], 1);
		HttpMgr.postRequest(request);
	}

	private onDelete() {
		egret.log("on delete");
		NetLoading.showLoading();
		var request: egret.URLRequest = HttpProtocolMgr.response_message_805(MessageData.messageListData[this.itemIndex]["id"], 2);
		HttpMgr.postRequest(request);
	}
}