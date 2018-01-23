class InviteFreeRewardPanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public item_0: SignItemComp;
	public item_1: SignItemComp;
	public item_2: SignItemComp;
	public item_3: SignItemComp;
	public item_4: SignItemComp;
	public item_5: SignItemComp;
	public item_6: SignItemComp;
	public item_7: SignItemComp;
	public label_count: eui.Label;
	public btn_invite: eui.Image;


	public constructor() {
		super();

		this.skinName = "InviteFreeRewardPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);

		this.initView();
		this.btn_invite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onInvite, this);
		CustomEventMgr.addEventListener("108", this.result_of_108, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("108", this.result_of_108, this);
	}

	private initView() {
		var arr: number[] = [21541, 31541, 51541, 61541, 71541, 71542, 71543, 71544];
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

			// this.model.dressItem(sub_part, id);
			// this.model.dressItemOfSuit(sub_part, id);

			var item = <SignItemComp>this["item_" + i];
			item.itemBg.source = "ac_res_json.ac_6_item_bg";
			item.icon.source = "icon" + id + "_png";
			item.clothes_name.text = tempData["name"];
		}

		if(InviteData.reward_state == 1) {
			this.btn_invite.source = "libao_btn_invite_png";
		}else {
			this.btn_invite.source = "libao_btn_lingqu_png";
		}
		this.label_count.text = InviteData.inviteCount + "/30";
	}

	private onInvite() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_invite, function () {
			if(InviteData.reward_state == 1) {
				NetLoading.showLoading();
				var request = HttpProtocolMgr.take_invite_info_165();
				HttpMgr.postRequest(request);
				self.closePanel();
			}else if(InviteData.reward_state == 2) {
				var request = HttpProtocolMgr.take_invite_clothes_reward_108();
				HttpMgr.postRequest(request);
			}else if(InviteData.reward_state == 3) {
				Prompt.showPrompt(self.stage, "奖励已经领取");
			}
			
		});
	}

	private result_of_108(evt: egret.Event) {
		NetLoading.removeLoading();
		var new_reward: {}[] = [];
		var reward: number[] = reward = evt.data["clothes"];
		var count = reward.length;
		for(var i = 0; i < count; i++) {
			var item: {} = {
				type: "clothes",
				num: reward[i]
			}
			new_reward.push(item);
		}
		this.playRewardAnimation(new_reward);
		CustomEventMgr.dispatchEventWith("Update Libao View", false);
	}

	private playRewardAnimation(reward: {}[]) {
		var panel = new CommonRewardPanel(reward);
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);

		CustomEventMgr.dispatchEventWith("Update Player Info", false);
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
}