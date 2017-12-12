class FriendListComp extends eui.Component {
	private group: eui.Group;
	private btn_back: eui.Image;
	private btn_note: eui.Image;
	private btn_delete: eui.Image;
	private list: eui.List;
	private selfComp: SelfPanelComp;
	private tip: eui.Label;
	private btn_stranger: eui.Image;
	// private shower: Shower;
	private model: Model;
	private curSelected: number;
	private revGroup: eui.Group;
	private revText: eui.Label;

	public constructor() {
		super();

		this.skinName = "FriendComp";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.selfComp.nickname.text = ShowData.nickname;
		this.selfComp.clothes_count.text = "" + ShowData.collected;
		this.selfComp.tili_label.text = "收到体力: " + SocialData.energy_could_take + "/30";

		this.revText.text = SocialData.energy_could_take + "/30";

		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goBack, this);
		this.btn_note.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNote, this);
		this.btn_delete.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDelete, this);
		this.revGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
		this.selfComp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelf, this);
		this.selfComp.btn_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
		this.btn_stranger.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStranger, this);


		this.list.dataProvider = new eui.ArrayCollection(FriendData.friendsList);
		this.list.itemRenderer = FriendListRenderer;
		this.list.selectedIndex = 0;
		this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelected, this);

		this.model.x = ((this.group.width - 218) - this.model.width * this.model.scaleX) / 2;
		// this.model.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);

		if (FriendData.friendsList.length == 0) {
			this.model.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);
			this.selfComp.currentState = "down";
			this.selfComp.touchEnabled = false;
			this.list.selectedIndex = -1;
			this.tip.visible = true;
			this.btn_stranger.visible = true;
		} else {
			this.model.dressClothesOfSuit(FriendData.friendsObj[FriendData.friendsList[0]]["ondress"], FriendData.friendsObj[FriendData.friendsList[0]]["ornaments"]);
		}

		this.curSelected = this.list.selectedIndex;

		CustomEventMgr.addEventListener("802", this.afterFetchStrangerData_802, this);
		CustomEventMgr.addEventListener("803", this.afterSendMessage_803, this);
		CustomEventMgr.addEventListener("807", this.result_of_807, this);
		CustomEventMgr.addEventListener("Delete Friend", this.afterDeleteFriend, this);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("803", this.afterSendMessage_803, this);
		CustomEventMgr.removeEventListener("807", this.result_of_807, this);
		CustomEventMgr.removeEventListener("802", this.afterFetchStrangerData_802, this);
		CustomEventMgr.removeEventListener("Delete Friend", this.afterDeleteFriend, this);

		this.list.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelected, this);
		this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goBack, this);
		this.btn_note.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onNote, this);
		this.btn_delete.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onDelete, this);
		this.revGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
		this.selfComp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelf, this);
		this.selfComp.btn_get.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
		this.btn_stranger.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onStranger, this);
	}

	private onStranger() {
		NetLoading.showLoading();
		var request: egret.URLRequest = HttpProtocolMgr.strangerListData_802();
		HttpMgr.postRequest(request);
	}

	private onSelected(evt: eui.ItemTapEvent) {
		egret.log("on selected !");
		if (this.curSelected != evt.itemIndex) {
			this.curSelected = evt.itemIndex;
			this.model.x = -this.group.width;
			this.model.dressClothesOfSuit(FriendData.friendsObj[evt.item]["ondress"], FriendData.friendsObj[evt.item]["ornaments"]);
			this.selfComp.currentState = "up";
			this.selfComp.touchEnabled = true;

			this.playAnimation();
		}
	}

	private playAnimation() {
		var self = this;
		self.model.x = -self.model.width * self.model.scaleX - 200;
		var tw = egret.Tween.get(self.model);
		tw.to({x: ((this.group.width - 218) - self.model.width * self.model.scaleX) / 2}, 500);
	}

	private onNote() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_note, function () {
			if (self.list.selectedIndex == -1) {
				Prompt.showPrompt(egret.MainContext.instance.stage, "不可以给自己发纸条哦");
			} else {
				var id: string = FriendData.friendsList[self.list.selectedIndex];
				if (id == LoginData.sid) {
					Prompt.showPrompt(egret.MainContext.instance.stage, "不可以给自己发纸条哦");
				} else {
					var nickname: string = FriendData.friendsObj[id]["nickname"];
					var notePanel = new NotePanelComp(id, nickname);
					self.addChild(notePanel);
				}
			}
		});

	}

	private onDelete() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_delete, function() {
			if(self.list.selectedIndex == -1) {
				Prompt.showPrompt(egret.MainContext.instance.stage, "不可以删除自己哟~");
			}else {
				var id: string = FriendData.friendsList[self.list.selectedIndex];
				var nickname: string = FriendData.friendsObj[id]["nickname"];
				var panel = new DeleteFriendPanel(id, nickname);
				DisplayMgr.set2Center(panel);
				self.stage.addChild(panel);
			}
		});
	}

	private goBack() {
		DisplayMgr.buttonScale(this.btn_back, function () {
			SceneMgr.gotoMainFriend();
		});
	}

	private onSelf() {
		egret.log("on self comp");
		if (this.list.selectedIndex == -1) {

		} else {
			this.list.selectedIndex = -1;
			this.selfComp.currentState = "down";
			this.selfComp.touchEnabled = false;
			this.model.x = -this.group.width;
			this.model.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);

			this.playAnimation();
		}
		this.curSelected = this.list.selectedIndex;
	}

	private onGet() {
		if(SocialData.energy_could_take <= 0) {
			Prompt.showPrompt(this.stage, "暂无可领取体力!");
		}else {
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.take_energy_807();
			HttpMgr.postRequest(request);
		}
	}

	private afterFetchStrangerData_802() {
		NetLoading.removeLoading();
		SceneMgr.gotoStranger();
	}

	private afterSendMessage_803() {
		NetLoading.removeLoading();
		Prompt.showPrompt(egret.MainContext.instance.stage, "体力赠送成功");
	}

	private result_of_807() {
		console.log("get tili success");
		this.revText.text = SocialData.energy_could_take + "/30";
		this.selfComp.tili_label.text = "收到体力: " + SocialData.energy_could_take + "/30";
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		NetLoading.removeLoading();
	}

	private afterDeleteFriend() {
		Prompt.showPrompt(this.stage, "好友已删除!");
		this.list.dataProvider = new eui.ArrayCollection(FriendData.friendsList);
		this.list.dataProviderRefreshed();
		this.list.selectedIndex = 0;

		if (FriendData.friendsList.length == 0) {
			this.model.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);
			this.selfComp.currentState = "down";
			this.selfComp.touchEnabled = false;
			this.list.selectedIndex = -1;
			this.tip.visible = true;
			this.btn_stranger.visible = true;
		} else {
			this.model.dressClothesOfSuit(FriendData.friendsObj[FriendData.friendsList[0]]["ondress"], FriendData.friendsObj[FriendData.friendsList[0]]["ornaments"]);
		}
	}
}


class FriendListRenderer extends eui.ItemRenderer {
	public bg: eui.Image;
	public nickname: eui.Label;
	public clothes_count: eui.Label;
	public send_tog: eui.ToggleButton;
	public num_lef: eui.Image;
	public num_mid: eui.Image;
	public num_rig: eui.Image;

	public constructor() {
		super();

		this.skinName = "FriendListRendererSkin";
	}

	protected createChildren() {
		super.createChildren();

		this.send_tog.addEventListener(eui.UIEvent.CHANGE, this.onChange, this);
	}

	protected dataChanged() {

		this.nickname.text = FriendData.friendsObj[this.data]["nickname"];
		this.clothes_count.text = FriendData.friendsObj[this.data]["collected"];

		// if(LoginData.sid == this.data) {
		// 	egret.log("sid == this.data");
		// }

		if (this.itemIndex < 9) {
			this.num_mid.source = "num_" + (this.itemIndex + 1) + "_png";
			this.num_mid.visible = true;
			this.num_lef.visible = false;
			this.num_rig.visible = false;
		} else {
			this.num_mid.visible = false;

			this.num_lef.source = "num_" + Math.floor((this.itemIndex + 1) / 10) + "_png";
			this.num_lef.visible = true;

			this.num_rig.source = "num_" + (this.itemIndex + 1) % 10 + "_png";
			this.num_rig.visible = true;
		}
	}

	private onChange(evt: eui.UIEvent) {
		egret.log(this.data);
		if (LoginData.sid == this.data) {
			Prompt.showPrompt(egret.MainContext.instance.stage, "不能给自己送体力");
		} else {
			evt.target.currentState = "disabled";
			evt.target.touchEnable = false;

			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.send_message_803(this.data, 2);
			HttpMgr.postRequest(request);
		}
	}
}