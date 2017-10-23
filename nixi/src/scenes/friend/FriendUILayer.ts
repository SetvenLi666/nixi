class FriendUILayer extends eui.Component {
	public group: eui.Group;
	public btn_back: eui.Image;
	public btn_message: eui.Group;
	public btn_note: eui.Group;
	public btn_friend: eui.Image;
	public btn_stranger: eui.Image;
	public btn_rank: eui.Image;
	public btn_chat: eui.Image;
	public chatComp: ChatComp;

	private tip_msg: eui.Image;
	private tip_note: eui.Image;

	public constructor() {
		super();

		this.skinName = "FriendUISkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		// var btnWidth = this.btn_friend.width;
		// var padding = (this.group.width - btnWidth * 5) / 6;
		// this.btn_message.x = padding;
		// this.btn_note.x = btnWidth + padding * 2;
		// this.btn_friend.x = btnWidth * 2 + padding * 3;
		// this.btn_stranger.x = btnWidth * 3 + padding * 4;
		// this.btn_rank.x = btnWidth * 4 + padding * 5;

		if(NewsData.paper > 0) {
			this.tip_note.visible = true;
			var tw_note = egret.Tween.get(this.tip_note, {loop: true});
			tw_note.to({scaleX: 1.05, scaleY: 1.05}, 300)
				.to({scaleX: 1, scaleY: 1}, 300);
		}else {
			this.tip_note.visible = false;
			egret.Tween.removeTweens(this.tip_note);
		}

		if(NewsData.message > 0) {
			this.tip_msg.visible = true;
			var tw_msg = egret.Tween.get(this.tip_msg, {loop: true});
			tw_msg.to({scaleX: 1.05, scaleY: 1.05}, 300)
				.to({scaleX: 1, scaleY: 1}, 300);
		}else {
			this.tip_msg.visible = false;
			egret.Tween.removeTweens(this.tip_msg);
		}

		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goBack, this);
		this.btn_message.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMessage, this);
		this.btn_note.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNote, this);
		this.btn_friend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFriend, this);
		this.btn_stranger.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStranger, this);
		this.btn_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRank, this);
		this.btn_chat.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChat, this);

		CustomEventMgr.addEventListener("802", this.afterFetchStrangerData_802, this);
		CustomEventMgr.addEventListener("806", this.afterFetchFriendsData_806, this);
		CustomEventMgr.addEventListener("804", this.afterFetchMessageData_804, this);
		CustomEventMgr.addEventListener("808", this.afterFetchPaperData_808, this);
		CustomEventMgr.addEventListener("300", this.afterRankListData_300, this);
		CustomEventMgr.addEventListener("820", this.result_of_820, this);
		CustomEventMgr.addEventListener("910", this.result_of_910, this);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("802", this.afterFetchStrangerData_802, this);
		CustomEventMgr.removeEventListener("806", this.afterFetchFriendsData_806, this);
		CustomEventMgr.removeEventListener("804", this.afterFetchMessageData_804, this);
		CustomEventMgr.removeEventListener("808", this.afterFetchPaperData_808, this);
		CustomEventMgr.removeEventListener("300", this.afterRankListData_300, this);
		CustomEventMgr.removeEventListener("820", this.result_of_820, this);
		CustomEventMgr.removeEventListener("910", this.result_of_910, this);

		this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goBack, this);
		this.btn_message.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMessage, this);
		this.btn_note.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onNote, this);
		this.btn_friend.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onFriend, this);
		this.btn_stranger.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onStranger, this);
		this.btn_rank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRank, this);
		this.btn_chat.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChat, this);
	}

	private onMessage() {
		NetLoading.showLoading();
		DisplayMgr.buttonScale(this.btn_message, function () {
			var request: egret.URLRequest = HttpProtocolMgr.all_messages_804();
			HttpMgr.postRequest(request);
		});
	}

	private onNote() {
		NetLoading.showLoading();
		DisplayMgr.buttonScale(this.btn_note, function () {
			var request: egret.URLRequest = HttpProtocolMgr.all_paper_808();
			HttpMgr.postRequest(request);
		});
	}

	private onFriend() {
		NetLoading.showLoading();
		DisplayMgr.buttonScale(this.btn_friend, function () {
			var request: egret.URLRequest = HttpProtocolMgr.friendListData_806();
			HttpMgr.postRequest(request);
		});
	}

	private onStranger() {
		NetLoading.showLoading();
		DisplayMgr.buttonScale(this.btn_stranger, function () {
			var request: egret.URLRequest = HttpProtocolMgr.strangerListData_802();
			HttpMgr.postRequest(request);
		});
	}

	private onRank() {
		DisplayMgr.buttonScale(this.btn_rank, function () {
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.competition_info_820(!CompetitionData.hasInitRankInfo());
			HttpMgr.postRequest(request);
		});
	}

	private result_of_820() {
		var request: egret.URLRequest = HttpProtocolMgr.rankListData_300();
		HttpMgr.postRequest(request);
	}

	private goBack() {
		DisplayMgr.buttonScale(this.btn_back, function () {
			SceneMgr.gotoMainScene();
		});
	}

	private onChat() {
		if (this.chatComp.visible) {
			this.chatComp.visible = false;
		} else {
			this.chatComp.visible = true;
		}
	}

	private afterFetchStrangerData_802() {
		NetLoading.removeLoading();
		SceneMgr.gotoStranger();
	}

	private afterFetchFriendsData_806() {
		NetLoading.removeLoading();
		SceneMgr.gotoFriend();
	}

	private afterFetchMessageData_804() {
		NetLoading.removeLoading();
		SceneMgr.gotoMessage();
	}

	private afterFetchPaperData_808() {
		NetLoading.removeLoading();
		SceneMgr.gotoNote();
	}

	private afterRankListData_300() {
		NetLoading.removeLoading();
		RankData.enterType = "social";
		SceneMgr.gotoRank();
	}

	private result_of_910() {
		if(NewsData.paper > 0) {
			this.tip_note.visible = true;
			var tw_note = egret.Tween.get(this.tip_note, {loop: true});
			tw_note.to({scaleX: 1.05, scaleY: 1.05}, 300)
				.to({scaleX: 1, scaleY: 1}, 300);
		}else {
			this.tip_note.visible = false;
			egret.Tween.removeTweens(this.tip_note);
		}

		if(NewsData.message > 0) {
			this.tip_msg.visible = true;
			var tw_msg = egret.Tween.get(this.tip_msg, {loop: true});
			tw_msg.to({scaleX: 1.05, scaleY: 1.05}, 300)
				.to({scaleX: 1, scaleY: 1}, 300);
		}else {
			this.tip_msg.visible = false;
			egret.Tween.removeTweens(this.tip_msg);
		}
	}
}