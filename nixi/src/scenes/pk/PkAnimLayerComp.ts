class PkAnimLayerComp extends eui.Component {
	public group: eui.Group;

	public selfGroup: eui.Group;
	public otherGroup: eui.Group;

	public selfShower: Model;
	public otherShower: Model;
	public selfMask: eui.Rect;
	public otherMask: eui.Rect;
	public grayRect: eui.Rect;
	public selfNickname: eui.Label;
	public otherNickname: eui.Label;
	public selfScore: eui.Label;
	public otherScore: eui.Label;

	public balanceComp: eui.Group;
	public light: eui.Image;
	public titleImage: eui.Image;

	public mycircleComp: eui.Group;
	public mycircle_1: eui.Image;
	public myitemScore: eui.Label;

	public othercircleComp: eui.Group;
	public othercircle_1: eui.Image;
	public otheritemScore: eui.Label;

	public myBuff: eui.Label;
	public otherBuff: eui.Label;

	private mytotalScore: number = 0;
	private othertotalScore: number = 0;

	public btn_receive: eui.Component;

	public constructor() {
		super();

		this.skinName = "PkAnimLayerSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.initView();
		this.btn_receive.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnReceive, this);
		CustomEventMgr.addEventListener("Update PK View", this.updateView, this);
		CustomEventMgr.addEventListener("Update Self Score", this.updateSelfScore, this);
		CustomEventMgr.addEventListener("Update Other Score", this.updateOtherScore, this);

		CustomEventMgr.addEventListener("827", this.result_of_827, this);

		var self = this;
		egret.setTimeout(function () {
			self.playAnimation();
		}, this, 800);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("Update PK View", this.updateView, this);
		CustomEventMgr.removeEventListener("Update Self Score", this.updateSelfScore, this);
		CustomEventMgr.removeEventListener("Update Other Score", this.updateOtherScore, this);

		CustomEventMgr.removeEventListener("827", this.result_of_827, this);

		this.btn_receive.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnReceive, this);

		egret.Tween.removeAllTweens();
	}

	private initView() {
		this.selfNickname.text = ShowData.nickname;
		this.otherNickname.text = CompetitionData.opponent.nickname;
		this.selfScore.text = "0";
		this.otherScore.text = "0";

		if (CompetitionData.self.buffedId == 0) {
			this.myBuff.text = "无";
		} else {
			this.myBuff.text = CompetitionData.self.buffedDesc;
		}

		if (CompetitionData.opponent.buffedId == 0) {
			this.otherBuff.text = "无";
		} else {
			this.otherBuff.text = CompetitionData.opponent.buffedDesc;
		}

		this.selfShower.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);
		this.otherShower.dressClothesOfSuit(CompetitionData.opponent.ondress, CompetitionData.opponent.ornaments);

		// this.selfShower.mask = this.selfMask;
		// this.otherShower.mask = this.otherMask;
		this.selfGroup.mask = this.selfMask;
		this.otherGroup.mask = this.otherMask;

		var tw_light = egret.Tween.get(this.light, { loop: true });
		tw_light.to({ rotation: 360 }, 25000);
	}

	private onBtnReceive() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_receive, function () {
			Prompt.showPrompt(self.stage, "领取成功~");
			egret.setTimeout(function () {
				// SceneMgr.gotoPK();

				NetLoading.showLoading();
				var request = HttpProtocolMgr.competition_prepare_827();
				HttpMgr.postRequest(request);
			}, self, 800);
		});
	}

	private result_of_827() {
		NetLoading.removeLoading();
		SceneMgr.gotoPK();
	}

	private playAnimation() {

		var self = this;
		var result: number;
		var bool_1: boolean = false;
		var bool_2: boolean = false;
		for (var i = 1; i <= 4; i++) {
			egret.setTimeout(function () {
				var index = Number(this);
				bool_1 = false;
				bool_2 = false;
				var itemScore1: number;
				var itemScore2: number;
				switch (index) {
					case 1: //搭配
						self.mycircle_1.source = "pk_circle_dp_png";
						self.myitemScore.text = "+" + CompetitionData.self.match;
						itemScore1 = CompetitionData.self.match;

						self.othercircle_1.source = "pk_circle_dp_png";
						self.otheritemScore.text = "+" + CompetitionData.opponent.match;
						itemScore2 = CompetitionData.opponent.match;

						if (CompetitionData.self.match > CompetitionData.opponent.match) {
							result = 1;//胜
						} else if (CompetitionData.self.match < CompetitionData.opponent.match) {
							result = 2;//败
						} else {
							result = 3;//平局
						}
						break;
					case 2: //人气
						self.mycircle_1.source = "pk_circle_rq_png";
						self.myitemScore.text = "+" + CompetitionData.self.puplar;
						itemScore1 = CompetitionData.self.puplar;

						self.othercircle_1.source = "pk_circle_rq_png";
						self.otheritemScore.text = "+" + CompetitionData.opponent.puplar;
						itemScore2 = CompetitionData.opponent.puplar;

						if (CompetitionData.self.puplar > CompetitionData.opponent.puplar) {
							result = 1;//胜
						} else if (CompetitionData.self.puplar < CompetitionData.opponent.puplar) {
							result = 2;//败
						} else {
							result = 3;//平局
						}
						break;
					case 3: //魅力
						self.mycircle_1.source = "pk_circle_ml_png";
						self.myitemScore.text = "+" + CompetitionData.self.charm;
						itemScore1 = CompetitionData.self.charm;

						self.othercircle_1.source = "pk_circle_ml_png";
						self.otheritemScore.text = "+" + CompetitionData.opponent.charm;
						itemScore2 = CompetitionData.opponent.charm;

						if (CompetitionData.self.charm > CompetitionData.opponent.charm) {
							result = 1;//胜
						} else if (CompetitionData.self.charm < CompetitionData.opponent.charm) {
							result = 2;//败
						} else {
							result = 3;//平局
						}
						break;
					case 4: //幸运
						self.mycircle_1.source = "pk_circle_xy_png";
						self.myitemScore.text = "+" + CompetitionData.self.luck;
						itemScore1 = CompetitionData.self.luck;

						self.othercircle_1.source = "pk_circle_xy_png";
						self.otheritemScore.text = "+" + CompetitionData.opponent.luck;
						itemScore2 = CompetitionData.opponent.luck;

						if (CompetitionData.self.luck > CompetitionData.opponent.luck) {
							result = 1;//胜
						} else if (CompetitionData.self.luck < CompetitionData.opponent.luck) {
							result = 2;//败
						} else {
							result = 3;//平局
						}
						break;
				}

				var tw_1 = egret.Tween.get(self.mycircleComp);
				var tw_2 = egret.Tween.get(self.othercircleComp);

				var duration1: number;
				var duration2: number;

				if (result == 1) {
					duration1 = 800;
					duration2 = 1000;
				} else if (result == 2) {
					duration1 = 1000;
					duration2 = 800;
				} else {
					duration1 = duration2 = 1000;
				}

				tw_1.to({ y: DisplayMgr.stageH / 2 - self.mycircleComp.height / 2, alpha: 1 }, 800, egret.Ease.backOut)
					.call(function () {
						self.updateSelfScore(self.mytotalScore + itemScore1);
					})
					.wait(500)
					.to({ y: -self.mycircleComp.height, alpha: 0 }, duration1, egret.Ease.sineIn)
					.call(function () {
						self.mycircleComp.y = DisplayMgr.stageH;
						bool_1 = true;
						if (bool_1 && bool_2 && index == 4) {
							self.displayResultPanel();
						}
					});

				tw_2.to({ y: DisplayMgr.stageH / 2 - self.othercircleComp.height / 2, alpha: 1 }, 800, egret.Ease.backOut)
					.call(function () {
						self.updateOtherScore(self.othertotalScore + itemScore2);
					})
					.wait(500)
					.to({ y: -self.othercircleComp.height, alpha: 0 }, duration2, egret.Ease.sineIn)
					.call(function () {
						self.othercircleComp.y = DisplayMgr.stageH;
						bool_2 = true;
						if (bool_1 && bool_2 && index == 4) {
							self.displayResultPanel();
						}
					});

			}, i, 2800 * (i - 1));
		}
	}

	private updateSelfScore(pram: any) {
		if (typeof pram == "number") {
			this.mytotalScore = pram;
		} else {
			this.mytotalScore = pram.data;
		}

		this.selfScore.text = "" + this.mytotalScore;
	}

	private updateOtherScore(pram: any) {
		if (typeof pram == "number") {
			this.othertotalScore = pram;
		} else {
			this.othertotalScore = pram.data;
		}

		this.otherScore.text = "" + this.othertotalScore;
	}

	private updateSelfTotalScore(evt: egret.Event) {
		this.mytotalScore = evt.data;
		this.selfScore.text = "" + this.mytotalScore;
	}


	private displayResultPanel() {
		var self = this;
		var tw = egret.Tween.get(this.balanceComp);
		var endY = this.balanceComp.y - 100;
		tw.to({ y: endY }, 300)
			.call(function () {
				self.titleImage.source = "pk_txt_balance_png";
				var panel = new PkResultPanel();
				panel.anchorOffsetX = panel.width / 2;
				panel.anchorOffsetY = panel.height / 2;
				panel.x = self.width / 2;
				panel.y = self.height / 2;
				panel.scaleX = 0;
				panel.scaleY = 0;
				self.addChild(panel);

				var tw_panel = egret.Tween.get(panel);
				tw_panel.to({ scaleX: 1, scaleY: 1 }, 500)
					.call(function () {
						panel.playAnimation();
					});
			});
	}

	private updateView(evt: egret.Event) {
		this.balanceComp.y = 344;
		this.btn_receive.currentState = "state_" + evt.data;
		this.btn_receive.visible = true;

		if (evt.data == 1) {
			this.titleImage.source = "pk_result_vct_png";
			// this.titleImage.horizontalCenter = -15;
			this.grayRect.horizontalCenter = 225;
			this.grayRect.visible = true;
		} else if (evt.data == 2) {
			this.titleImage.source = "pk_result_def_png";
			// this.titleImage.horizontalCenter = 15;
			this.grayRect.horizontalCenter = -225;
			this.grayRect.visible = true;
		} else {
			this.titleImage.source = "pk_result_pj_png";
		}
	}
}