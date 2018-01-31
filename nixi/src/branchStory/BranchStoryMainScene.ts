class BranchStoryMainScene extends eui.Component{
	public container: eui.Group;
	public group: eui.Group;

	private baseComp: BaseComp;

	private storyData: {}[] = null;
	private storyIndex: number = 0;

	public bg: eui.Image;
	public role: eui.Image;
	public head: eui.Image;
	public scroller: eui.Scroller;
	public list: eui.List;
	public btn_left: eui.Image;
	public btn_right: eui.Image;
	public btn_back: eui.Image;
	public btn_change: eui.Image;

	private checkDistance: number = 100;
	private pageWidth: number = 492;
	private pageCount: number = 5;
	private curPageIndex: number = 0;
	private startX: number = 0;
	private movedX: number = 0;

	private curBranchId: number;

	public constructor(storyTemplate: {}[], branch_id: number) {
		super();

		this.skinName = "BranchStoryMainSceneSkin";
		var mask = DisplayMgr.createSceneMask();
		this.addChild(mask);
		this.mask = mask;

		this.storyData = storyTemplate;
		this.curBranchId = branch_id;
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.container.width = DisplayMgr.stageW;
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.baseComp = new BaseComp(ShowData.nickname, PlayerData.coin, PlayerData.diam, PlayerData.energy);
		this.addChild(this.baseComp);

		for (var i in StoryData.getBranchStoryById(this.curBranchId)) {
			var item: string[] = StoryData.completedStory[i];
			if (item && item.indexOf("-1") != -1) {
				this.curPageIndex = Math.min(parseInt(i), this.storyData.length - 1);  //目前只有29章剧情
			}
		}
		console.log(this.curPageIndex);
		this.list.dataProvider = new eui.ArrayCollection(this.storyData);
		this.list.itemRenderer = BranchStoryItemRenderer;

		this.scroller.viewport = this.list;
		this.scroller.throwSpeed = 0;

		this.btn_left.visible = this.curPageIndex <= 0 ? false : true;
		this.btn_right.visible = this.curPageIndex >= this.pageCount - 1 ? false : true;
		this.pageCount = this.storyData.length;

		this.startX = this.curPageIndex * this.pageWidth;

		this.onMove();

		//敬请期待
		// if (StoryData.isShowLastTip && StoryData.completedStory["29"] && StoryData.completedStory["29"].indexOf("-1") != -1) {
		// 	StoryData.isShowLastTip = false;
		// 	Prompt.showPrompt(this.stage, "后续剧情正在制作中，敬请期待!");
		// }

		this.scroller.addEventListener(eui.UIEvent.CHANGE_START, this.onChangeStart, this);
		this.scroller.addEventListener(eui.UIEvent.CHANGE_END, this.onChangeEnd, this);

		this.btn_left.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLeft, this);
		this.btn_right.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRight, this);
		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBack, this);
		this.btn_change.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);

		CustomEventMgr.addEventListener("506", this.afterStartBranchStory_506, this);

		CustomEventMgr.addEventListener("Begin Story", this.onStartStory, this);

		SoundManager.instance().startBgSound("story");
	}

	private onExit() {
		CustomEventMgr.removeEventListener("506", this.afterStartBranchStory_506, this);
		CustomEventMgr.removeEventListener("Begin Story", this.onStartStory, this);
	}

	private updateView() {
		var self = this;
		RES.getResAsync(this.storyData[this.curPageIndex]["bg"], function (data, key) {
			if (data) {
				self.bg.source = data;
			} else {
				self.bg.source = "0_png";
			}
		}, this);

		RES.getResAsync(this.storyData[this.curPageIndex]["role"], function (data, key) {
			if (data) {
				self.role.source = data;
			} else {
				self.role.source = "body_101_1";
			}
		}, this);

		RES.getResAsync(this.storyData[this.curPageIndex]["head"], function (data, key) {
			if (data) {
				self.head.source = data;
			} else {
				self.head.source = "";
			}
		}, this);
	}

	private onChangeStart() {
		this.startX = this.scroller.viewport.scrollH;
	}

	private onChangeEnd() {
		var distance = this.scroller.viewport.scrollH - this.startX;
		if (Math.abs(distance) > this.checkDistance) {
			if (distance > 0) {
				if (this.curPageIndex < this.pageCount - 1) {
					this.curPageIndex++;
					this.onMove();
				}
			}
			else {
				if (this.curPageIndex > 0) {
					this.curPageIndex--;
					this.onMove();
				}
			}
		}
		else {
			egret.Tween.get(this.scroller.viewport).to({ scrollH: this.curPageIndex * this.pageWidth }, 200)
		}
	}

	private onMove() {
		var self = this;
		this.btn_left.visible = this.curPageIndex <= 0 ? false : true;
		this.btn_right.visible = this.curPageIndex >= this.pageCount - 1 ? false : true;
		this.startX = this.curPageIndex * (this.pageWidth);
		egret.Tween.get(this.scroller.viewport).to({ scrollH: this.curPageIndex * this.pageWidth }, 300).call(function () {
			self.updateView();
		}, this);
	}

	private onLeft() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_left, function () {
			SoundManager.instance().buttonSound("flip");
			self.curPageIndex--;
			self.onMove();
		});
	}

	private onRight() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_right, function () {
			SoundManager.instance().buttonSound("flip");
			self.curPageIndex++;
			self.onMove();
		});
	}

	private onBack() {
		DisplayMgr.buttonScale(this.btn_back, function () {
			SoundManager.instance().buttonSound();
			StoryData.curStoryBranch = 0;
			SceneMgr.gotoNewStorySelectScene();
		});
	}

	private onChange() {

	}

	private onStartStory(evt: egret.Event) {
		if (PlayerData.energy < 6) {
			var panel = new ExchangePanel("energy");
			DisplayMgr.set2Center(panel);
			this.stage.addChild(panel);
			Prompt.showPrompt(this.stage, "体力不足!");
			return;
		} else {
			this.storyIndex = evt.data;
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.startBranchStory_506(this.curBranchId, this.storyData[this.storyIndex]["index"]);
			HttpMgr.postRequest(request);
		}
	}

	private afterStartBranchStory_506(evt: egret.Event) {
		NetLoading.removeLoading();
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		StoryData.selectedTag = null;
		StoryData.isStoryFinished = false;
		SceneMgr.gotoBranchStoryScene(this.curBranchId, this.storyData[this.storyIndex]["index"], this.storyData[this.storyIndex]["file"]);
	}

	private guide_step_5_4() {
		CustomEventMgr.dispatchEventWith("Begin Story", false, 0);
	}

	private guide_step_6_13() {
		SceneMgr.gotoTaskScene(1, 4);
	}
}


class BranchStoryItemRenderer extends eui.ItemRenderer {
	public lab_chapter: eui.Label;
	public lab_lock: eui.Label;
	public end_1: eui.Label;
	public end_2: eui.Label;
	public btn_start: eui.Image;
	public lab_energy: eui.Label;
	public img_energy: eui.Image;
	public btn_unlock: eui.Image;

	public constructor() {
		super();

		this.skinName = "StoryChapterCompSkin";
	}

	protected createChildren() {
		super.createChildren();

		this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStart, this);
		this.btn_unlock.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUnlock, this);
	}

	protected dataChanged() {
		this.lab_chapter.text = "第" + StoryData.getHanziText(parseInt(this.data["index"])) + "章";

		var endingArr: {}[] = this.data["ending"];
		var compStory: string[] = StoryData.completedStory[this.data.index];
		if (endingArr[0]) {
			this.end_1.text = endingArr[0]["name"];
			if (compStory && compStory.indexOf(endingArr[0]["id"]) != -1) {
				this.end_1.textColor = 0x167dfd;
			} else {
				this.end_1.textColor = 0x969797;
			}
		} else {
			this.end_1.text = "";
		}

		if (endingArr[1]) {
			this.end_2.text = endingArr[1]["name"];
			if (compStory && compStory.indexOf(endingArr[1]["id"]) != -1) {
				this.end_2.textColor = 0x167dfd;
			} else {
				this.end_2.textColor = 0x969797;
			}
		} else {
			this.end_2.text = "";
		}

		//1001测试全部解锁
		// this.btn_start.source = "story_btn_start_png";
		// this.btn_start.touchEnabled = true;

		if (StoryData.curStoryBranch != 0) {
			this.btn_start.source = "story_btn_start_png";
			this.btn_start.touchEnabled = true;
		} else {
			//是否解锁
			if (TaskData.userData()[this.data["unlock"]] == null) {
				//未解锁
				var phaseName = "小助理";
				if (this.data["phase"] == "1") {
					phaseName = "小助理";
				} else if (this.data["phase"] == "2") {
					phaseName = "练习生";
				} else if (this.data["phase"] == "3") {
					phaseName = "小演员";
				} else if (this.data["phase"] == "4") {
					phaseName = "小花旦";
				} else if (this.data["phase"] == "5") {
					phaseName = "大明星";
				}
				this.lab_lock.text = "解锁条件  " + phaseName + "任务" + this.data["unlock"];
				this.lab_lock.visible = true;
				this.lab_energy.visible = false;
				this.img_energy.visible = false;
				this.btn_start.source = "story_btn_start2_png";
				this.btn_start.touchEnabled = false;
				this.btn_unlock.visible = true;
			} else {
				this.btn_unlock.visible = false;
				var index = parseInt(this.data.index);
				if (index != 1) {
					var completedStory: string[] = StoryData.completedStory[(index - 1).toString()];
					if (completedStory == null || completedStory.indexOf("-1") == -1) {
						//未通关
						this.lab_lock.text = "解锁条件  通关之前章节";
						this.lab_lock.visible = true;
						this.lab_energy.visible = false;
						this.img_energy.visible = false;
						this.btn_start.source = "story_btn_start2_png";
						this.btn_start.touchEnabled = false;
					} else {
						//前置章节通关
						this.lab_lock.visible = false;
						this.lab_energy.visible = true;
						this.img_energy.visible = true;
						this.btn_start.source = "story_btn_start_png";
						this.btn_start.touchEnabled = true;
					}
				} else {
					this.lab_lock.visible = false;
					this.lab_energy.visible = true;
					this.img_energy.visible = true;
					this.btn_start.source = "story_btn_start_png";
					this.btn_start.touchEnabled = true;
				}
			}
		}

		// //是否解锁
		// if (TaskData.userData()[this.data["unlock"]] == null) {
		// 	//未解锁
		// 	var phaseName = "小助理";
		// 	if (this.data["phase"] == "1") {
		// 		phaseName = "小助理";
		// 	} else if (this.data["phase"] == "2") {
		// 		phaseName = "练习生";
		// 	} else if (this.data["phase"] == "3") {
		// 		phaseName = "小演员";
		// 	} else if (this.data["phase"] == "4") {
		// 		phaseName = "小花旦";
		// 	} else if (this.data["phase"] == "5") {
		// 		phaseName = "大明星";
		// 	}
		// 	this.lab_lock.text = "解锁条件  " + phaseName + "任务" + this.data["unlock"];
		// 	this.lab_lock.visible = true;
		// 	this.lab_energy.visible = false;
		// 	this.img_energy.visible = false;
		// 	this.btn_start.source = "story_btn_start2_png";
		// 	this.btn_start.touchEnabled = false;
		// 	this.btn_unlock.visible = true;
		// } else {
		// 	this.btn_unlock.visible = false;
		// 	var index = parseInt(this.data.index);
		// 	if (index != 1) {
		// 		var completedStory: string[] = StoryData.completedStory[(index - 1).toString()];
		// 		if (completedStory == null || completedStory.indexOf("-1") == -1) {
		// 			//未通关
		// 			this.lab_lock.text = "解锁条件  通关之前章节";
		// 			this.lab_lock.visible = true;
		// 			this.lab_energy.visible = false;
		// 			this.img_energy.visible = false;
		// 			this.btn_start.source = "story_btn_start2_png";
		// 			this.btn_start.touchEnabled = false;
		// 		} else {
		// 			//前置章节通关
		// 			this.lab_lock.visible = false;
		// 			this.lab_energy.visible = true;
		// 			this.img_energy.visible = true;
		// 			this.btn_start.source = "story_btn_start_png";
		// 			this.btn_start.touchEnabled = true;
		// 		}
		// 	} else {
		// 		this.lab_lock.visible = false;
		// 		this.lab_energy.visible = true;
		// 		this.img_energy.visible = true;
		// 		this.btn_start.source = "story_btn_start_png";
		// 		this.btn_start.touchEnabled = true;
		// 	}
		// }
	}

	private onStart() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_start, function () {
			SoundManager.instance().buttonSound();
			// if (TaskData.userData()[self.data["unlock"]] == null) {
			// 	//未解锁
			// 	Prompt.showPrompt(self.stage, "亲!本次章节未解锁");
			// 	return;
			// }
			// console.log(self.data.index);
			// var index = parseInt(self.data.index);
			// if (index != 1) {
			// 	var completedStory: string[] = StoryData.completedStory[(index - 1).toString()];
			// 	if (completedStory == null || completedStory.indexOf("-1") == -1) {
			// 		//未通关
			// 		Prompt.showPrompt(self.stage, "亲!前面章节未通关");
			// 		return;
			// 	}
			// }

			//开始剧情
			CustomEventMgr.dispatchEventWith("Begin Story", false, self.itemIndex);

			// NetLoading.showLoading();
			// var request: egret.URLRequest = HttpProtocolMgr.startStory_501(self.data["index"]);
			// HttpMgr.postRequest(request);
		});
	}

	private onUnlock() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_unlock, function () {
			// SceneMgr.gotoTaskScene(parseInt(self.data["phase"]), parseInt(self.data["unlock"]));
			SoundManager.instance().buttonSound();
			SoundManager.instance().destroyStartSound();
			SceneMgr.gotoTaskScene(PlayerData.phase, PlayerData.mission);
		});
	}
}