class GuidePanel extends eui.Component {
	public group: eui.Group;
	public role: eui.Image;
	public tip: eui.Component;
	public cursor: eui.Component;
	public curGuideStep: number;
	private guideData: {}[];
	private infoArr: {}[];
	private index: number = 0;
	private clearArr: number[] = [];
	private isPause: boolean = false;
	// private isTyperFinished: boolean = false;

	public constructor() {
		super();

		this.skinName = "GuideSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);

		this.cursor.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCursorCallback, this);

		CustomEventMgr.addEventListener("CLOSE_GUIDE_PANEL", this.closePanel, this);

		this.guideData = RES.getRes("guide_json");
		this.curGuideStep = PlayerData.guide;
		this.currentState = "step_" + this.curGuideStep;

		if (PlayerData.guide == 2 || PlayerData.guide == 5 || PlayerData.guide == 10) {
			if (GuideData.isMain) {
				this.currentState = "step_100";
				this.isPause = true;
				egret.setTimeout(function () {
					this.cursor.visible = true;
					this.playAction();
				}, this, 1000);
				// this.cursor.visible = true;
				// this.isPause = true;
				// this.playAction();
				return;
			}
		}

		if (PlayerData.guide == 99 || PlayerData.guide == 130) {
			this.currentState = "step_" + PlayerData.guide;
			this.isPause = true;
			egret.setTimeout(function () {
				this.cursor.visible = true;
				this.playAction();
			}, this, 1000);
			// this.cursor.visible = true;
			// this.playAction();
			return;
		}

		this.infoArr = this.guideData[this.curGuideStep - 1]["info"];
		this.role.source = this.infoArr[0]["role_png"];

		if (this.infoArr[0]["isClick"]) {
			this.isPause = true;
			egret.setTimeout(function () {
				this.cursor.visible = true;
				this.playAction();
			}, this, 1000);
			// this.cursor.visible = true;
			// this.playAction();
		}

		this.typerEffect();
	}

	private onClick() {
		if (PlayerData.guide == 8 && this.index == 2) {
			this.closePanel();
			SceneMgr.gotoMainScene();
			return;
		}

		if (PlayerData.guide == 14 && this.index == 0) {
			this.closePanel();
			return;
		}

		if(this.isPause) {
			return;
		}else {
			this.index++;
		}

		// if (this.isPause) {
		// 	if(this.isTyperFinished) {
		// 		// this.isTyperFinished = false;
		// 	}else {
		// 		var len = this.clearArr.length;
		// 		for (var i = len - 1; i >= 0; i--) {
		// 			egret.clearTimeout(this.clearArr[i]);
		// 			this.clearArr.splice(i, 1);
		// 		}
		// 		this.tip["content"].text = this.infoArr[this.index]["text"];
		// 		if (this.curGuideStep == 1 && this.index == 0) {
		// 			this.tip["content"].text = "欢迎(" + ShowData.nickname + ")来到女总的世界.\n我是剧里的后期编辑小妮."
		// 		}
		// 	}
		// 	return;
		// } else {
		// 	if (this.isTyperFinished) {
		// 		this.index++;
		// 		this.isTyperFinished = false;
		// 	} else {
		// 		var len = this.clearArr.length;
		// 		for (var i = len - 1; i >= 0; i--) {
		// 			egret.clearTimeout(this.clearArr[i]);
		// 			this.clearArr.splice(i, 1);
		// 		}
		// 		this.tip["content"].text = this.infoArr[this.index]["text"];
		// 		if (this.curGuideStep == 1 && this.index == 0) {
		// 			this.tip["content"].text = "欢迎(" + ShowData.nickname + ")来到女总的世界.\n我是剧里的后期编辑小妮."
		// 		}
		// 		this.isTyperFinished = true;
		// 		return;
		// 	}
		// 	// this.index++;
		// }

		if (this.infoArr[this.index]["isClick"]) {
			this.isPause = true;
			this.cursor.visible = true;
			this.playAction();
		}

		var len = this.clearArr.length;
		for (var i = len - 1; i >= 0; i--) {
			egret.clearTimeout(this.clearArr[i]);
			this.clearArr.splice(i, 1);
		}
		this.tip["content"].text = "";
		this.typerEffect();

		if (this.infoArr[this.index]["role_png"]) {
			this.role.source = this.infoArr[this.index]["role_png"];
		}

		if (this.curGuideStep == 1 && this.index == 1) {
			var tw_1 = egret.Tween.get(this["barrage_1"]);
			tw_1.to({ x: this.group.width + 50 }, 5500);
			var tw_2 = egret.Tween.get(this["barrage_2"]);
			tw_2.to({ x: this.group.width + 50 }, 7000);
			var tw_3 = egret.Tween.get(this["barrage_3"]);
			tw_3.to({ x: this.group.width + 50 }, 6000);
			var tw_4 = egret.Tween.get(this["barrage_4"]);
			tw_4.to({ x: this.group.width + 50 }, 6500);
		}
	}

	private playAction() {
		egret.Tween.removeTweens(this.cursor["icon"]);
		egret.Tween.removeTweens(this.cursor["circle"]);

		var tw_icon = egret.Tween.get(this.cursor["icon"], { loop: true });
		tw_icon.to({ x: 67, y: 79 }, 250)
			.call(function () {
				var tw_circle = egret.Tween.get(this.cursor["circle"]);
				tw_circle.to({ source: "guide_quan11_png", visible: true })
					.wait(100)
					.to({ source: "guide_quan12_png" })
					.wait(100)
					.to({ source: "guide_quan13_png" })
					.wait(100)
					.to({ visible: false });
			}, this)
			.wait(300)
			// .to({ x: this.cursor.width - this.cursor["icon"].width, y: this.cursor.height - this.cursor["icon"].height }, 250)
			.to({ x: 91, y: 100 }, 250)
			.wait(300);

		// var tw_icon = egret.Tween.get(this.cursor["icon"], {loop: true});
		// tw_icon.to({x: 67, y: 79}, 250)
		// .to({x: this.cursor.width - this.cursor["icon"].width, y: this.cursor.height - this.cursor["icon"].height}, 250);

		// var tw_circle = egret.Tween.get(this.cursor["circle"], {loop: true});
		// tw_circle.to({source: "guide_quan11_png"})
		// .wait(100)
		// .to({source: "guide_quan12_png"})
		// .wait(100)
		// .to({source: "guide_quan13_png"})
		// .wait(100);
	}

	private typerEffect() {
		var self = this;
		var text: string = this.infoArr[this.index]["text"];
		if (this.curGuideStep == 1 && this.index == 0) {
			text = "欢迎(" + ShowData.nickname + ")来到女总的世界.\n我是剧里的后期编辑小妮."
		}
		var textArr: string[] = text.split("");
		var len = textArr.length;
		for (var i = 0; i < len; i++) {
			var key = egret.setTimeout(function () {
				// if (Number(this) == len - 1) {
				// 	self.isTyperFinished = true;
				// }
				self.tip["content"].appendText(textArr[Number(this)]);
			}, i, 150 * i);
			this.clearArr.push(key);
		}
	}

	private onCursorCallback() {
		if (this.curGuideStep == 1 || ((this.curGuideStep == 2 || this.curGuideStep == 5 || this.curGuideStep == 10) && GuideData.isMain) || this.curGuideStep == 8) {
			this.closePanel();
			CustomEventMgr.dispatchEventWith("GUIDE_STEP_1", false);
		} else if (this.curGuideStep == 2 || PlayerData.guide == 3) {
			CustomEventMgr.dispatchEventWith("GUIDE_STEP_2", false);
		} else if (this.curGuideStep == 4) {
			if (this.index == 1) {
				CustomEventMgr.dispatchEventWith("GUIDE_STEP_4_1", false);
				this.currentState = "step_4_2";
				this.isPause = false;
			} else if (this.index == 2) {
				CustomEventMgr.dispatchEventWith("GUIDE_STEP_4_2", false);
				this.currentState = "step_4_3";
				this.index = -1;
			} else if (this.index == -1) {
				CustomEventMgr.dispatchEventWith("GUIDE_STEP_4_3", false);
				this.currentState = "step_4_4";
				this.index = -2;
			} else if (this.index == -2) {
				CustomEventMgr.dispatchEventWith("GUIDE_STEP_4_4", false);
				this.currentState = "step_4_5";
				this.index = 2;
				this.isPause = false;
			} else if (this.index == 3) {
				CustomEventMgr.dispatchEventWith("GUIDE_STEP_4_5", false);
			}
		} else if (this.curGuideStep == 10) {
			CustomEventMgr.dispatchEventWith("GUIDE_STEP_10", false);
		} else if (this.curGuideStep == 5) {
			CustomEventMgr.dispatchEventWith("GUIDE_STEP_5", false);
		} else if (this.curGuideStep == 11) {
			CustomEventMgr.dispatchEventWith("GUIDE_STEP_11", false);
		} else if (this.curGuideStep == 6) {
			if (this.index == 0) {
				CustomEventMgr.dispatchEventWith("GUIDE_STEP_6", false);
				this.currentState = "step_6_2";
				this.isPause = false;
			} else if (this.index == 1) {
				CustomEventMgr.dispatchEventWith("GUIDE_STEP_6_2", false);
			}

		} else if (this.curGuideStep == 12) {
			if (this.index == 0) {
				CustomEventMgr.dispatchEventWith("GUIDE_STEP_12", false)
				this.currentState = "step_12_2";
				this.index = 1;
			} else if (this.index == 1) {
				CustomEventMgr.dispatchEventWith("GUIDE_STEP_12_2", false);
				this.cursor.visible = false;
				this.isPause = false;
				this.index = 0;
			}
		} else if (this.curGuideStep == 9) {
			CustomEventMgr.dispatchEventWith("GUIDE_STEP_9", false);
		} else if (this.curGuideStep == 99) {
			CustomEventMgr.dispatchEventWith("GUIDE_STEP_99", false);
		} else if (this.curGuideStep == 13) {
			CustomEventMgr.dispatchEventWith("GUIDE_STEP_13", false);
			this.closePanel();
		} else if (this.curGuideStep == 130) {
			CustomEventMgr.dispatchEventWith("GUIDE_STEP_130", false);
			this.closePanel();
		}
	}

	private closePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}