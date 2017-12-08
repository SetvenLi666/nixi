class EmailPanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public tip: eui.Group;
	public mail_list: eui.List;

	private acTimer: egret.Timer;
	private reward: {}[] = null;
	private count: number = 0;

	public constructor() {
		super();

		this.skinName = "EmailPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);

		if (MailData.mailArray.length == 0) {
			this.tip.visible = true;
		}

		this.mail_list.dataProvider = new eui.ArrayCollection(MailData.mailArray);
		this.mail_list.itemRenderer = EmailListRenderer;

		CustomEventMgr.addEventListener("701", this.result_of_701, this);

	}

	private onExit() {
		CustomEventMgr.removeEventListener("701", this.result_of_701, this);
	}

	private touchTap(evt: egret.TouchEvent) {
		var rectAngle = this.bg.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.closePanel();
		}
	}

	private closePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}

	private result_of_701(evt: egret.Event) {
		NetLoading.removeLoading();
		CustomEventMgr.dispatchEventWith("Update Player Info", false);

		if (evt.data.info["oper"] == 1) {
			this.updateMailList(evt.data.info["id"], evt.data.info["oper"]);
			if (evt.data.reward) {
				if(evt.data.reward["clothes"]) {
					this.playRewardAnimation(evt.data.reward);
				}else {
					Prompt.showPrompt(egret.MainContext.instance.stage, "领取成功");
				}
			}
		} else {
			this.updateMailList(evt.data.info["id"], evt.data.info["oper"]);
		}
	}

	private updateMailList(id: number, oper: number) {
		var length = MailData.mailArray.length;
		for (var i = length - 1; i >= 0; i--) {
			var obj = MailData.mailArray[i];
			if (obj["id"] == id) {
				MailData.mailArray.splice(i, 1);
			}
		}
		this.mail_list.dataProvider = new eui.ArrayCollection(MailData.mailArray);
		this.mail_list.dataProviderRefreshed();

		if (MailData.mailArray.length == 0) {
			this.tip.visible = true;
		}
	}

	private playRewardAnimation(data: {}) {
		this.reward = [];
		for (var i in data) {
			if (i == "clothes") {
				var leng = data["clothes"].length;
				for (var j = 0; j < leng; j++) {
					var item: {} = {
						type: "clothes",
						num: data[i][j]
					}
					this.reward.push(item);
				}
			} else {
				var item: {} = { type: i, num: data[i] };
				this.reward.push(item);
			}
		}
		var panel = new CommonRewardPanel(this.reward);
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}
}


class EmailListRenderer extends eui.ItemRenderer {
	public content: eui.Label;
	public title: eui.Label;
	public btn_delete: eui.Image;
	public btn_receive: eui.Image;
	public rwd_1_image: eui.Image;
	public rwd_1_value: eui.Label;
	public rwd_2_image: eui.Image;
	public rwd_2_value: eui.Label;
	public rwd_3_image: eui.Image;
	public rwd_3_value: eui.Label;


	public constructor() {
		super();

		this.skinName = "EmailListRendererSkin";
	}

	protected createChildren() {
		super.createChildren();

		this.btn_delete.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDelete, this);
		this.btn_receive.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReceive, this);
	}

	protected dataChanged() {
		this.title.text = this.data["title"];
		this.content.text = this.data["content"];

		if (this.data["sender"] == "sys_order") {
			this.btn_delete.visible = false;
		} else {
			this.btn_delete.visible = true;
		}

		if (this.data["attachment"]["coin"] > 0) {
			this.rwd_1_image.source = "mail_coin_png";
			this.rwd_1_image.visible = true;
			this.rwd_1_value.text = this.data["attachment"]["coin"];
			this.rwd_1_value.visible = true;
			if (this.data["attachment"]["diam"] > 0) {
				this.rwd_2_image.source = "mail_diam_png";
				this.rwd_2_value.text = this.data["attachment"]["diam"];
				this.rwd_2_image.visible = true;
				this.rwd_2_value.visible = true;
				if (this.data["attachment"]["energy"] > 0) {
					this.rwd_3_image.source = "mail_energy_png";
					this.rwd_3_value.text = this.data["attachment"]["energy"];
					this.rwd_3_image.visible = true;
					this.rwd_3_value.visible = true;
				}
			} else if (this.data["attachment"]["energy"] > 0) {
				this.rwd_2_image.source = "mail_energy_png";
				this.rwd_2_value.text = this.data["attachment"]["energy"];
				this.rwd_2_image.visible = true;
				this.rwd_2_value.visible = true;
			}
		} else {
			if (this.data["attachment"]["diam"] > 0) {
				this.rwd_1_image.source = "mail_diam_png";
				this.rwd_1_value.text = this.data["attachment"]["diam"];
				this.rwd_1_image.visible = true;
				this.rwd_1_value.visible = true;
				if (this.data["attachment"]["energy"] > 0) {
					this.rwd_2_image.source = "mail_energy_png";
					this.rwd_2_value.text = this.data["attachment"]["energy"];
					this.rwd_2_image.visible = true;
					this.rwd_2_value.visible = true;
				}
			} else if (this.data["attachment"]["energy"] > 0) {
				this.rwd_1_image.source = "mail_energy_png";
				this.rwd_1_value.text = this.data["attachment"]["energy"];
				this.rwd_1_image.visible = true;
				this.rwd_1_value.visible = true;
			}
		}
	}

	private onDelete() {
		NetLoading.showLoading();
		var request: egret.URLRequest = HttpProtocolMgr.response_mail_701(this.data.id, 2);
		HttpMgr.postRequest(request);
	}

	private onReceive() {
		NetLoading.showLoading();
		var request: egret.URLRequest = HttpProtocolMgr.response_mail_701(this.data.id, 1);
		HttpMgr.postRequest(request);
	}
}