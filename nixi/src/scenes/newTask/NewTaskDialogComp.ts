class NewTaskDialogComp extends eui.Component {
	public container: eui.Group;
	public group: eui.Group;

	// public shower: Shower;
	public model: Model;
	public player1: eui.Image;
	public player2: eui.Image;
	public player3: eui.Image;
	public btn_back: eui.Image;

	private titlesData: {}[] = [];
	public dialogGroup: eui.Group;
	public titleGroup: eui.Group;
	public btn_start: eui.Image;
	public taskTitle: eui.Label;
	public rewardComp: RewardItemComp;
	public flagImg: eui.Image;

	public nickname: eui.Label;
	public btn_play: eui.Image;
	public btn_fast: eui.Image;
	public contentText: eui.Label;
	public img_arrow: eui.Image;
	public btn_hz: eui.Image;
	public touchRect: eui.Rect;
	public play_selected: eui.Image;
	public fast_selected: eui.Image;

	private isComplete: boolean = true; //是否打印完成
	private isAutoPlay: boolean = false;//是否自动播放
	private isFastPlay: boolean = false;//是否快速播放
	private interval: number = 30;
	private typerClearArr: number[] = [];

	private curPhase: number = 1;
	private talkData: {}[] = [];
	private taskid: number = 1;
	private curIndex: number = 0;
	private curTag_1: string = null;
	private curTag_2: string = null;
	private curTag_3: string = null;

	public constructor(id: number) {
		super();

		this.skinName = "NewTaskDialogCompSkin";
		var mask = DisplayMgr.createSceneMask();
		this.addChild(mask);
		this.mask = mask;

		this.taskid = id;
		this.curPhase = parseInt(TaskData.totalMissionData()[this.taskid - 1]["phase"]);
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);

		this.container.width = DisplayMgr.stageW;
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.configComp();

		this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStart, this);
		this.btn_play.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonPlay, this);
		this.btn_fast.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonFast, this);
		this.btn_hz.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHz, this);
		this.touchRect.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRect, this);

		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonBack, this);

		if (PlayerData.guide == 2) {
			this.btn_back.touchEnabled = false;
			CustomEventMgr.addEventListener("Guide_Step_2_3", this.onStart, this);
			CustomEventMgr.addEventListener("Guide_Step_2_4", this.onRect, this);
			CustomEventMgr.addEventListener("Guide_Step_2_5", this.onHz, this);
		}

		CustomEventMgr.addEventListener("400", this.afterFetchClothesData_400, this);
		CustomEventMgr.addEventListener("600", this.after_result_of_600, this);
		CustomEventMgr.addEventListener("704", this.after_result_of_704, this);
		CustomEventMgr.addEventListener("802", this.after_result_of_802, this);

	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);

		CustomEventMgr.removeEventListener("400", this.afterFetchClothesData_400, this);
		CustomEventMgr.removeEventListener("600", this.after_result_of_600, this);
		CustomEventMgr.removeEventListener("704", this.after_result_of_704, this);
		CustomEventMgr.removeEventListener("802", this.after_result_of_802, this);

		if (PlayerData.guide == 2) {
			CustomEventMgr.removeEventListener("Guide_Step_2_3", this.onStart, this);
			CustomEventMgr.removeEventListener("Guide_Step_2_4", this.onRect, this);
			CustomEventMgr.removeEventListener("Guide_Step_2_5", this.onHz, this);
		}

		this.btn_start.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onStart, this);
		this.btn_play.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonPlay, this);
		this.btn_fast.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonFast, this);
		this.btn_hz.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHz, this);
		this.touchRect.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRect, this);

		this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonBack, this);
	}

	private onStart() {
		if (this.titleGroup.parent) {
			this.titleGroup.parent.removeChild(this.titleGroup);
		}
		this.dialogGroup.visible = true;
		this.onPlay();
	}

	private configComp() {
		this.titlesData = TaskData.totalMissionData();
		var curtitleData = this.titlesData[this.taskid - 1];
		this.taskTitle.text = curtitleData["name"];
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

		if (TaskData.userData[this.taskid.toString()] && TaskData.userData[this.taskid.toString()] == 5) {
			this.flagImg.visible = true;
		}

		this.talkData = TaskData.curMissionofPhase(this.curPhase);
		var len = TaskData.curCountsofMission(this.curPhase);
		
		for (var i = 0; i < len; i++) {
			if (parseInt(this.talkData[i]["sign"]) == this.taskid) {
				this.curIndex = i;
				this.curTag_1 = this.talkData[i]["tag1"];
				this.curTag_2 = this.talkData[i]["tag2"];
				this.curTag_3 = this.talkData[i]["tag3"];
				break;
			}
		}

		var tw = egret.Tween.get(this.img_arrow, { loop: true });
		tw.to({ alpha: 0 }, 500)
			.wait(150)
			.to({ alpha: 1 }, 500)
			.wait(150);

		this.model.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);
		this.updateComp();
	}

	private initPlayers() {
		var obj: {} = this.talkData[this.curIndex];
		if (obj["states"] == 1) {
			this.player1.source = "";
			this.player2.source = "";
			if (obj["zishi_2"] == "101" || obj["zishi_1"] == "101") {
				this.player3.source = "";
				this.model.horizontalCenter = 0;
				this.model.visible = true;
			} else {
				this.model.visible = false;
				var playerid = obj["zishi_2"] == "" ? obj["zishi_1"] : obj["zishi_2"];
				this.player3.source = "body_" + playerid;
			}
			// if (obj["zishi_2"] != "") {
			// 	if(obj["zishi_2"] == "101") {
			// 		this.player3.source = "";
			// 		this.shower.alpha = 0;
			// 		this.shower.horizontalCenter = 0;
			// 		this.playerTween(this.shower);
			// 	}else {
			// 		this.shower.visible = false;
			// 		this.player3.source = "body_" + obj["zishi_2"];
			// 	}
			// } else if (obj["zishi_1"] != "") {
			// 	if(obj["zishi_1"] == "101") {

			// 	}
			// 	this.player3.source = "body_" + obj["zishi_1"];
			// }

		} else {
			this.player3.source = "";
			if (obj["zishi_2"] == "101") {
				this.model.horizontalCenter = -205;
				this.model.visible = true;
				this.player2.source = "body_" + obj["zishi_1"];
			} else if (obj["zishi_1"] == "101") {
				this.model.horizontalCenter = 205;
				this.model.visible = true;
				this.player1.source = "body_" + obj["zishi_2"];
			} else {
				this.player1.source = "body_" + obj["zishi_2"];
				this.player2.source = "body_" + obj["zishi_1"];
			}
		}
	}

	private updateComp() {
		this.nickname.text = this.talkData[this.curIndex]["name"];

		//姿势、表情
		this.initPlayers();
	}

	private onButtonPlay() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_play, function () {
			SoundManager.instance().buttonSound();
			if (self.isAutoPlay) {
				self.isAutoPlay = false;
				self.isFastPlay = false;
				self.interval = 30;
				self.play_selected.visible = false;
			} else {
				self.isAutoPlay = true;
				self.play_selected.visible = true;
				self.onPlay();
			}
		});
	}

	private onPlay() {
		if (this.isComplete) {
			this.isComplete = false;

			this.img_arrow.visible = false;
			this.contentText.text = "";

			this.updateComp();

			this.typerEffect(this.contentText, this.talkData[this.curIndex]["said"]);
        } else {
			var len = this.typerClearArr.length;
			for (var i = len - 1; i >= 0; i--) {
				egret.clearTimeout(this.typerClearArr[i]);
				this.typerClearArr.splice(i, 1);
			}
			this.isComplete = true;
			this.contentText.text = this.talkData[this.curIndex]["said"];
			this.typerCallback();
		}
	}

	private typerEffect(obj, content: string = ""): void {
		var self = this;
        var strArr: Array<any> = content.split("");
        var len: number = strArr.length;
        for (var i = 0; i < len; i++) {
            var key = egret.setTimeout(function () {
                obj.appendText(strArr[Number(this)]);
                if (Number(this) >= len - 1) {
                    self.typerCallback();
                }
            }, i, self.interval * i);
			self.typerClearArr.push(key);
        }
    }

	private typerCallback() {
		this.typerClearArr = [];

		if (this.talkData[this.curIndex]["next"] == "-1") {
			if (PlayerData.guide == 2 && this.taskid == 1) {
				var guidePanel = new NewGuidePanel();
				DisplayMgr.set2Center(guidePanel);
				this.stage.addChild(guidePanel);
				guidePanel.currentState = "guide_step_2_5";
				guidePanel.playAnimation();
			}
			this.isComplete = false;
			this.img_arrow.visible = false;
			this.btn_hz.visible = true;
		} else {
			this.curIndex++;
			this.isComplete = true;
			if (this.isAutoPlay) {
				if(this.isFastPlay) {
					egret.setTimeout(this.onPlay, this, 200);
				}else {
					this.onPlay();
				}
			}else {
				this.img_arrow.visible = true;
			}
		}
	}

	private onRect() {
		this.onPlay();
	}

	private onButtonFast() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_fast, function () {
			if (self.isFastPlay) {
				self.isFastPlay = false;
				self.isAutoPlay = false;
				self.interval = 30;
				self.fast_selected.visible = false;
			} else {
				self.isFastPlay = true;
				self.isAutoPlay = true;
				self.interval = 0;
				self.onPlay();
				self.fast_selected.visible = true;
			}
		});
	}

	private onHz() {
		//开始任务
		var self = this;
		DisplayMgr.buttonScale(this.btn_hz, function () {
			if (PlayerData.energy < 6) {
				Prompt.showPrompt(self.stage, "体力不足");
				return;
			}

			var data = self.talkData[self.curIndex];
			if ("-1" === data["next"]) {
				self.gotoDressScene();
			}
		});
	}

	private gotoDressScene() {
		if (ClothesData.hasFetchedUserClohtes()) {
			this.afterFetchClothesData_400(null);
		}
		else {
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.fetchOwnClothesData_400();
			HttpMgr.postRequest(request);
		}
	}

	private afterFetchClothesData_400(evt: egret.Event) {
		NetLoading.removeLoading();
		// var data = this.curTaskDialogData[0];
		if (this.talkData[this.curIndex]["next"] == "-6") {
			SceneMgr.gotoDressScene(null, null, null, null);
		} else {
			var taskid: string;
			taskid = this.taskid.toString();
			TaskData.curTaskID = this.taskid;
			SceneMgr.gotoDressScene(taskid, this.curTag_1, this.curTag_2, this.curTag_3);
		}
	}

	private after_result_of_600(evt: egret.Event) {
		var request = HttpProtocolMgr.home_info_704(HomeData.has_init_template());
		HttpMgr.postRequest(request);
	}

	private after_result_of_704(evt: egret.Event) {
		NetLoading.removeLoading();
	}

	private after_result_of_802(evt: egret.Event) {
		NetLoading.removeLoading();
		SceneMgr.gotoStranger();
	}

	private onButtonBack() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_back, function () {
			SoundManager.instance().buttonSound();
			if (self.parent) {
				self.parent.removeChild(self);
			}
		});
	}
}