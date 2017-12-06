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

		CustomEventMgr.addEventListener("803", this.result_of_803, this);
		CustomEventMgr.addEventListener("805", this.result_of_805, this);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("803", this.result_of_803, this);
		CustomEventMgr.removeEventListener("805", this.result_of_805, this);

		this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goBack, this);
	}

	private goBack() {
		DisplayMgr.buttonScale(this.btn_back, function () {
			SceneMgr.gotoMainFriend();
		});
	}

	private result_of_803(evt: egret.Event) {
		NetLoading.removeLoading();
		if(evt.data == 1) {
			Prompt.showPrompt(egret.MainContext.instance.stage, "好友添加成功");
		}else if(evt.data == 2) {
			Prompt.showPrompt(egret.MainContext.instance.stage, "体力赠送成功");
		}
		
		this.list.dataProvider = new eui.ArrayCollection(MessageData.messageListData);
		this.list.dataProviderRefreshed();
		if (MessageData.messageListData.length == 0) {
			this.tip.visible = true;
		}
	}

	private result_of_805(evt: egret.Event) {
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

		this.btn_agree.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAgree, this);
		this.btn_delete2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDelete, this);
	}

	protected dataChanged() {
		this.currentState = "state_" + this.data.type;
		var nick_name: string = "";
		if(!this.data.nickname) {
			nick_name = this.data.sender;
		}else {
			nick_name = this.data.nickname;
		}
		this.title.text = (this.itemIndex + 1) + ". " + nick_name + "发给您的消息";
		switch (this.data.type) {
			case 1:
				if(FriendData.isFriend(this.data.sender)) {
					this.btn_agree.visible = false;
				}else {
					this.btn_agree.visible = true;
				}
				this.content.text = nick_name + "已经添加你为好友。";
				break;
			case 2:
				if(FriendData.isFriend(this.data.sender)) {
					this.btn_agree.source = "msg_btn_give_png";
					this.content.text = "您的好友" + nick_name + "赠送了您体力,请前往领取呦~!";
				}else {
					this.btn_agree.source = "btn_find_png";
					this.content.text = nick_name + "赠送了您体力,请前往领取呦~!";
				}
				// this.content.text = this.data.nickname + "赠送了您体力,请前往领取呦~!";
				break;
			case 3:
				this.content.text = nick_name + "已将您从好友列表移出!";
				break;
		}
	}

	private onAgree() {
		if (FriendData.isFriend(this.data.sender)) {
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.send_message_803(this.data.sender, 2);
			HttpMgr.postRequest(request);
		} else {
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.send_message_803(this.data.sender, 1);
			HttpMgr.postRequest(request);
		}
	}

	private onDelete() {
		egret.log("on delete");
		NetLoading.showLoading();
		var request: egret.URLRequest = HttpProtocolMgr.response_message_805(MessageData.messageListData[this.itemIndex]["id"], 2);
		HttpMgr.postRequest(request);
	}
}