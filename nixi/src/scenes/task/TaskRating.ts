class TaskRating extends eui.Component implements eui.UIComponent {
	// Export --------------------------------------------------
	public constructor(result: {}) {
		super();

		this.result = result;
		this.rating = result["rating"];
		this.isLevelUp = result["levelup"];
		this.coin = result["coin"];
		this.clothes = result["clothes"];
		this.configData(this.rating, this.coin);
		this.skinName = "TaskRatingSkin";

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.whenEnter, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.whenExit, this);
	}

	// Event & Callback --------------------------------------------------
	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();

		var self = this;

		// Touch
		self.container.touchEnabled = false;

		self.titlePanel.touchEnabled = false;
		self.titlePanel.touchChildren = false;

		self.ratingPanel.touchEnabled = false;
		self.ratingPanel.touchChildren = false;

		self.bg.touchEnabled = false; // 后面开启
		self.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapped, this);

		// Display
		var mask = DisplayMgr.createSceneMask();
		self.addChild(mask);
		self.mask = mask;

		var baseComp = new BaseComp(ShowData.nickname, PlayerData.coin, PlayerData.diam, PlayerData.energy);
		this.addChildAt(baseComp, 1);

		if (this.isLevelUp) {
			var lastLv = PlayerData.phase - 1 < 1 ? 1 : PlayerData.phase - 1;
			baseComp.setPlayerLvIcon(lastLv);
		}

		self.width = DisplayMgr.stageW;
		var viewWidth = Math.min(DisplayMgr.stageW, ConstData.Conf.MaskWidth);
		self.container.width = viewWidth;

		self.ac_star.x = self.container.width / 2;
		self.ac_star.y = self.container.height / 2;
		self.ac_star.source = "task_ac_json.task_main_ac_star_1";
		self.pkq_bg.source = "task_ac_json.task_main_pkq_1";

		var tw_star = egret.Tween.get(self.ac_star, { loop: true });
		tw_star.to({ rotation: 360 }, 30000);

		self.model.dress(ShowData.dresses, ShowData.ornaments);
	}

	private whenEnter() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.whenEnter, this);

		var self = this;
		for (var i = 1; i <= self.rating; i++) {
			egret.setTimeout(function () {
				var star = <eui.Image>(self["star" + Number(this)]);
				var tw = egret.Tween.get(star);
				tw.to({ alpha: 1, scaleX: 2, scaleY: 2 }, 200)
					.to({ scaleX: 1, scaleY: 1, rotation: 360 }, 1000);
				if (Number(this) >= self.rating) {
					self.completeCallback();
				}
			}, i, 300 * i);
		}

		var data = TaskData.totalMissionData();
		var curtitleData = data[TaskData.curTaskID - 1];
		console.log(this.rewardComp);
		if (curtitleData["clothes"] != "0") {
			this.rewardComp.bg.source = "task_rat_iconBg_png";
			this.rewardComp.icon.source = "icon" + curtitleData["clothes"] + "_png";
			this.rewardComp.label.text = ClothesData.clothesTemplateData((Math.floor(parseInt(curtitleData["clothes"]) / 10000)).toString(), curtitleData["clothes"])["name"];
		} else if (curtitleData["diam_once"] != "0") {
			this.rewardComp.bg.source = "panel_ui_json.ac_icon_bg";
			this.rewardComp.icon.source = "panel_ui_json.ac_reward_diam";
			this.rewardComp.label.text = curtitleData["diam_once"];
		} else if (curtitleData["coin_once"]) {
			this.rewardComp.bg.source = "panel_ui_json.ac_icon_bg";
			this.rewardComp.icon.source = "panel_ui_json.ac_reward_coin";
			this.rewardComp.label.text = curtitleData["coin_once"];
		}


		CustomEventMgr.addEventListener("Check Next Panel", this.extraRewardPanel, this);
		CustomEventMgr.addEventListener("Check Scene", this.checkScene, this);
		CustomEventMgr.addEventListener("172", this.after_updatedata_172, this);

		if (PlayerData.guide == 5) {
			var guidePanel = new NewGuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.stage.addChild(guidePanel);
			guidePanel.currentState = "guide_step_5_10";
			guidePanel.playAnimation();
		}
	}

	private completeCallback() {
		if (PlayerData.guide == 5) {
			var guidePanel = new NewGuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.stage.addChild(guidePanel);
			guidePanel.playAnimation();
			CustomEventMgr.addEventListener("Guide_Step_5", this.onTapped, this);
		}

		var self = this;

		var data = TaskData.totalMissionData();
		var taskPhase = parseInt(data[TaskData.curTaskID - 1]["phase"]);//当前任务等级
		if (taskPhase == PlayerData.phase && PlayerData.phase != 5) {
			var popPanel = new RatingPopComp(taskPhase, this.rating);
			popPanel.x = (self.ratingPanel.width - popPanel.width) / 2;
			popPanel.y = -popPanel.height;
			popPanel.name = "popPanel";
			self.ratingPanel.addChild(popPanel);
		}

		self.ratingPanel.visible = true;
		var viewWidth = Math.min(DisplayMgr.stageW, ConstData.Conf.MaskWidth);

		self.isShowRewards = false;
		self.bg.touchEnabled = false;
		// self.discountText.visible = false;
		self.btnTake.visible = false;
		self.ratingPanel.cacheAsBitmap = true;
		egret.Tween.get(this.ratingPanel)
			.set({ scaleX: 1.5, scaleY: 1.5, y: self.height * 0.35 })
			.to({ scaleX: 1, scaleY: 1, y: self.height - 50 }, 1000, egret.Ease.backOut)
			.call(function () {
				// popPanel.playAnimation();
				// self.btnTake.visible = true;
				// self.bg.touchEnabled = true;
				if (taskPhase == PlayerData.phase && PlayerData.phase != 5) {
					self.starsAnimation();
				} else {
					self.btnTake.visible = true;
					self.bg.touchEnabled = true;
				}
			});
	}

	private starsAnimation() {
		var self = this;
		for (var i = 1; i <= self.rating; i++) {
			egret.setTimeout(function () {
				var star = new eui.Image();
				var p_star = <eui.Image>(self["star" + Number(this)]);
				star.source = p_star.source;
				star.anchorOffsetX = star.width / 2;
				star.anchorOffsetY = star.height / 2;
				star.x = p_star.localToGlobal().x;
				star.y = p_star.localToGlobal().y;
				self.addChild(star);
				var tw = egret.Tween.get(star);
				tw.to({ alpha: 0.5, scaleX: 0.5, scaleY: 0.5, x: self.width / 2, y: 800 }, 500)
					.call(function () {
						if (p_star == <eui.Image>self["star1"]) {
							var popPanel = <RatingPopComp>(self.ratingPanel.getChildByName("popPanel"));
							if (popPanel) {
								popPanel.playAnimation();
							}
						}
						self.removeChild(star);
						star = null;
					}, self);

				if (Number(this) >= self.rating) {
					self.btnTake.visible = true;
					self.bg.touchEnabled = true;
				}
			}, i, 300 * i);
		}


	}


	private whenExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.whenExit, this);
		CustomEventMgr.removeEventListener("Check Next Panel", this.extraRewardPanel, this);
		CustomEventMgr.removeEventListener("Check Scene", this.checkScene, this);

		CustomEventMgr.removeEventListener("172", this.after_updatedata_172, this);

		this.bg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapped, this);
		egret.Tween.removeAllTweens();

		if (PlayerData.guide == 5) {
			CustomEventMgr.removeEventListener("Guide_Step_5", this.onTapped, this);
		}
	}

	private onTapped() {
		console.log("TaskRating::onTapped() ...");
		var self = this;
		self.bg.touchEnabled = false;
		self.panelAnimation("coin", self.coin, "1");
	}

	private extraRewardPanel() {
		var self = this;
		if (!self.isShowRewards) {
			self.rating = 5;
			if (self.rating == 5) {
				var pl: TaskRewardPanel = null;
				if (self.result["clothes"] != "" && self.result["clothes"] != "0") {
					self.isShowRewards = true;
					self.panelAnimation("clothes", parseInt(self.result["clothes"]), "2");
				} else if (self.result["coin_once"] > 0) {
					self.isShowRewards = true;
					self.panelAnimation("coin", self.result["coin_once"], "2");
				} else if (self.result["diam_once"] > 0) {
					self.isShowRewards = true;
					self.panelAnimation("diam", self.result["diam_once"], "2");
				} else {
					self.checkUnlockPanel();
				}
			} else {
				self.checkUnlockPanel();
			}
		} else {
			self.checkUnlockPanel();
		}
	}

	private panelAnimation(type: string, count: number, type2: string) {
		var panel = new TaskRewardPanel(type, count, type2);
		panel.anchorOffsetX = DisplayMgr.stageW / 2;
		panel.anchorOffsetY = DisplayMgr.stageH / 2;
		panel.x = DisplayMgr.stageW / 2;
		panel.y = DisplayMgr.stageH / 2;
		panel.scaleX = 0;
		panel.scaleY = 0;
		this.addChild(panel);

		var tw = egret.Tween.get(panel);
		tw.to({ scaleX: 1, scaleY: 1 }, 300).call(function () {
			panel.isOver = true;
		});
	}

	private checkUnlockPanel() {
		if (TaskData.curTaskID == 6 && ClientMapData.pkGuide && ClientMapData.pkGuide == 1) {
			NetLoading.showLoading();
			var request = HttpProtocolMgr.update_clientmap_172("set", "pkGuide", 0);
			HttpMgr.postRequest(request);
			return;
		}

		var id_str = TaskData.totalMissionData()[TaskData.curTaskID - 1]["biaozhiwei"];
		if (id_str != "" && id_str != "0" && StoryData.completedStory[id_str] == null) {//有解锁剧情且未完成
			var panel = new TaskUnlockPanel();
			DisplayMgr.set2Center(panel);
			this.stage.addChild(panel);
		} else {
			// if (this.isLevelUp) {
			// 	this.playLevelUpAnimation();
			// } else {
			// 	egret.setTimeout(function () {
			// 		SceneMgr.gotoTaskScene(PlayerData.phase, PlayerData.mission);
			// 	}, this, 500);
			// }
			this.checkScene();
		}
	}

	private checkScene() {
		if (this.isLevelUp) {
			this.isLevelUp = false;
			this.playLevelUpAnimation();
		} else {
			egret.setTimeout(function () {
				SceneMgr.gotoTaskScene(PlayerData.phase, PlayerData.mission);
			}, this, 500);
		}
		// egret.setTimeout(function () {
		// 	SceneMgr.gotoTaskScene(PlayerData.phase, PlayerData.mission);
		// }, this, 500);
	}

	private playLevelUpAnimation() {
		var panel = new TaskUpgradePanel();
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}

	private after_updatedata_172() {
		NetLoading.removeLoading();
		PlayerData.pkGuide = 1;
		var pk_panel = new PkUnlockPanel();
		DisplayMgr.set2Center(pk_panel);
		this.stage.addChild(pk_panel);
	}


	// Inner --------------------------------------------------
	private container: eui.Group;
	private titlePanel: eui.Group;
	// private shower: Shower;
	private model: Model;
	private ratingPanel: eui.Group;
	private rewardComp: RewardItemComp;
	private starGroup: eui.Group;
	private bg: eui.Image;
	private btnTake: eui.Image;
	private ac_star: eui.Image;
	private pkq_bg: eui.Image;

	public star1: eui.Image;
	public star2: eui.Image;
	public star3: eui.Image;
	public star4: eui.Image;
	public star5: eui.Image;

	private result: {} = null;
	private isLevelUp: boolean = false;
	private rating: number = 0;
	private coin: number = 0
	private clothes: string = "";
	private data: {} = {};
	private isShowRewards: boolean = false;

	private configData(rating: number, coin: number) {
		var base: number = Math.max(1, Math.min(80, (rating - 1) * 20));
		var key: string;

		for (var i = 1; i < 5; i++) {
			key = "rating" + i;
			this.data[key] = "" + (base + Math.floor(Math.random() * 20));
		}

		this.data["coin"] = "+" + coin;

		if (5 === rating) {
			this.data["tucao"] = "ts_ren5_png";
			this.data["ratingText"] = "不错不错，很是大方得体ヾ(o◕∀◕)ﾉ✧";
		}
		else if (4 === rating) {
			this.data["tucao"] = "ts_ren4_png";
			this.data["ratingText"] = "吐槽君还是可以接受的 ╮(╯3╰)╭";
		}
		else if (3 === rating) {
			this.data["tucao"] = "ts_ren3_png";
			this.data["ratingText"] = "你的审美是那个星系的? ʅ(´◔౪◔)ʃ";
		}
		else if (2 === rating) {
			this.data["tucao"] = "ts_ren2_png";
			this.data["ratingText"] = "你这样，还出的去门嘛？(＃°Д°)";
		}
		else {
			this.data["tucao"] = "ts_ren1_png";
			this.data["ratingText"] = "你光着出门吧，还好看些 ⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄";
		}
	}

	private resetStars(rating: number) {
		// this.starGroup.removeChildren();
		var self = this;
		for (var i = 0; i < rating; i++) {
			egret.setTimeout(function () {
				// this.starGroup.addChild(new eui.Image("task_rating_json.ts_xing"));
				var star = new eui.Image("task_rating_json.ts_xing");
				star.scaleX = 0;
				star.scaleY = 0;
				star.x = self.titlePanel.width / 2 - star.width / 2;
				star.y = self.titlePanel.height / 2;
				self.titlePanel.addChild(star);

				var index = Number(this);
				var endX = 0;
				var endY = 27;
				if (rating % 2) {
					endX = self.titlePanel.width / 2 + (index - Math.floor(rating / 2)) * (star.width + 8) - star.width / 2;
				} else {
					endX = self.titlePanel.width / 2 + (index - (rating - 1) / 2) * (star.width + 8) - star.width / 2;
				}

				var tw = egret.Tween.get(star);
				tw.to({ x: endX, y: endY, scaleX: 1, scaleY: 1 }, 500, egret.Ease.backOut);
			}, i, i * 150);
			// this.starGroup.addChild(new eui.Image("task_rating_json.ts_xing"));
		}
	}
}