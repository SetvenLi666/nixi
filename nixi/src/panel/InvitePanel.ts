class InvitePanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public list: eui.List;
	public curTimes: eui.Label;
	public nextShareTime: eui.Label;
	public btn_share: eui.Group;
	public btn_receive: eui.Image;
	public curInviteNum: eui.Label;

	private dataSource: eui.ArrayCollection;

	private shareLeftTime: number;
	private timer: egret.Timer;

	public constructor() {
		super();

		this.skinName = "InvitePanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		this.shareLeftTime = InviteData.curLeftShareTime;
		this.timer = new egret.Timer(1000, this.shareLeftTime);
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimerCallback, this);

		this.curTimes.text = InviteData.curTimes + "/3";
		this.nextShareTime.text = this.formatShareTime(this.shareLeftTime);

		this.curInviteNum.text = InviteData.inviteCount + "/30";

		if (InviteData.inviteCount < 30) {
			this.btn_receive.visible = false;
		} else {
			this.btn_receive.visible = true;
		}

		if (InviteData.reward_state == 1 || InviteData.reward_state == 2) {
			this.btn_receive.source = "invite_btn_buy_png";
		} else if (InviteData.reward_state == 3) {
			this.btn_receive.source = "invite_state_yilinqu_png";
			this.btn_receive.touchEnabled = false;
		}

		if (this.shareLeftTime > 0) {
			this.timer.start();
		}

		this.dataSource = new eui.ArrayCollection(InviteData.inviteList);
		this.list.dataProvider = this.dataSource;
		this.list.itemRenderer = InviteItemRenderer;

		var tw = egret.Tween.get(this.btn_share, { loop: true });
		tw.to({ scaleX: 0.9, scaleY: 0.9 }, 500)
			.to({ scaleX: 1, scaleY: 1 }, 500);

		this.btn_share.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);
		this.btn_receive.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReceive, this);

		CustomEventMgr.addEventListener("167", this.result_of_167, this);
		CustomEventMgr.addEventListener("164", this.result_of_164, this);
		CustomEventMgr.addEventListener("108", this.result_of_108, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("167", this.result_of_167, this);
		CustomEventMgr.removeEventListener("164", this.result_of_164, this);
		CustomEventMgr.removeEventListener("108", this.result_of_108, this);
		this.timer.stop();
		this.timer = null;
		egret.Tween.removeTweens(this.btn_share);
	}

	private updateView() {
		this.shareLeftTime = InviteData.curLeftShareTime;
		this.curTimes.text = InviteData.curTimes + "/3";
		this.nextShareTime.text = this.formatShareTime(this.shareLeftTime);

		if (this.shareLeftTime > 0) {
			this.timer.start();
		}
	}

	private onReceive() {
		DisplayMgr.buttonScale(this.btn_receive, function () {
			var request = HttpProtocolMgr.take_invite_clothes_reward_108();
			HttpMgr.postRequest(request);
		});
	}

	private onShare() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_share, function () {
			SoundManager.instance().buttonSound();

			var panel = new ShareGroupPanel();
			DisplayMgr.set2Center(panel);
			self.stage.addChild(panel);

			leftTime = self.shareLeftTime;

			KJSDK.share({
				title: "逆袭星途闪耀", //分享标题
				desc: "给你看个好玩的，快来！", //游戏提供分享描述
				imgUrl: "", //分享图片链接
				gameid: sdk.data["gameid"],//游戏id
				shareSuccess: "inviteShareSuccess",
				shareCancel: "shareCancel"
			});
		});
	}

	private onTimerCallback(evt: egret.TimerEvent) {
		this.shareLeftTime--;
		this.nextShareTime.text = this.formatShareTime(this.shareLeftTime);
	}

	private formatShareTime(time: number): string {
		var hour = Math.floor(time / 3600);
		var min = Math.floor((time - hour * 3600) / 60);
		var sec = time - hour * 3600 - min * 60;
		var text = (hour < 10 ? "0" + hour : hour) + ":" + (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
		return text;
	}

	private result_of_167() {
		NetLoading.removeLoading();
		var reward: {}[] = [];
		reward.push({ type: "diam", num: 5 });
		this.playRewardAnimation(reward);

		this.dataSource.source = InviteData.inviteList;
		this.dataSource.refresh();
	}

	private result_of_164() {
		NetLoading.removeLoading();
		var reward: {}[] = [];
		reward.push({ type: "diam", num: 10 });
		this.playRewardAnimation(reward);
		this.updateView();
	}

	private result_of_108(evt: egret.Event) {
		NetLoading.removeLoading();
		var new_reward: {}[] = [];
		var reward: number[] = reward = evt.data["clothes"];
		var count = reward.length;
		for (var i = 0; i < count; i++) {
			var item: {} = {
				type: "clothes",
				num: reward[i]
			}
			new_reward.push(item);
		}
		this.playRewardAnimation(new_reward);

		if (InviteData.inviteCount < 30) {
			this.btn_receive.visible = false;
		} else {
			this.btn_receive.visible = true;
		}

		if (InviteData.reward_state == 1 || InviteData.reward_state == 2) {
			this.btn_receive.source = "invite_btn_buy_png";
		} else if (InviteData.reward_state == 3) {
			this.btn_receive.source = "invite_state_yilinqu_png";
			this.btn_receive.touchEnabled = false;
		}
	}

	private playRewardAnimation(reward: {}[]) {
		var panel = new CommonRewardPanel(reward);
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);

		CustomEventMgr.dispatchEventWith("Update Player Info", false);
	}

	private onTouch(evt: egret.TouchEvent) {
		var rectAngle = this.bg.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.close();
		}
	}

	private close() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}

var leftTime: number = 0;

function inviteShareSuccess() {
	console.log("邀请分享成功");
	if (InviteData.curTimes < 3 && leftTime <= 0) {
		NetLoading.showLoading();
		var request = HttpProtocolMgr.take_invite_share_reward_164();
		HttpMgr.postRequest(request);
	}
}

function shareSuccess() {
	console.log("分享成功");
}

function shareCancel() {
	console.log("分享取消");
}


class InviteItemRenderer extends eui.ItemRenderer {
	public indexGroup: eui.Group;
	public player_icon: eui.Image;

	public constructor() {
		super();

		this.skinName = "InviteItemRendererSkin";
	}

	protected createChildren() {
		super.createChildren();

		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}

	protected dataChanged() {
		var index = this.itemIndex + 1;
		var index_str = index + "";
		var len = index_str.length;
		this.indexGroup.removeChildren();
		for (var i = 0; i < len; i++) {
			var image_num = new eui.Image();
			image_num.source = "invite_num_" + index_str[i] + "_png";
			this.indexGroup.addChild(image_num);
		}

		this.currentState = "state_" + this.data.state;
		if (this.currentState == "state_1") {
			this.touchEnabled = true;
			this.touchChildren = true;
		} else {
			this.touchEnabled = false;
			this.touchChildren = false;
		}

		this.player_icon.source = this.data.icon;
	}

	private onTouch() {
		SoundManager.instance().buttonSound();
		NetLoading.showLoading();
		var request = HttpProtocolMgr.take_invite_reward_167(this.data.rank);
		HttpMgr.postRequest(request);
	}
}