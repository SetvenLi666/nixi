class ShareDeskPanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public titleImg: eui.Image;
	public textImg: eui.Image;
	public iconGroup: eui.Group;
	public btnImg: eui.Image;

	private type: string;
	private reward: {} = {};

	public isCanbeClose: boolean = true;

	public constructor(type: string) {
		super();

		this.type = type;
		this.skinName = "ShareDeskPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);

		if (this.type == "share") {
			// this.reward = [{ type: "diam", num: 10 }]
			this.reward = ShareData.shareReward;
		} else if (this.type == "desk") {
			// this.reward = [
			// 	{ type: "diam", num: 50 },
			// 	{ type: "coin", num: 500 }
			// ];
			this.reward = ShareData.shortcutReward;
		}
		this.initView();
	}

	private initView() {
		this.titleImg.source = "panel_title_" + this.type + "_png";
		this.textImg.source = "panel_text_" + this.type + "_png";
		this.btnImg.source = "panel_btn_" + this.type + "_png";

		// for (var i = 0; i < this.reward.length; i++) {
		// 	var item = this.reward[i];
		// 	var panel = new RewardItemComp();
		// 	panel.icon.source = "panel_ui_json.ac_reward_" + item["type"];
		// 	panel.label.text = item["num"];
		// 	this.iconGroup.addChild(panel);
		// }
		for (var i in this.reward) {
			var panel = new RewardItemComp();
			panel.icon.source = "panel_ui_json.ac_reward_" + i;
			panel.label.text = this.reward[i];
			this.iconGroup.addChild(panel);
		}

		this.btnImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnCallback, this);
	}

	private btnCallback() {
		var self = this;
		DisplayMgr.buttonScale(this.btnImg, function () {
			//分享，发送桌面
			if (self.type == "share") {
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
					} else if (result["retCode"] == 1) {
						window["mqq"].ui.showTips({
							text: "分享取消！"
						});
					}
				});
			} else if (self.type == "desk") {
				window["mqq"].ui.addShortcut({
					action: 'web',
					title: '逆袭之星途闪耀',
					icon: window["OPEN_DATA"].appicon,
					url: window["OPEN_DATA"].jumpurl,
					callback: function (result) {
						if (result["result"] == 0 && ShareData.shortcutTimes == 0) {
							var request = HttpProtocolMgr.take_share_reward_175("shortcut_reward");
							HttpMgr.postRequest(request);
						}
					}
				});
			}
		});

		this.isCanbeClose = true;
	}

	private touchTap(evt: egret.TouchEvent) {
		var rectAngle = this.bg.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.closePanel();
		}
	}

	private closePanel() {
		if (this.parent && this.isCanbeClose) {
			this.parent.removeChild(this);
		}
	}
}