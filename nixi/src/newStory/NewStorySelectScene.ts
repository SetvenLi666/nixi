class NewStorySelectScene extends eui.Component {
	public container: eui.Group;
	public group: eui.Group;

	private baseComp: BaseComp;

	public tip_lab: eui.Label;
	public btn_begin: eui.Image;
	public groupYellow: eui.Group;
	public groupRed: eui.Group;
	public groupBlue: eui.Group;

	public btn_back: eui.Image;

	public constructor() {
		super();

		this.skinName = "NewStorySelectSceneSkin";
		var mask = DisplayMgr.createSceneMask();
		this.addChild(mask);
		this.mask = mask;

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.container.width = DisplayMgr.stageW;
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.baseComp = new BaseComp(ShowData.nickname, PlayerData.coin, PlayerData.diam, PlayerData.energy);
        this.addChild(this.baseComp);

		var index = Math.min(StoryData.getCompleteStoryArr().length, 28);
		this.tip_lab.text = "已攻略至第" + StoryData.getHanziText(index + 1) + "章";

		this.btn_begin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBegin, this);
		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBack, this);

		this.groupBlue.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGroupTouch, this);
		this.groupRed.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGroupTouch, this);
		this.groupYellow.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGroupTouch, this);

		CustomEventMgr.addEventListener("600", this.afterFetchMissionData_600, this);

		if(PlayerData.guide == 5) {
			var guidePanel = new NewGuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.stage.addChild(guidePanel);
			guidePanel.currentState = "guide_step_5_2";
			guidePanel.playAnimation();
			CustomEventMgr.addEventListener("Guide_Step_5_3", this.onBegin, this);
		}

		// SoundManager.instance().startBgSound("story");
	}

	private onExit() {
		CustomEventMgr.removeEventListener("600", this.afterFetchMissionData_600, this);
		if(PlayerData.guide == 5) {
			CustomEventMgr.removeEventListener("Guide_Step_5_3", this.onBegin, this);
		}
	}

	private onGroupTouch() {
		SoundManager.instance().buttonSound();
		Prompt.showPrompt(this.stage, "请先通关星途闪耀");
	}

	private onBegin() {
		DisplayMgr.buttonScale(this.btn_begin, function() {
			SoundManager.instance().buttonSound();
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.fetchMissionData_600();
			HttpMgr.postRequest(request);
		});
	}

	private onBack() {
		DisplayMgr.buttonScale(this.btn_back, function() {
			SoundManager.instance().buttonSound();
			// SoundManager.instance().destroyStartSound();
			SceneMgr.gotoMainScene();
		});
	}

	private afterFetchMissionData_600() {
		NetLoading.removeLoading();
		SceneMgr.gotoNewStoryScene();
	}
}