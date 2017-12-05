class InvitePanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public list: eui.List;
	public curTimes: eui.Label;
	public nextShareTime: eui.Label;
	public btn_share: eui.Image;

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

		CustomEventMgr.addEventListener("167", this.result_of_167, this);
		CustomEventMgr.addEventListener("164", this.result_of_164, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("167", this.result_of_167, this);
		CustomEventMgr.removeEventListener("164", this.result_of_164, this);
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

	private onShare() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_share, function () {
			if (InviteData.curTimes >= 3) {
				Prompt.showPrompt(self.stage, "今天分享奖励都领到了哟!");
			} else if (self.shareLeftTime > 0) {
				Prompt.showPrompt(self.stage, "不要频繁分享，影响小伙伴体验!");
			} else {
				window["mqq"].ui.shareMessage({
					title: '逆袭之星途闪耀',
					desc: '嫁入豪门还是成为豪门？你怎么选',
					share_type: 0,
					share_url: window["OPEN_DATA"].shareurl + "&td_channelid=qqshare&isid=" + LoginData.sid,
					image_url: window["OPEN_DATA"].appicon,
					back: true
				}, function (result) {
					if (result["retCode"] == 0) {
						window["mqq"].ui.showTips({
							text: "分享成功！"
						});

						NetLoading.showLoading();
						var request = HttpProtocolMgr.take_invite_share_reward_164();
						HttpMgr.postRequest(request);
					} else if (result["retCode"] == 1) {
						window["mqq"].ui.showTips({
							text: "分享取消！"
						});
					}
				});
			}
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
		NetLoading.showLoading();
		var request = HttpProtocolMgr.take_invite_reward_167(this.data.rank);
		HttpMgr.postRequest(request);
	}
}