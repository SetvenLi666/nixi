class PkLayerComp extends eui.Component {
	public group: eui.Group;

	public selfMask: eui.Image;
	public otherMask: eui.Image;

	public shower_self: Model;
	public shower_other: Model;
	public selfNickname: eui.Label;
	public selfCollected: eui.Label;
	public selfScore: eui.Label;
	public selfPhaseImg: eui.Image;
	public otherNickname: eui.Label;
	public otherCollected: eui.Label;
	public otherScore: eui.Label;
	public otherPhaseImg: eui.Image;

	public tag_1: eui.Image;
	public tag_2: eui.Image;
	public leftTime: eui.Label;

	public myRank: eui.Label;

	public left_circle: eui.Image;
	public right_circle: eui.Image;
	public starLight: eui.Image;
	public ant_pk: eui.Image;

	public btn_change: eui.Image;
	// public btn_changed: eui.Image;
	public btn_back: eui.Image;
	public startGroup: eui.Group;

	// public pkTimes: eui.Label;

	public costGroup: eui.Group;
	public startCost: eui.Label;
	public curTimes: eui.Label;

	public refreshComp: eui.Group;
	public refreshTimes: eui.Label;

	public plusLabel: eui.Label;
	public btn_buff: eui.Group;
	public buffComp: eui.Group;
	public btn_prepare: eui.Image;

	public listGroup: eui.Group;

	public constructor() {
		super();

		this.skinName = "PkLayerCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);

		this.group.width = Math.min(DisplayMgr.stageW, 852);

		ClothesData.setClothesCache(CompetitionData.self.ondress, CompetitionData.self.ornaments);
		this.shower_self.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);
		this.shower_other.visible = false;

		this.shower_self.mask = this.selfMask;
		this.shower_other.mask = this.otherMask;

		this.initView();
		this.startAllAnimation();

		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goback, this);
		this.btn_prepare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPrepare, this);
		this.btn_change.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeClothes, this);
		this.startGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeOver, this);
		this.btn_buff.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buffCallback, this);
		this.refreshComp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.refreshOpponent, this);
		this.listGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onListGroup, this);

		CustomEventMgr.addEventListener("827", this.result_of_827, this);
		CustomEventMgr.addEventListener("823", this.result_of_823, this);
		CustomEventMgr.addEventListener("821", this.result_of_821, this);
		CustomEventMgr.addEventListener("825", this.result_of_825, this);
		CustomEventMgr.addEventListener("400", this.result_of_400, this);
		CustomEventMgr.addEventListener("820", this.result_of_820, this);
		CustomEventMgr.addEventListener("300", this.afterRankListData_300, this);
		CustomEventMgr.addEventListener("806", this.afterFriendListData_806, this);

		if(PlayerData.pkGuide == 1) {
			var pkguide = new PkGuidePanel();
			DisplayMgr.set2Center(pkguide);
			this.stage.addChild(pkguide);
			pkguide.currentState = "pkGuide_step_3";
			pkguide.playAnimation();
			CustomEventMgr.addEventListener("PkGuide_Step_4", this.onPrepare, this);
			CustomEventMgr.addEventListener("PkGuide_Step_6", this.changeClothes, this);
		}else if(PlayerData.pkGuide == 2) {
			var pkguide = new PkGuidePanel();
			DisplayMgr.set2Center(pkguide);
			this.stage.addChild(pkguide);
			pkguide.currentState = "pkGuide_step_7";
			pkguide.playAnimation();
			CustomEventMgr.addEventListener("PkGuide_Step_8", this.buffCallback, this);
			CustomEventMgr.addEventListener("PkGuide_Step_11", this.changeOver, this);
		}
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("827", this.result_of_827, this);
		CustomEventMgr.removeEventListener("823", this.result_of_823, this);
		CustomEventMgr.removeEventListener("821", this.result_of_821, this);
		CustomEventMgr.removeEventListener("825", this.result_of_825, this);
		CustomEventMgr.removeEventListener("400", this.result_of_400, this);
		CustomEventMgr.removeEventListener("820", this.result_of_820, this);
		CustomEventMgr.removeEventListener("300", this.afterRankListData_300, this);
		CustomEventMgr.removeEventListener("806", this.afterFriendListData_806, this);

		this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goback, this);
		this.btn_prepare.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPrepare, this);
		this.btn_change.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.changeClothes, this);
		this.startGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.changeOver, this);
		this.btn_buff.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.buffCallback, this);
		this.refreshComp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.refreshOpponent, this);
		this.listGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onListGroup, this);

		if(PlayerData.pkGuide == 1) {
			CustomEventMgr.removeEventListener("PkGuide_Step_4", this.onPrepare, this);
			CustomEventMgr.removeEventListener("PkGuide_Step_6", this.changeClothes, this);
		}else if(PlayerData.pkGuide == 2) {
			CustomEventMgr.removeEventListener("PkGuide_Step_8", this.buffCallback, this);
			CustomEventMgr.removeEventListener("PkGuide_Step_11", this.changeOver, this);
		}

		egret.Tween.removeAllTweens();
	}

	private initView() {
		//当前排名
		if (CompetitionData.selfRank == -1) {//未上榜
			this.myRank.text = "未上榜";
		} else {
			this.myRank.text = "" + CompetitionData.selfRank;
		}

		if(CompetitionData.isPrepare) {
			this.updateView();
		}

		//自己
		this.selfNickname.text = ShowData.nickname;
		this.selfCollected.text = "" + ShowData.collected;
		this.selfScore.text = "" + CompetitionData.self.score;
		this.selfPhaseImg.source = "base_lv" + PlayerData.phase + "_png";

		//主题
		if (CompetitionData.theme.tags.length > 0) {
			this.tag_1.source = "clothes_tags_json.tag_" + CompetitionData.theme.tags[0];
			this.tag_2.source = "clothes_tags_json.tag_" + CompetitionData.theme.tags[1];
		}

		//开始
		// if (CompetitionData.self.startTimes < CompetitionData.theme.startFreeCount) {
		// 	this.pkTimes.text = CompetitionData.self.startTimes + "/" + CompetitionData.theme.startFreeCount;
		// } else {
		// 	this.pkTimes.text = "" + CompetitionData.self.startCost;
		// 	var goldSpr = new eui.Image("pk_gold_png");
		// 	goldSpr.scaleX = 0.8;
		// 	goldSpr.scaleY = 0.8;
		// 	goldSpr.x = this.startComp.width / 2 + this.pkTimes.width / 2 + 5;
		// 	goldSpr.y = 62;
		// 	this.startComp.addChild(goldSpr);
		// }

		//结束时间
		this.leftTime.text = "" + (CompetitionData.theme.day + 1);
	}

	private startAllAnimation() {
		//星
		var tw_star = egret.Tween.get(this.starLight, { loop: true });
		tw_star.to({ rotation: 360 }, 7000);

		var tw_pk = egret.Tween.get(this.ant_pk, { loop: true });
		tw_pk.to({ scaleX: 1.1, scaleY: 1.1 }, 300)
			.wait(200)
			.to({ scaleX: 1, scaleY: 1 }, 300);

		//花边
		var tw_left_circle = egret.Tween.get(this.left_circle, { loop: true });
		tw_left_circle.to({ rotation: 360 }, 25000);

		var tw_right_circle = egret.Tween.get(this.right_circle, { loop: true });
		tw_right_circle.to({ rotation: -360 }, 25000);
	}

	private onListGroup() {
		DisplayMgr.buttonScale(this.listGroup, function() {
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.competition_info_820(!CompetitionData.hasInitRankInfo());
			HttpMgr.postRequest(request);
		});
	}

	private onPrepare() {
		var self = this;
		DisplayMgr.buttonScale(this.startGroup, function () {
			if (CompetitionData.self.startTimes >= CompetitionData.theme.startLimit) {
				Prompt.showPrompt(self.stage, "今日PK次数已达上限!");
			} else {
				NetLoading.showLoading();
				var request = HttpProtocolMgr.competition_prepare_827();
				HttpMgr.postRequest(request);
			}
		});
	}

	private changeClothes() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_change, function () {
			if (ClothesData.hasFetchedUserClohtes()) {
				self.result_of_400(null);
			}
			else {
				NetLoading.showLoading();
				var request: egret.URLRequest = HttpProtocolMgr.fetchOwnClothesData_400();
				HttpMgr.postRequest(request);
			}
		});
	}

	private result_of_400(evt: egret.Event) {
		NetLoading.removeLoading();
		SceneMgr.gotoDressScene("pk", CompetitionData.theme.tags[0], CompetitionData.theme.tags[1], null);
	}

	private changeOver() {
		//开始pk，进入pk场景
		var self = this;
		DisplayMgr.buttonScale(this.startGroup, function () {
			if (CompetitionData.self.startTimes >= CompetitionData.theme.startLimit) {
				Prompt.showPrompt(self.stage, "今日PK次数已达上限!");
			} else {
				NetLoading.showLoading();
				var request = HttpProtocolMgr.competition_start_825();
				HttpMgr.postRequest(request);
			}
		});
	}

	private result_of_820(evt: egret.Event) {
		var request: egret.URLRequest = HttpProtocolMgr.rankListData_300();
		HttpMgr.postRequest(request);
	}

	private afterRankListData_300(evt: egret.Event) {
		var request: egret.URLRequest = HttpProtocolMgr.friendListData_806();
		HttpMgr.postRequest(request);
	}

	private afterFriendListData_806(evt: egret.Event) {
		NetLoading.removeLoading();
		ClothesData.setClothesCache(ShowData.dresses, ShowData.ornaments);
		RankData.enterType = "pk";
		SceneMgr.gotoRank();
	}

	private result_of_825() { //开始
		NetLoading.removeLoading();
		CompetitionData.isPrepare = false;
		SceneMgr.replaceScene(new PkAnimScene);
	}

	private buffCallback() {
		DisplayMgr.buttonScale(this.btn_buff, function () {
			NetLoading.showLoading();
			var request = HttpProtocolMgr.competition_bless_823();
			HttpMgr.postRequest(request);
		});
	}

	private refreshOpponent() {
		var self = this;
		DisplayMgr.buttonScale(this.refreshComp, function () {
			NetLoading.showLoading();
			self.shower_other.visible = false;
			var request = HttpProtocolMgr.competition_search_opponent_821();
			HttpMgr.postRequest(request);
		});
	}

	private result_of_821() { // 换一个
		NetLoading.removeLoading();
		this.shower_other.takeOffAllClothes();
		this.updateOtherInfo();
		this.updateRefreshComp();

		CustomEventMgr.dispatchEventWith("Update Player Info", false);
	}

	private result_of_823() { //祝福
		NetLoading.removeLoading();
		if (CompetitionData.self.buffId == 0) {
			this.plusLabel.text = "无";
		} else {
			this.plusLabel.text = CompetitionData.self.buffDesc;
		}
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
	}

	private result_of_827() { // 换好
		NetLoading.removeLoading();
		CompetitionData.isPrepare = true;
		this.updateView();
	}

	private updateView() {
		this.btn_prepare.visible = false;

		this.updateOtherInfo();

		if (CompetitionData.self.buffId != 0) {
			this.plusLabel.text = CompetitionData.self.buffDesc;
		} else {
			this.plusLabel.text = "无";
		}

		this.refreshComp.visible = true;
		this.updateRefreshComp();

		this.btn_change.visible = true;

		this.startGroup.visible = true;
		this.curTimes.text = CompetitionData.self.startTimes + "/10";

		if(CompetitionData.self.startCost > 0) {
			this.startCost.text = CompetitionData.self.startCost + "";
			this.costGroup.visible = true;
		}else {
			this.costGroup.visible = false;
		}

		this.btn_buff.visible = true;
		this.buffComp.visible = true;
	}

	private updateOtherInfo() {
		// this.shower_other.dress(CompetitionData.opponent.ondress, CompetitionData.opponent.ornaments);
		this.shower_other.dressClothesOfSuit(CompetitionData.opponent.ondress, CompetitionData.opponent.ornaments);
		this.shower_other.visible = true;

		this.otherNickname.text = CompetitionData.opponent.nickname;
		this.otherCollected.text = "" + CompetitionData.opponent.collected;
		this.otherScore.text = "" + CompetitionData.opponent.score;
		// this.otherPhaseImg.source = "";
	}

	private updateRefreshComp() {
		var searchTimes = CompetitionData.self.searchTimes;
		if (searchTimes < CompetitionData.theme.searchFreeCount) {
			this.refreshTimes.text = searchTimes + "/" + CompetitionData.theme.searchFreeCount;
		} else {
			this.refreshTimes.text = "" + CompetitionData.self.searchCost;
			if (this.refreshComp.getChildByName("gold")) {
				var child = this.refreshComp.getChildByName("gold");
				child.x = this.refreshComp.width / 2 + this.refreshTimes.width / 2 + 5;
			} else {
				var goldSpr = new eui.Image("base_diam_png");
				goldSpr.name = "gold";
				goldSpr.x = this.refreshComp.width / 2 + this.refreshTimes.width / 2 + 5;
				goldSpr.y = 22;
				goldSpr.scaleX = 0.5;
				goldSpr.scaleY = 0.5;
				this.refreshComp.addChild(goldSpr);
			}
		}
	}

	private goback() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_back, function () {
			ClothesData.setClothesCache(ShowData.dresses, ShowData.ornaments);
			SceneMgr.gotoMainScene();
		});
	}

}