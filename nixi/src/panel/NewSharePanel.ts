class NewSharePanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public item: RewardItemComp;
	public roleImg: eui.Image;
	public btn_dis: eui.Image;
	public btn_share: eui.Image;

	private reward: {} = {};
	private index: number = 1;

	public constructor(index: number) {
		super();

		this.index = index;
		this.skinName = "NewSharePanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);

		this.initView();
	}

	private initView() {
		this.roleImg.source = "newshare_role_big_" + this.index + "_png";
		this.reward = ShareData.shareReward;

		for (var i in this.reward) {
			var panel = new RewardItemComp();
			this.item.icon.source = "panel_ui_json.ac_reward_" + i;
			this.item.label.text = this.reward[i];
		}

		this.btn_share.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnCallback, this);
		this.btn_dis.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);
	}

	private btnCallback() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_share, function () {
			SoundManager.instance().buttonSound();
			// window["mqq"].ui.shareMessage({
			// 	title: '逆袭之星途闪耀',
			// 	desc: '逆袭成为超级巨星，霸道总裁、温柔暖男、绝色男神随你挑！',
			// 	share_type: 0,
			// 	share_url: window["OPEN_DATA"].shareurl + "&td_channelid=qqshare",
			// 	image_url: window["OPEN_DATA"].appicon,
			// 	back: true
			// }, function (result) {
			// 	if (result["retCode"] == 0) {
			// 		window["mqq"].ui.showTips({
			// 			text: "分享成功！"
			// 		});
			// 		if (ShareData.shareTimes == 0) {
			// 			var request = HttpProtocolMgr.take_share_reward_175("do_share_reward");
			// 			HttpMgr.postRequest(request);
			// 		}
			// 		ShareData.isShowNewShare = false;
			// 		CustomEventMgr.dispatchEventWith("Update New Share", false);
			// 	} else if (result["retCode"] == 1) {
			// 		window["mqq"].ui.showTips({
			// 			text: "分享取消！"
			// 		});
			// 	}
			// });

			window["mqq"].ui.shareMessage({
				title: '逆袭之星途闪耀',
				desc: '逆袭成为超级巨星，霸道总裁、温柔暖男、绝色男神随你挑！',
				share_type: 0,
				share_url: window["OPEN_DATA"].shareurl + "&td_channelid=qqshare",
				image_url: window["OPEN_DATA"].appicon,
				back: true
			}, function (result) {
				if (result["retCode"] == 0) {
					window["mqq"].ui.showTips({
						text: "分享成功！"
					});

					if (ShareData.shareTimes == 0) {
						var request = HttpProtocolMgr.take_share_reward_175("do_share_reward");
						HttpMgr.postRequest(request);
					}
					ShareData.isShowNewShare = false;
					CustomEventMgr.dispatchEventWith("Update New Share", false);
				} else if (result["retCode"] == 1) {
					window["mqq"].ui.showTips({
						text: "分享取消！"
					});
				}
			});
		});
	}

	private touchTap(evt: egret.TouchEvent) {
		var rectAngle = this.bg.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.closePanel();
		}
	}

	private close() {
		SoundManager.instance().buttonSound();
		this.closePanel();
	}

	private closePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}