enum StoryPlayState { "normal" = 0, "auto", "fast" };

enum StoryPlayPhase { "idle" = 0, "player", "subtitle", "wait", "end" }

class StoryScene extends eui.Component implements eui.UIComponent {
	// Export -------------------------------------------------
	public constructor(storyIndex: string, script: {}[]) {
		super();
		this.storyIndex = storyIndex;
		this.script = script;

		this.skinName = "resource/skins/story/StorySkin.exml";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.whenEnter, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.whenExit, this);
	}

	// Event && Callback ---------------------------------------
	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();

		this.width = DisplayMgr.stageW;
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		var mask = DisplayMgr.createSceneMask();
		this.addChild(mask);
		this.mask = mask;

		this.ending.touchEnabled = false;
		this.ending.touchChildren = false;

		this.titleLab.text = "第" + StoryData.getHanziText(parseInt(this.storyIndex)) + "章";

		this.touchRect.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapped, this);
		this.btnGoback.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnGoback, this);

		if (PlayerData.guide == 5) {
			this.btnGoback.touchEnabled = false;
		}
	}

	private whenEnter() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.whenEnter, this);

		var self = this;

		self.couldExit = true;

		self.autoSchedule = 0;
		self.fastSchedule = 0;

		self.dialogHistory = [];
		self.history.visible = false;

		self.playPhase = StoryPlayPhase.idle;
		self.player.init(self.whenPlayerCompleted, self);
		self.subtitle.init(self.whenSubtitleCompleted, self);

		var oldY: number = self.subtitle.y;
		egret.Tween.get(self.subtitle)
			.set({ y: oldY + 500 })
			.to({ y: oldY }, 1200, egret.Ease.cubicIn)
			.call(function () {
				self.subtitle.touchChildren = true;
			});

		CustomEventMgr.addEventListener("503", self.afterCommitStory_503, self);
		CustomEventMgr.addEventListener("905", self.after_data_of_905, self);
		CustomEventMgr.addEventListener("168", self.result_of_168, this);

		if (PlayerData.guide != 0) {
			CustomEventMgr.addEventListener("Guide_Step_6_11", self.guide_step_6_11, this);
		}

		self.addEventListener("ON_AUTO_PLAY", self.onAutoPlay, self);
		self.addEventListener("ON_FAST_PLAY", self.onFastPlay, self);
		self.addEventListener("ON_CHOOSED", self.onChoosed, self);
		self.addEventListener("ON_HISTORY", self.onHistoryLog, self);
		self.addEventListener("ON_STORY_FINISH", self.onStoryFinish, self);

		CustomEventMgr.addEventListener("Play Role Introduce", self.playRoleIntroduce, self);
		CustomEventMgr.addEventListener("Show TimeBack", self.showTimeBack, self);

		self.playState = StoryPlayState.normal;
		self.updatePlay();
	}

	private whenExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.whenExit, this);
		var self = this;
		CustomEventMgr.removeEventListener("503", self.afterCommitStory_503, self);
		CustomEventMgr.removeEventListener("905", self.after_data_of_905, self);
		CustomEventMgr.removeEventListener("168", self.result_of_168, this);

		if (PlayerData.guide != 0) {
			CustomEventMgr.removeEventListener("Guide_Step_6_11", self.guide_step_6_11, this);
		}

		self.removeEventListener("ON_AUTO_PLAY", self.onAutoPlay, self);
		self.removeEventListener("ON_FAST_PLAY", self.onFastPlay, self);
		self.removeEventListener("ON_CHOOSED", self.onChoosed, self);
		self.removeEventListener("ON_HISTORY", self.onHistoryLog, self);
		self.removeEventListener("ON_STORY_FINISH", self.onStoryFinish, self);

		CustomEventMgr.removeEventListener("Play Role Introduce", self.playRoleIntroduce, self);
		CustomEventMgr.removeEventListener("Show TimeBack", self.showTimeBack, self);

		this.touchRect.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapped, this);
		this.btnGoback.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnGoback, this);

		if (this.autoSchedule != 0) {
			egret.clearInterval(this.autoSchedule);
			this.autoSchedule = 0;
		}
		else if (this.fastSchedule != 0) {
			egret.clearInterval(this.fastSchedule);
			this.fastSchedule = 0;
		}
	}

	private onChoosed(evt: egret.Event) {
		evt.stopPropagation();
		var choosedIndex = evt.data;
		var plot = this.script[this.curPlotIndex];
		console.log("StoryScene::onChoosed() - " + choosedIndex);
		var nextId = `array_next_${choosedIndex}`;
		this.curPlotIndex = parseInt(plot[nextId], 10);
		if (this.playState === StoryPlayState.normal) {
			this.playPhase = StoryPlayPhase.idle;
			this.updatePlay();
		}
		else {
			this.playPhase = StoryPlayPhase.idle;
		}
	}

	private onAutoPlay(evt: egret.Event) {
		evt.stopPropagation();
		var isSelected: boolean = evt.data;
		if (isSelected === true) {
			if (this.playState === StoryPlayState.normal) {

			}
			else if (this.playState === StoryPlayState.fast) {
				egret.clearInterval(this.fastSchedule);
				this.fastSchedule = 0;
			}
			else if (this.playState === StoryPlayState.auto) {
				egret.clearInterval(this.autoSchedule);
				this.autoSchedule = 0;
			}

			this.oldPlayState = this.playState;
			this.playState = StoryPlayState.auto;
			this.autoSchedule = egret.setInterval(this.updateAutoPlay, this, 1000);
		}
		else {
			egret.clearInterval(this.autoSchedule);
			this.autoSchedule = 0;

			// if (this.oldPlayState === StoryPlayState.normal) {
			// 	this.subtitle.spring();
			// }
			// else if (this.oldPlayState === StoryPlayState.auto) {

			// }
			// 直接恢复为普通播放
			this.playState = StoryPlayState.normal;
		}
	}

	private onFastPlay(evt: egret.Event) {
		evt.stopPropagation();
		var isSelected: boolean = evt.data;
		console.log("isSelected = " + isSelected);
		if (isSelected === true) {
			if (this.playState === StoryPlayState.normal) {
				if (this.playPhase === StoryPlayPhase.subtitle) {
					this.subtitle.spring();
				}
			}
			else if (this.playState === StoryPlayState.auto) {
				egret.clearInterval(this.autoSchedule);
				this.autoSchedule = 0;
			}
			else if (this.playState === StoryPlayState.fast) {
				egret.clearInterval(this.fastSchedule);
				this.fastSchedule = 0;
			}

			this.oldPlayState = this.playState;
			this.playState = StoryPlayState.fast;
			if (this.playPhase === StoryPlayPhase.player || this.playPhase === StoryPlayPhase.subtitle) {
				this.playPhase = StoryPlayPhase.idle;
			}
			this.fastSchedule = egret.setInterval(this.updateFastPlay, this, 200);
		}
		else {
			egret.clearInterval(this.fastSchedule);
			this.fastSchedule = 0;

			if (this.oldPlayState === StoryPlayState.normal) {
				this.subtitle.spring();
			}

			// 直接恢复为普通播放
			this.playState = StoryPlayState.normal;
		}
	}

	private onTapped() {
		if (this.playState === StoryPlayState.normal) {
			this.updatePlay();
			console.log("tap tap tap");
		}

		if (this.playPhase == StoryPlayPhase.end && StoryData.isStoryFinished) {
			console.log("..........");
			//敬请期待==========
			if (this.storyIndex == "29") {
				StoryData.isShowLastTip = true;
			}
			SceneMgr.gotoNewStoryScene();
		}
	}

	private onHistoryLog(evt: egret.Event) {
		evt.stopPropagation();
		this.history.visible = !this.history.visible;
	}

	private onBtnGoback() {
		var self = this;

		DisplayMgr.buttonScale(self.btnGoback, function () {
			SoundManager.instance().buttonSound();
			if (self.couldExit == true) {
				// SceneMgr.gotoStoryChapterScene(parseInt(self.storyIndex));
				if (self.storyIndex == "29") {
					StoryData.isShowLastTip = true;
				}

				SceneMgr.gotoNewStoryScene()
			}
		});
	}

	private onStoryFinish(evt: egret.Event) {
		if (PlayerData.guide == 8 || PlayerData.guide == 130) {

		} else {
			// SceneMgr.gotoStoryChapterScene(evt.data);
			if (this.storyIndex == "29") {
				StoryData.isShowLastTip = true;
			}
			SceneMgr.gotoNewStoryScene();
		}
	}

	private playRoleIntroduce(evt: egret.Event) {
		console.log("aaaaaaa")
		var panel = new RoleIntroducePanel();
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}

	private afterCommitStory_503(evt: egret.Event) {
		this.extra_reward = evt.data;

		if (PlayerData.guide == 5) {
			var request = HttpProtocolMgr.update_guide_905(6);
			HttpMgr.postRequest(request);
		} else {
			NetLoading.removeLoading();
			this.checkExtraReward();
		}
	}

	private after_data_of_905() {
		NetLoading.removeLoading();
		this.checkExtraReward();
	}

	private checkExtraReward() {
		if (this.extra_reward && this.extra_reward["pass_reward"] == 10) {
			//奖励面板
			var panel = new StoryRewardPanel(this.storyIndex);
			DisplayMgr.set2Center(panel);
			this.stage.addChild(panel);

			this.couldExit = true;
			this.btnGoback.touchEnabled = true;
		} else {
			this.backUnlock();
		}
	}

	private backUnlock() {
		var self = this;
		egret.setTimeout(function () {
			self.couldExit = true;
			self.btnGoback.touchEnabled = true;
		}, self, 500);
	}

	private guide_step_6_11() {
		this.onBtnGoback();
	}

	private showTimeBack() {
		console.log("show time back");
		if (this.timeback == null) {
			this.timeback = new TimeBackComp();
			this.timeback.horizontalCenter = 0;
			this.timeback.y = 630;
			this.group.addChild(this.timeback);

			this.timeback.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openTimeBack, this);
		}
	}

	private openTimeBack(evt: egret.Event) {
		console.log(evt.target);
		var self = this;
		DisplayMgr.buttonScale(evt.target, function () {
			SoundManager.instance().buttonSound();
			if (PlayerData.diam < 10) {
				Prompt.showPrompt(self.stage, "钻石不足！");
			} else {
				NetLoading.showLoading();
				var request = HttpProtocolMgr.time_back_request_168();
				HttpMgr.postRequest(request);
			}
		});
	}

	private result_of_168() {
		NetLoading.removeLoading();
		var self = this;

		if (self.timeback) {
			self.timeback.parent.removeChild(self.timeback);
			self.timeback = null;
		}

		self.playPhase = StoryPlayPhase.idle;
		self.playState = StoryPlayState.normal;
		self.subtitle.cbAutoPlay.touchEnabled = true;
		self.subtitle.cbFastPlay.touchEnabled = true;
		self.subtitle.btnLog.touchEnabled = true;
		self.subtitle.btnShare.visible = false;
		self.couldExit = true;

		self.ending.backAnimation();
		egret.setTimeout(function () {
			self.curPlotIndex = StoryData.selectedTag;
			self.player.bg.source = StoryData.selectedBg;
			self.updatePlay();
		}, self, 500);
	}

	// Inner --------------------------------------------------
	private group: eui.Group;
	private player: StoryPlayer;
	private touchRect: eui.Rect;
	private subtitle: SubtitlePanel;
	private choices: StoryChoices;
	private ending: StoryEndings;
	private btnGoback: eui.Image;
	private history: HistoryLog;
	private titleLab: eui.Label;

	private dialogHistory: Array<egret.ITextElement>;
	private storyIndex: string = null;
	private script: {}[] = null;
	private curPlotIndex: number = 0;
	private playPhase: StoryPlayPhase;
	private playState: StoryPlayState;
	private oldPlayState: StoryPlayState;
	private autoSchedule: number = 0;
	private fastSchedule: number = 0;
	private couldExit: Boolean = true;
	private extra_reward: {} = null;
	private timeback: TimeBackComp = null;

	private updatePlay() {
		// this.playState = StoryPlayState.normal;
		if (this.playPhase === StoryPlayPhase.idle) { // 新一轮
			if (this.curPlotIndex < this.script.length) {
				this.playPlot(this.curPlotIndex);
			}
		}
		else if (this.playPhase === StoryPlayPhase.subtitle) {
			if (this.subtitle.isUpdating === true) {
				this.subtitle.spring();
			}
		}
	}

	private updateAutoPlay() {
		this.playState = StoryPlayState.auto;
		if (this.playPhase === StoryPlayPhase.idle) { // 新一轮
			if (this.curPlotIndex < this.script.length) {
				this.updatePlay();
				// this.playPlot(this.curPlotIndex);
			}
		}
		else if (this.playPhase === StoryPlayPhase.end) {
			egret.clearInterval(this.autoSchedule);
			this.autoSchedule = 0;
			// this.playState = this.oldPlayState;
		}
	}

	private updateFastPlay() {
		console.log("StoryScene::updateFastPlay()");
		if (this.playPhase === StoryPlayPhase.idle) { // 新一轮
			if (this.curPlotIndex < this.script.length) {
				var plot: {} = this.script[this.curPlotIndex];
				console.log("this.curPlotIndex = " + this.curPlotIndex);
				this.playPhase = StoryPlayPhase.player;
				this.player.fastPlay(plot);
				this.playPhase = StoryPlayPhase.subtitle;
				this.subtitle.fastPlay(plot["name"], plot["said"]);

				this.checkNext(plot);
			}
		}
		else if (this.playPhase === StoryPlayPhase.end) {
			egret.clearInterval(this.fastSchedule);
			this.fastSchedule = 0;
			// this.playState = this.oldPlayState;
		}
	}

	private checkNext(plot: {}) {
		var next: string = plot["next"];
		console.log("checkNext() - next: " + next);
		if ("" === next) { // 选择
			StoryData.selectedTag = this.curPlotIndex;
			StoryData.selectedBg = this.player.bg.source;
			this.playPhase = StoryPlayPhase.wait;
			this.choices.update(plot["array_1"], plot["array_2"], plot["array_3"]);
			this.subtitle.hideTapFlag();

			if (PlayerData.guide == 5) {
				this.btnGoback.touchEnabled = false;
				var guidePanel = new NewGuidePanel();
				DisplayMgr.set2Center(guidePanel);
				this.addChild(guidePanel);
				guidePanel.currentState = "guide_step_5_5";
				guidePanel.playAnimation();
			}
		}
		else if ("-1" === next) { // 完通
			this.playPhase = StoryPlayPhase.end;
			// this.subtitle.touchChildren = false;
			this.subtitle.cbAutoPlay.touchEnabled = false;
			this.subtitle.cbFastPlay.touchEnabled = false;
			this.subtitle.btnLog.touchEnabled = false;
			// this.subtitle.btnShare.visible = true;
			// this.subtitle.btnShare.touchEnabled = true;
			this.couldExit = false;

			this.ending.showEnding(true, "", this.storyIndex);

			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.commitStory_503(this.storyIndex, "-1");
			HttpMgr.postRequest(request);
		}
		else if ("-2" === next) { // 成就
			this.playPhase = StoryPlayPhase.end;
			// this.subtitle.touchChildren = false;
			this.subtitle.cbAutoPlay.touchEnabled = false;
			this.subtitle.cbFastPlay.touchEnabled = false;
			this.subtitle.btnLog.touchEnabled = false;
			// this.subtitle.btnShare.visible = true;
			// this.subtitle.btnShare.touchEnabled = true;
			this.couldExit = false;

			var temp = plot["said"].split(" ");		// 显示用
			this.ending.showEnding(false, temp[1], this.storyIndex);

			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.commitStory_503(this.storyIndex, plot["achievement"]);
			HttpMgr.postRequest(request);
		}
		else {
			if (plot["name"].length > 0) {
				this.dialogHistory.push({ text: plot["name"], style: { "textColor": 0xff0000 } });
				this.dialogHistory.push({ text: ": " + plot["said"] + "\n" });
			}
			else {
				this.dialogHistory.push(plot["said"]);
				this.dialogHistory.push({ text: "        " + plot["said"] + "\n" });
			}

			this.history["label"].textFlow = this.dialogHistory;
			this.curPlotIndex = parseInt(next, 10);
			this.playPhase = StoryPlayPhase.idle;
		}
	}

	private playPlot(plotIndex: number) {
		this.playPhase = StoryPlayPhase.player;
		this.player.play(this.script[plotIndex]);
	}

	private whenPlayerCompleted() {
		console.log("StoryScene::whenPlayerCompleted()");
		this.playPhase = StoryPlayPhase.subtitle;
		if (this.playState === StoryPlayState.auto) {
			this.subtitle.play(this.script[this.curPlotIndex]["name"], this.script[this.curPlotIndex]["said"]);
		}
		else if (this.playState === StoryPlayState.fast) {
			this.subtitle.fastPlay(this.script[this.curPlotIndex]["name"], this.script[this.curPlotIndex]["said"]);
		}
		else {
			this.subtitle.play(this.script[this.curPlotIndex]["name"], this.script[this.curPlotIndex]["said"]);
		}
	}

	private whenSubtitleCompleted() {
		console.log("StoryScene::whenSubtitleCompleted()");
		// this.playPhase = StoryPlayPhase.idle;
		this.checkNext(this.script[this.curPlotIndex]);
	}
}