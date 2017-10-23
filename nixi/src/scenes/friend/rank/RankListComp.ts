class RankListComp extends eui.Component {
	private isMainIn: boolean
	public group: eui.Group;
	public btn_back: eui.Image;
	private btn_note: eui.Image;
	public list: eui.List;
	public selfComp: RankSelfPanelComp;
	public shower: Shower;
	private curSelected: number;

	public constructor(isMainIn: boolean) {
		super();

		this.isMainIn = isMainIn;
		this.skinName = "RankComp";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.selfComp.nickname.text = ShowData.nickname;
		this.selfComp.clothes_count.text = "" + ShowData.collected;

		var isOnRank: boolean = false;
		var length = RankData.rankData.length;
		for (var i = 0; i < length; i++) {
			if (RankData.rankData[i]["id"] == LoginData.sid) {
				isOnRank = true;
				var selfRank = i + 1;
				egret.log("is on rank");
				break;
			}
		}

		if (isOnRank) {
			if (selfRank < 10) {
				this.selfComp.num_mid.source = "num_" + selfRank + "_png";
				this.selfComp.num_mid.visible = true;
			} else {
				this.selfComp.num_lef.source = "num_" + Math.floor((selfRank) / 10) + "_png";
				this.selfComp.num_lef.visible = true;

				this.selfComp.num_rig.source = "num_" + (selfRank) % 10 + "_png";
				this.selfComp.num_rig.visible = true;
			}
		} else {
			this.selfComp.num_mid.source = "weishangbang_png";
			this.selfComp.num_mid.visible = true;
		}

		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goBack, this);
		this.btn_note.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNote, this);

		this.selfComp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelf, this);

		this.list.dataProvider = new eui.ArrayCollection(RankData.rankData);
		this.list.itemRenderer = RankListRenderer;
		this.list.selectedIndex = 0;
		this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelected, this);

		if (RankData.rankData.length == 0) {
			this.list.selectedIndex = -1;
			this.shower.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);
		} else {
			this.shower.dress(RankData.rankData[0]["ondress"], RankData.rankData[0]["ornaments"]);
		}

		this.curSelected = this.list.selectedIndex;

		CustomEventMgr.addEventListener("803", this.afterSendMessage_803, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("803", this.afterSendMessage_803, this);
	}

	private onSelected(evt: eui.ItemTapEvent) {
		egret.log("on selected");
		if (this.curSelected != evt.itemIndex) {
			this.curSelected = evt.itemIndex;
			this.shower.x = -this.group.width;
			this.shower.dress(evt.item.ondress, evt.item.ornaments);
			this.selfComp.currentState = "up";
			this.selfComp.touchEnabled = true;

			var tw = egret.Tween.get(this.shower);
			tw.to({ x: 0 }, 500);
		}
	}

	private onNote() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_note, function () {
			if (self.list.selectedIndex == -1) {
				Prompt.showPrompt(egret.MainContext.instance.stage, "不可以给自己发纸条哦");
			} else {
				var id: string = RankData.rankData[self.list.selectedIndex]["id"];
				if (id == LoginData.sid) {
					Prompt.showPrompt(egret.MainContext.instance.stage, "不可以给自己发纸条哦");
				} else {
					var nickname: string = RankData.rankData[self.list.selectedIndex]["nickname"];
					var notePanel = new NotePanelComp(id, nickname);
					self.addChild(notePanel);
				}
			}
		});
	}

	private goBack() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_back, function () {
			if (self.isMainIn) {
				SceneMgr.gotoMainScene();
			} else {
				SceneMgr.gotoMainFriend();
			}
		});
	}

	private onSelf() {
		egret.log("on self comp");
		if (this.list.selectedIndex == -1) {

		} else {
			this.list.selectedIndex = -1;
			this.selfComp.currentState = "down";
			this.selfComp.touchEnabled = false;
			this.shower.x = -this.group.width;
			this.shower.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);

			var tw = egret.Tween.get(this.shower);
			tw.to({ x: 0 }, 500);
		}
		this.curSelected = this.list.selectedIndex;
	}

	private afterSendMessage_803() {
		NetLoading.removeLoading();
		Prompt.showPrompt(egret.MainContext.instance.stage, "好友请求发送成功");
	}
}


class RankListRenderer extends eui.ItemRenderer {
	public bg_nor: eui.Image;
	public bg_sel: eui.Image;
	public nickname: eui.Label;
	public clothes_count: eui.Label;
	public add_tog: eui.ToggleButton;

	public num_lef: eui.Image;
	public num_mid: eui.Image;
	public num_rig: eui.Image;


	public constructor() {
		super();

		this.skinName = "RankListRendererSkin";
	}

	protected createChildren() {
		super.createChildren();

		this.add_tog.addEventListener(eui.UIEvent.CHANGE, this.onChange, this);
	}

	protected dataChanged() {
		egret.log("data changed");

		if (this.itemIndex == 0) {
			this.bg_nor.source = "first_bg_nor_png";
			this.bg_sel.source = "first_bg_sel_png";
		} else if (this.itemIndex == 1) {
			this.bg_nor.source = "second_bg_nor_png";
			this.bg_sel.source = "second_bg_sel_png";
		} else if (this.itemIndex == 2) {
			this.bg_nor.source = "third_bg_nor_png";
			this.bg_sel.source = "third_bg_sel_png";
		} else {
			this.bg_nor.source = "other_bg_nor_png";
			this.bg_sel.source = "other_bg_sel_png";
		}

		this.nickname.text = this.data.nickname;
		this.clothes_count.text = this.data.collected;

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

		if (FriendData.isFriend(this.data.id)) {
			this.add_tog.currentState = "disabled";
			this.add_tog.touchEnabled = false;
		}

		// if(this.data.id == LoginData.sid) {
		// 	this.add_tog.visible = false;
		// }else {
		// 	this.add_tog.visible = true;
		// }
	}

	private onChange(evt: eui.UIEvent) {
		egret.log(" on add friend !");

		evt.target.currentState = "disabled";
		evt.target.touchEnabled = false;

		NetLoading.showLoading();
		var request: egret.URLRequest = HttpProtocolMgr.send_message_803(this.data.id, 1);
		HttpMgr.postRequest(request);
	}
}