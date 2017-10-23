var isShowCompetition: boolean = true;

class NewRankListComp extends eui.Component {
	public group: eui.Group;
	// public shower: Shower;
	public model: Model;
	public btn_note: eui.Image;
	public btn_back: eui.Image;
	// public timeTip: eui.Label;
	public scroller: eui.Scroller;
	public selfComp: NewRankSelfComp;
	public list: eui.List;

	public btn_dp: eui.Image;
	public btn_pk: eui.Image;

	// private isShowCompetition: boolean;
	private emptyTip: eui.Label;

	private curSelected: number;

	// private isAnimation: boolean = false;


	public constructor() {
		super();

		this.skinName = "NewRankListCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		isShowCompetition = false;

		this.selfComp.nickname.text = ShowData.nickname;

		this.selfComp.flag.source = "rank_flag_other_png";
		this.selfComp.value.text = "" + ShowData.collected;
		this.updateSelfRank();
		this.list.dataProvider = new eui.ArrayCollection(RankData.rankData);
		this.list.itemRenderer = NewRankListRenderer;
		this.list.selectedIndex = 0;
		this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelected, this);

		this.model.x = ((this.group.width - 218) - this.model.width * this.model.scaleX) / 2;

		if (RankData.rankData.length == 0) {
			this.list.selectedIndex = -1;
			this.model.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);

			if (this.emptyTip) {
				this.emptyTip.visible = true;
			} else {
				this.emptyTip = new eui.Label("-* 暂无数据 *-");
				this.emptyTip.textColor = 0x66669A;
				this.emptyTip.size = 24;
				this.emptyTip.x = (this.scroller.width - this.emptyTip.width) / 2;
				this.emptyTip.y = (this.scroller.height - this.emptyTip.height) / 2;
				this.scroller.addChild(this.emptyTip);
			}
		} else {
			this.list.selectedIndex = 0;
			// this.model.dress(RankData.rankData[0]["ondress"], RankData.rankData[0]["ornaments"]);
			this.model.dressClothesOfSuit(RankData.rankData[0]["ondress"], RankData.rankData[0]["ornaments"]);

			if (this.emptyTip) {
				this.emptyTip.visible = false;
			}
		}

		this.curSelected = this.list.selectedIndex;

		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goBack, this);
		this.btn_note.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNote, this);

		this.btn_dp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonDp, this);
		this.btn_pk.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonPk, this);

		this.selfComp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelf, this);

		this.btn_dp.touchEnabled = false;

		CustomEventMgr.addEventListener("803", this.result_of_803, this);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("803", this.result_of_803, this);

		this.list.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelected, this);

		this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goBack, this);
		this.btn_note.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onNote, this);

		this.btn_dp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonDp, this);
		this.btn_pk.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonPk, this);

		this.selfComp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelf, this);
	}

	private onButtonDp() {
		this.btn_dp.touchEnabled = false;
		this.btn_pk.touchEnabled = true;
		this.btn_dp.source = "rank_dp_sel_png";
		this.btn_pk.source = "rank_jj_nor_png";
		isShowCompetition = false;
		this.exchangeRank();
	}

	private onButtonPk() {
		this.btn_pk.touchEnabled = false;
		this.btn_dp.touchEnabled = true;
		this.btn_dp.source = "rank_dp_nor_png";
		this.btn_pk.source = "rank_jj_sel_png";
		isShowCompetition = true;
		this.exchangeRank();
	}

	private exchangeRank() {
		if (isShowCompetition) {
			// isShowCompetition = true;
			this.selfComp.flag.source = "rank_flag_other_png";
			this.selfComp.value.text = "" + CompetitionData.self.score;
			this.updateSelfRank();
			this.list.dataProvider = new eui.ArrayCollection(CompetitionData.ranklist);

			if (CompetitionData.ranklist.length == 0) {
				this.list.selectedIndex = -1;
				this.model.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);

				if (this.emptyTip) {
					this.emptyTip.visible = true;
				} else {
					this.emptyTip = new eui.Label("-* 暂无数据 *-");
					this.emptyTip.textColor = 0x66669A;
					this.emptyTip.size = 24;
					this.emptyTip.x = (this.scroller.width - this.emptyTip.width) / 2;
					this.emptyTip.y = (this.scroller.height - this.emptyTip.height) / 2;
					this.scroller.addChild(this.emptyTip);
				}
			} else {
				this.list.selectedIndex = 0;
				// this.model.dress(CompetitionData.ranklist[0]["ondress"], CompetitionData.ranklist[0]["ornaments"]);
				this.model.dressClothesOfSuit(CompetitionData.ranklist[0]["ondress"], CompetitionData.ranklist[0]["ornaments"]);

				if (this.emptyTip) {
					this.emptyTip.visible = false;
				}
			}

		} else {
			// isShowCompetition = false;
			this.selfComp.flag.source = "rank_flag_other_png";
			this.selfComp.value.text = "" + ShowData.collected;
			this.updateSelfRank();
			this.list.dataProvider = new eui.ArrayCollection(RankData.rankData);

			if (RankData.rankData.length == 0) {
				this.list.selectedIndex = -1;
				this.model.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);

				if (this.emptyTip) {
					this.emptyTip.visible = true;
				} else {
					this.emptyTip = new eui.Label("-* 暂无数据 *-");
					this.emptyTip.textColor = 0x66669A;
					this.emptyTip.size = 24;
					this.emptyTip.x = (this.scroller.width - this.emptyTip.width) / 2;
					this.emptyTip.y = (this.scroller.height - this.emptyTip.height) / 2;
					this.scroller.addChild(this.emptyTip);
				}
			} else {
				this.list.selectedIndex = 0;
				// this.model.dress(RankData.rankData[0]["ondress"], RankData.rankData[0]["ornaments"]);
				this.model.dressClothesOfSuit(RankData.rankData[0]["ondress"], RankData.rankData[0]["ornaments"]);

				if (this.emptyTip) {
					this.emptyTip.visible = false;
				}
			}
		}

		this.curSelected = this.list.selectedIndex;
		console.log("curSelected = " + this.curSelected);

		this.playAnimation();
	}

	private updateSelfRank() {
		if (isShowCompetition) {
			if (CompetitionData.selfRank == -1) {      //未上榜
				this.selfComp.num_mid.source = "weishangbang_png";
				this.selfComp.num_mid.visible = true;
				this.selfComp.num_lef.visible = false;
				this.selfComp.num_rig.visible = false;
			} else {
				if (CompetitionData.selfRank < 10) {
					this.selfComp.num_mid.source = "num_" + CompetitionData.selfRank + "_png";
					this.selfComp.num_mid.visible = true;
					this.selfComp.num_lef.visible = false;
					this.selfComp.num_rig.visible = false;
				} else {
					this.selfComp.num_lef.source = "num_" + Math.floor((CompetitionData.selfRank) / 10) + "_png";
					this.selfComp.num_lef.visible = true;
					this.selfComp.num_rig.source = "num_" + (CompetitionData.selfRank) % 10 + "_png";
					this.selfComp.num_rig.visible = true;
					this.selfComp.num_mid.visible = false;
				}
			}
		} else {
			var isOnRank: boolean = false;
			var length = RankData.rankData.length;
			var selfRank: number;
			for (var i = 0; i < length; i++) {
				if (RankData.rankData[i]["id"] == LoginData.sid) {
					isOnRank = true;
					selfRank = i + 1;
					break;
				}
			}

			if (isOnRank) {
				if (selfRank < 10) {
					this.selfComp.num_mid.source = "num_" + selfRank + "_png";
					this.selfComp.num_mid.visible = true;
					this.selfComp.num_lef.visible = false;
					this.selfComp.num_rig.visible = false;
				} else {
					this.selfComp.num_lef.source = "num_" + Math.floor((selfRank) / 10) + "_png";
					this.selfComp.num_lef.visible = true;
					this.selfComp.num_rig.source = "num_" + (selfRank) % 10 + "_png";
					this.selfComp.num_rig.visible = true;
					this.selfComp.num_mid.visible = false;
				}
			} else {
				this.selfComp.num_mid.source = "weishangbang_png";
				this.selfComp.num_mid.visible = true;
				this.selfComp.num_lef.visible = false;
				this.selfComp.num_rig.visible = false;
			}
		}
	}

	private onSelected(evt: eui.ItemTapEvent) {
		egret.log("on selected");
		if (this.curSelected != evt.itemIndex) {
			this.curSelected = evt.itemIndex;
			this.model.x = -this.group.width;
			// this.model.dress(evt.item.ondress, evt.item.ornaments);
			this.model.dressClothesOfSuit(evt.item.ondress, evt.item.ornaments);
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
				// var id: string = RankData.rankData[self.list.selectedIndex]["id"];
				var id: string = self.list.dataProvider["source"][self.list.selectedIndex]["id"];
				if (id == LoginData.sid) {
					Prompt.showPrompt(egret.MainContext.instance.stage, "不可以给自己发纸条哦");
				} else {
					// var nickname: string = RankData.rankData[self.list.selectedIndex]["nickname"];
					var nickname: string = self.list.dataProvider["source"][self.list.selectedIndex]["nickname"];
					var notePanel = new NotePanelComp(id, nickname);
					self.addChild(notePanel);
				}
			}
		});
	}

	private goBack() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_back, function () {
			if (RankData.enterType == "pk") {
				SceneMgr.gotoPK();
			} else if(RankData.enterType == "social") {
				SceneMgr.gotoMainFriend();
			}
		});
	}

	private onSelf() {
		egret.log("on self comp");
		if (this.curSelected == -1) {

		} else {
			this.list.selectedIndex = -1;
			this.selfComp.currentState = "selected";
			// this.selfComp.touchEnabled = false;
			if (isShowCompetition) {
				this.model.dressClothesOfSuit(CompetitionData.self.ondress, CompetitionData.self.ornaments);
			} else {
				this.model.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);
			}

			this.playAnimation();
		}
		this.curSelected = this.list.selectedIndex;
	}

	private result_of_803(evt: egret.Event) {
		NetLoading.removeLoading();
		Prompt.showPrompt(egret.MainContext.instance.stage, "好友请求发送成功");
	}
}


class NewRankListRenderer extends eui.ItemRenderer {
	public bg: eui.Image;
	public nickname: eui.Label;
	public flag: eui.Image;
	public flag_lab: eui.Label;
	public value: eui.Label;
	public num_lef: eui.Image;
	public num_mid: eui.Image;
	public num_rig: eui.Image;

	private btn_add: eui.ToggleButton;

	public constructor() {
		super();

		this.skinName = "NewRankListRendererSkin";
	}

	protected createChildren() {
		super.createChildren();

		this.btn_add.addEventListener(eui.UIEvent.CHANGE, this.onChange, this);
	}

	protected dataChanged() {
		if (isShowCompetition) {
			this.flag.source = "rank_flag_other_png";
			this.flag_lab.text = "当前分数";
			this.value.text = this.data.score;
		} else {
			this.flag.source = "rank_flag_other_png";
			this.flag_lab.text = "服装收集";
			this.value.text = this.data.collected;
		}

		if (this.itemIndex == 0) {
			this.bg.source = "rank_item_bg_first_png";
		} else if (this.itemIndex == 1) {
			this.bg.source = "rank_item_bg_sed_png";
		} else if (this.itemIndex == 2) {
			this.bg.source = "rank_item_bg_thd_png";
		} else {
			this.bg.source = "rank_item_bg_other_png";
		}

		this.nickname.text = this.data.nickname;
		// this.value.text = this.data.collected;

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
			this.btn_add.currentState = "disabled";
			this.btn_add.touchEnabled = false;
		}
	}

	private onChange(evt: eui.UIEvent) {
		if(this.data.id == LoginData.sid) {
			Prompt.showPrompt(egret.MainContext.instance.stage, "不可以添加自己为好友！");
			return;
		}

		evt.target.currentState = "disabled";
		evt.target.touchEnabled = false;

		NetLoading.showLoading();
		var request: egret.URLRequest = HttpProtocolMgr.send_message_803(this.data.id, 1);
		HttpMgr.postRequest(request);
	}
}