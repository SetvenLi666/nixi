class ChapterPageRenderer extends eui.ItemRenderer {
	// Export --------------------------------------------------

	// Event & Callback --------------------------------------------------
	protected whenEnter(evt: egret.Event) {
		this.btnStart.touchEnabled = true; // IPT
		this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartStory, this);

		// CustomEventMgr.addEventListener("501", this.afterStartStory_501, this);
		CustomEventMgr.addEventListener("GUIDE_STEP_13", this.guideStep_13, this);
	}

	private whenExit() {
		CustomEventMgr.removeEventListener("GUIDE_STEP_13", this.guideStep_13, this);
	}

	private onStartStory() {
		var self = this;
		DisplayMgr.buttonScale(this.btnStart, function () {

			if(self.data.curPhase < self.data.required_phase) {
				Prompt.showPrompt(self.stage, "公司等级不足,无法开启");
				return;
			}
			//=============公司星级限制解除(2017-03-30)==========
			// if(self.data.curRating < self.data.required_index) {
			// 	Prompt.showPrompt(self.stage, "公司星级不足,无法开启");
			// 	return;
			// }

			if (self.data.index != 0) {
				var completedStory: string[] = StoryData.completedStory[(self.data.index - 1).toString()];
				if (completedStory == null || completedStory.indexOf("-1") == -1) {
					//未通关
					Prompt.showPrompt(self.stage, "亲!前面章节,未通关");
					return;
				}
			}

			var data = {
				"index": self.data.index,
				"file": self.data.file
			};
			CustomEventMgr.dispatchEventWith("Start Story", false, data);
		});
	}

	private guideStep_13() {
		// NetLoading.showLoading();
		// var request: egret.URLRequest = HttpProtocolMgr.startStory_501(this.data.index);
		// HttpMgr.postRequest(request);
		this.onStartStory();
	}

	protected dataChanged(): void {
		var ownedColor = 0x503f44;
		var notOwnedColor = 0xbfbabb;
        //显示数据中的值
        this.title.text = this.data.title;
		this.condition.text = this.data.required_text;

		var owned_endings: Array<any> = this.data.owned_endings;
		
		var endings: Array<Object> = this.data.ending;
		var curPhase: number = this.data.curPhase;
		var requiredPhase: number = this.data.required_phase;
		var curRating: number = this.data.curRating;
		var requiredRating: number = this.data.required_index;

		//=========2017-03-31解除星星数限制=========
		// if (curPhase >= requiredPhase && curRating >= requiredRating) { // 解锁状态
		// 	this.btnStart.touchEnabled = true;
		// 	this.btnStart.source = "btn_startstory_png";
		// 	// 通关状态
		// 	if (owned_endings.indexOf("-1") != -1) {
		// 		this.status.source = RES.getRes("qj_tongguan_png");
		// 	}
		// 	else {
		// 		this.status.source = RES.getRes("qj_yijiesuo_png");
		// 	}
		// }
		// else {
		// 	this.status.source = RES.getRes("qj_weijiesuo_png");

		// 	// this.btnStart.touchEnabled = false;
		// 	this.btnStart.source = "btn_startstory_2_png";
		// 	// this.btnStart.filters = [DisplayMgr.GrayFilter()];   filters属性只在webGL下有效
		// }

		if (curPhase >= requiredPhase) { // 解锁状态
			this.btnStart.touchEnabled = true;
			this.btnStart.source = "btn_startstory_png";
			// 通关状态
			if (owned_endings.indexOf("-1") != -1) {
				this.status.source = RES.getRes("qj_tongguan_png");
			}
			else {
				this.status.source = RES.getRes("qj_yijiesuo_png");
			}
		}
		else {
			this.status.source = RES.getRes("qj_weijiesuo_png");

			// this.btnStart.touchEnabled = false;
			this.btnStart.source = "btn_startstory_2_png";
			// this.btnStart.filters = [DisplayMgr.GrayFilter()];   filters属性只在webGL下有效
		}

		if (undefined !== this.data.ending[0]) {
			this.ending1.text = this.data.ending[0].name;
			
			if (owned_endings.indexOf(this.data.ending[0].id) !== -1) {
				this.ending1.textColor = ownedColor;
			}
			else {
				this.ending1.textColor = notOwnedColor;
			}
		}
		else {
			this.ending1.text = "";
		}

		if (undefined !== this.data.ending[1]) {
			this.ending2.text = this.data.ending[1].name;
			if (owned_endings.indexOf(this.data.ending[1].id) !== -1) {
				this.ending2.textColor = ownedColor;
			}
			else {
				this.ending2.textColor = notOwnedColor;
			}
		}
		else {
			this.ending2.text = "";
		}

		if (undefined !== this.data.ending[2]) {
			this.ending3.text = this.data.ending[2].name;
			if (owned_endings.indexOf(this.data.ending[2].id) !== -1) {
				this.ending3.textColor = ownedColor;
			}
			else {
				this.ending3.textColor = notOwnedColor;
			}
		}
		else {
			this.ending3.text = "";
		}

		if (undefined !== this.data.ending[3]) {
			this.ending4.text = this.data.ending[3].name;
			if (owned_endings.indexOf(this.data.ending[3].id) !== -1) {
				this.ending4.textColor = ownedColor;
			}
			else {
				this.ending4.textColor = notOwnedColor;
			}
		}
		else {
			this.ending4.text = "";
		}
    }

	// Inner --------------------------------------------------
	private title: eui.Label = null;
	private condition: eui.Label = null;
	private status: eui.Image = null;
	private ending1: eui.Label = null;
	private ending2: eui.Label = null;
	private ending3: eui.Label = null;
	private ending4: eui.Label = null;
	private btnStart: eui.Image = null;

	public constructor() {
		super();
		this.skinName = "resource/skins/story/ChapterPage.exml";
		this.width += 0; // 重要，否则scroller计算自身大小失效!!!
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.whenEnter, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.whenExit, this);
	}


}