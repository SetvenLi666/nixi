class PkResultPanel extends eui.Component {
	public group: eui.Group;
	public myMatch: eui.Label;
	public otherMatch: eui.Label;
	public myPuplar: eui.Label;
	public otherPuplar: eui.Label;
	public myCharm: eui.Label;
	public otherCharm: eui.Label;
	public myLuck: eui.Label;
	public otherLuck: eui.Label;
	public myTotal: eui.Label;
	public otherTotal: eui.Label;

	private isOk: boolean = true;
	private isAnimationOver: boolean = false;
	private bool_1: boolean = false;
	private bool_2: boolean = false;

	public constructor() {
		super();

		this.skinName = "PkResultPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.init();
	}

	private init() {
		this.myMatch.text = "" + CompetitionData.self.match;
		this.otherMatch.text = "" + CompetitionData.opponent.match;
		this.myPuplar.text = "" + CompetitionData.self.puplar;
		this.otherPuplar.text = "" + CompetitionData.opponent.puplar;
		this.myCharm.text = "" + CompetitionData.self.charm;
		this.otherCharm.text = "" + CompetitionData.opponent.charm;
		this.myLuck.text = "" + CompetitionData.self.luck;
		this.otherLuck.text = "" + CompetitionData.opponent.luck;

		//总分(加成之前)
		this.myTotal.text = "" + (CompetitionData.self.match + CompetitionData.self.puplar + CompetitionData.self.charm + CompetitionData.self.luck);

		this.otherTotal.text = "" + (CompetitionData.opponent.match + CompetitionData.opponent.puplar + CompetitionData.opponent.charm + CompetitionData.opponent.luck);
	}

	public playAnimation() {
		if (CompetitionData.self.buffedId == 0 && CompetitionData.opponent.buffedId == 0) {
			egret.setTimeout(function () {
				this.isAnimationOver = true;
				this.whoWillWin(this.isOk);
			}, this, 300);
		} else {
			if (CompetitionData.self.buffedId != 0) {
				var bufSpr1: egret.Bitmap = new egret.Bitmap(RES.getRes("pk_" + (CompetitionData.self.buffedId % 100) + "_png"));
				var y1: number;
				var item: eui.Label = null;
				switch (Math.floor(CompetitionData.self.buffedId / 100)) {
					case 1://搭配
						y1 = this.myMatch.y - bufSpr1.height / 2;
						item = this.myMatch;
						break;
					case 2://人气
						y1 = this.myPuplar.y - bufSpr1.height / 2;
						item = this.myPuplar;
						break;
					case 3://魅力
						y1 = this.myCharm.y - bufSpr1.height / 2;
						item = this.myCharm;
						break;
					case 4://运气
						y1 = this.myLuck.y - bufSpr1.height / 2;
						item = this.myLuck;
						break;
					case 5://总分
						y1 = this.myTotal.y - bufSpr1.height / 2;
						item = this.myTotal;
						break;
				}

				bufSpr1.anchorOffsetX = bufSpr1.width / 2;
				bufSpr1.anchorOffsetY = bufSpr1.height / 2;
				bufSpr1.scaleX = 0;
				bufSpr1.scaleY = 0;
				bufSpr1.x = this.group.width / 2 - 145;
				bufSpr1.y = y1;
				this.group.addChild(bufSpr1);
				this.bufAnimation(bufSpr1, item, CompetitionData.self.buffedId, 1);
			}

			if (CompetitionData.opponent.buffedId != 0) {
				var bufSpr2: egret.Bitmap = new egret.Bitmap(RES.getRes("pk_" + (CompetitionData.opponent.buffedId % 100) + "_png"));
				var y2: number;
				var item2: eui.Label = null;
				switch (Math.floor(CompetitionData.opponent.buffedId / 100)) {
					case 1:
						y2 = this.otherMatch.y - bufSpr2.height / 2;
						item2 = this.otherMatch;
						break;
					case 2:
						y2 = this.otherPuplar.y - bufSpr2.height / 2;
						item2 = this.otherPuplar;
						break;
					case 3:
						y2 = this.otherCharm.y - bufSpr2.height / 2;
						item2 = this.otherCharm;
						break;
					case 4:
						y2 = this.otherLuck.y - bufSpr2.height / 2;
						item2 = this.otherLuck;
						break;
					case 5:
						y2 = this.otherTotal.y - bufSpr2.height / 2;
						item2 = this.otherTotal;
						break;
				}
				bufSpr2.anchorOffsetX = bufSpr2.width / 2;
				bufSpr2.anchorOffsetY = bufSpr2.height / 2;
				bufSpr2.scaleX = 0;
				bufSpr2.scaleY = 0;
				bufSpr2.x = this.group.width / 2 + 145;
				bufSpr2.y = y2;
				this.group.addChild(bufSpr2);
				this.bufAnimation(bufSpr2, item2, CompetitionData.opponent.buffedId, 2);
			}
		}
	}

	private bufAnimation(disObj: egret.DisplayObject, item: eui.Label, buffId: number, type: number) {
		var self = this;
		var tw = egret.Tween.get(disObj);
		tw.to({ scaleX: 0.6, scaleY: 0.6 }, 500, egret.Ease.backOut)
			.call(function () {
				var tw_item = egret.Tween.get(item);
				tw_item.to({ alpha: 0 }, 300)
					.to({ text: "" + (Math.ceil(parseInt(item.text) * ((buffId % 100 + 100) / 100))) })
					.to({ alpha: 1 }, 300)
					.to({ alpha: 0 }, 300)
					.to({ alpha: 1 }, 300)
					.call(function () {
						if(type == 1) {
							if(Math.floor(CompetitionData.self.buffedId / 100) != 5) {
								var total = parseInt(self.myMatch.text) + parseInt(self.myPuplar.text) + parseInt(self.myCharm.text) + parseInt(self.myLuck.text);
								var tw_total = egret.Tween.get(self.myTotal);
								tw_total.to({ alpha: 0 }, 300)
									.to({ text: total })
									.to({ alpha: 1 }, 300)
									.to({ alpha: 0 }, 300)
									.to({ alpha: 1 }, 300)
									.call(function () {
										self.isAnimationOver = true;
										CustomEventMgr.dispatchEventWith("Update Self Score", false, total);
										self.whoWillWin(self.isOk);
									});
							}else {
								self.bool_1 = true;
								CustomEventMgr.dispatchEventWith("Update Self Score", false, parseInt(self.myTotal.text));
								if(self.bool_1 && self.bool_2) {
									self.isAnimationOver = true;
									self.whoWillWin(self.isOk);
								}else {
									if(CompetitionData.opponent.buffedId == 0) {
										self.isAnimationOver = true;
										self.whoWillWin(self.isOk);
									}else {
										self.whoWillWin(self.isOk);
									}
									
								}
							}
						}else {
							if(Math.floor(CompetitionData.opponent.buffedId / 100) != 5) {
								var total = parseInt(self.otherMatch.text) + parseInt(self.otherPuplar.text) + parseInt(self.otherCharm.text) + parseInt(self.otherLuck.text);
								var tw_total = egret.Tween.get(self.otherTotal);
								tw_total.to({ alpha: 0 }, 300)
									.to({ text: total })
									.to({ alpha: 1 }, 300)
									.to({ alpha: 0 }, 300)
									.to({ alpha: 1 }, 300)
									.call(function () {
										self.isAnimationOver = true;
										CustomEventMgr.dispatchEventWith("Update Other Score", false, total);
										self.whoWillWin(self.isOk);
									});
							}else {
								self.bool_2 = true;
								CustomEventMgr.dispatchEventWith("Update Other Score", false, parseInt(self.otherTotal.text));
								if(self.bool_1 && self.bool_2) {
									self.isAnimationOver = true;
									self.whoWillWin(self.isOk);
								}else {
									if(CompetitionData.self.buffedId == 0) {
										self.isAnimationOver = true;
										self.whoWillWin(self.isOk);
									}else {
										self.whoWillWin(self.isOk);
									}
								}
							}
						}
					});
			});
	}

	private whoWillWin(bool: boolean) {
		if(this.isAnimationOver && bool) {
			//可以结算
			this.isOk = false;
		}else {
			return;
		}

		var self = this;
		var crown = new egret.Bitmap(RES.getRes("pk_huangguan6_png"));
		crown.anchorOffsetX = crown.width / 2;
		crown.anchorOffsetY = crown.height / 2;
		crown.scaleX = 0;
		crown.scaleY = 0;
		var type: number;
		if (parseInt(this.myTotal.text) > parseInt(this.otherTotal.text)) {
			crown.x = this.group.width / 2 - 85;
			crown.y = this.myTotal.y - crown.height / 2 - 10;
			type = 1;
		} else if (parseInt(this.myTotal.text) < parseInt(this.otherTotal.text)) {
			crown.x = this.group.width / 2 + 85;
			crown.y = this.otherTotal.y - crown.height / 2 - 10;
			type = 2;
		} else {
			crown.x = this.group.width / 2;
			crown.y = this.myTotal.y - 10;
			type = 3;
		}
		this.group.addChild(crown);

		var tw = egret.Tween.get(crown);
		tw.to({ scaleX: 1, scaleY: 1 }, 500, egret.Ease.backOut)
			.wait(1500)
			.call(function () {
				CustomEventMgr.dispatchEventWith("Update PK View", false, type);
				self.closePanel();
				
			});
	}

	private closePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}