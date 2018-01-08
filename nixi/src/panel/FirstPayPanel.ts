class FirstPayPanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public item_1: SignItemComp;
	public item_2: SignItemComp;
	public item_3: SignItemComp;
	public item_4: SignItemComp;
	public item_5: SignItemComp;
	public item_6: SignItemComp;
	public item_7: SignItemComp;
	public item_8: SignItemComp;
	public btn_rec: eui.Image;

	public constructor() {
		super();

		this.skinName = "FirstPayPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);

		this.initSignView();

		if (!ShareData.isFirstPay) {
			this.btn_rec.source = "recharge_chongzhi_png";
		} else {
			this.btn_rec.source = "recharge_lingqu_png";
		}

		this.btn_rec.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnRec, this);
		CustomEventMgr.addEventListener("170", this.result_of_170, this);
		CustomEventMgr.addEventListener("Update SC View", this.updateView, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("Update SC View", this.updateView, this);
		CustomEventMgr.removeEventListener("170", this.result_of_170, this);
	}

	private initSignView() {
		var arr: number[] = [15351, 30271, 60271, 70271, 70272, 70273, 70274, 70275];
		var len = arr.length;
		for (var i = 0; i < len; i++) {
			var id: number = arr[i];
			var part: string = Math.floor(id / 10000) + "";
			var sub_part: string;
			var tempData = ClothesData.clothesTemplateData(part, id + "");
			if (part == "7") {
				sub_part = tempData["sub_part"];
			} else {
				sub_part = tempData["part"];
			}

			// this.shower.dressItem(sub_part, id);
			// this.shower.dressItemOfSuit(sub_part, id);

			var item = <SignItemComp>this["item_" + (i + 1)];
			item.itemBg.source = "ac_res_json.ac_1_item_bg";
			item.icon.source = "icon" + id + "_png";
			item.clothes_name.text = tempData["name"];
		}
	}

	private updateView() {
		if (!ShareData.isFirstPay) {
			this.btn_rec.source = "recharge_chongzhi_png";
		} else {
			this.btn_rec.source = "recharge_lingqu_png";
		}
	}

	private onBtnRec() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_rec, function () {
			if (ShareData.isFirstPay == false) {
				NetLoading.showLoading();
				var request = HttpProtocolMgr.all_products_100();
				HttpMgr.postRequest(request);
				self.closePanel();
			} else {
				if (ShareData.firstpay_lottery_times == 0) {
					NetLoading.showLoading();
					var request = HttpProtocolMgr.take_daily_recharge_170("firstpay_lottery");
					HttpMgr.postRequest(request);
				} else {
					Prompt.showPrompt(self.stage, "奖励已领取!");
					return;
				}
			}
		});
	}

	private result_of_170(evt: egret.Event) {
		NetLoading.removeLoading();
		var reward: number[] = [];
		if (evt.data["clothes"]) {
			reward = evt.data["clothes"];
		}
		this.playRewardAnimation(reward);

		CustomEventMgr.dispatchEventWith("Update Player Info", false);

		this.updateView();
		//更新首冲视图
		CustomEventMgr.dispatchEventWith("Update Sc View", false);
	}

	private playRewardAnimation(reward: number[]) {
		var new_reward = [];
		var count = reward.length;
		for (var i = 0; i < count; i++) {
			var item: {} = {
				type: "clothes",
				num: reward[i]
			}
			new_reward.push(item);
		}

		var panel = new CommonRewardPanel(new_reward);
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}

	private touchTap(evt: egret.TouchEvent) {
		var rectAngle = this.bg.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.closePanel();
		}
	}

	private closePanel() {
		if (this.parent) {
			// if (InviteData.isShowInvite) {
			// 	InviteData.isShowInvite = false;
			// 	NetLoading.showLoading();
			// 	var request = HttpProtocolMgr.take_invite_info_165();
			// 	HttpMgr.postRequest(request);
			// }
			this.parent.removeChild(this);
		}
	}
}