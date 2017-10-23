class StoryChapterPageView extends eui.Component implements eui.UIComponent {
	// Export --------------------------------------------------

	// Event & Callback --------------------------------------------------
	protected whenEnter(evt: egret.Event) {
		console.log("StoryChapterPageView::whenEnter() ...");

		var self = this;
		self.container.width = DisplayMgr.stageW;
		self.content.width = Math.min(DisplayMgr.stageW, 852);

		var base = new BaseComponent(ShowData.nickname, PlayerData.coin, PlayerData.diam, PlayerData.energy);
		this.addChild(base);

		if (PlayerData.guide == 99) {
			PlayerData.guide = 13;
			var guidePanel = new GuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.addChild(guidePanel);
		} else if (PlayerData.guide == 14) {
			var guidePanel = new GuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.addChild(guidePanel);
		}

		self.pageCount = self.dataSource.length;
		if (self.pageCount > 0) {
			self.pageWidth = 520 + 5;
		}

        var dataGroup: eui.DataGroup = new eui.DataGroup();
        dataGroup.dataProvider = self.dataSource;
        dataGroup.percentWidth = 100;
        dataGroup.percentHeight = 100;
		dataGroup.layout = new eui.HorizontalLayout();
        dataGroup.itemRenderer = ChapterPageRenderer;

		self.scroller.viewport = dataGroup;
		self.scroller.throwSpeed = 0; 	// 重要，避免甩太远

		this.startX = this.curPageIndex * this.pageWidth;
		// this.update();
		// this.scroller.viewport.scrollH = this.curPageIndex * this.pageWidth;
		egret.Tween.get(this.scroller.viewport).to({ scrollH: this.curPageIndex * this.pageWidth }, 300);

		self.scroller.addEventListener(eui.UIEvent.CHANGE_START, self.whenChangeStart, self);
		self.scroller.addEventListener(eui.UIEvent.CHANGE_END, self.whenChangeEnd, self);

		self.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onLeftBtn, self);
		self.rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onRightBtn, self);
		self.returnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onReturntBtn, self);

		CustomEventMgr.addEventListener("Start Story", this.startStory, this);
		CustomEventMgr.addEventListener("501", this.afterStartStory_501, this);

		egret.setTimeout(function () {
			var duration = 500;
			var oldLeftX = self.leftBtn.x;
			var oldRightX = self.rightBtn.x;

			egret.Tween.get(self.leftBtn, { loop: true }).to({ x: oldLeftX - 12 }, duration).to({ x: oldLeftX }, duration);
			egret.Tween.get(self.rightBtn, { loop: true }).to({ x: oldRightX + 12 }, duration).to({ x: oldRightX }, duration);

			// self.curPageIndex = 0;
			self.update();
		}, self, 300);
	}

	private whenExit() {
		CustomEventMgr.removeEventListener("Start Story", this.startStory, this);
		CustomEventMgr.removeEventListener("501", this.afterStartStory_501, this);
	}

	private whenChangeStart(evt: eui.UIEvent) {
		this.startX = this.scroller.viewport.scrollH;
		console.log("start: " + this.startX);
	}

	private whenChangeEnd(evt: eui.UIEvent) {
		var distance = this.scroller.viewport.scrollH - this.startX;
		console.log("distance: " + distance);
		if (Math.abs(distance) > this.checkDistance) {
			// this.scroller.stopAnimation();
			if (distance > 0) {
				if (this.curPageIndex < this.pageCount - 1) {
					this.curPageIndex++;
					this.startX = this.curPageIndex * this.pageWidth;
					this.update();
					egret.Tween.get(this.scroller.viewport).to({ scrollH: this.curPageIndex * this.pageWidth }, 300);
				}
			}
			else {
				if (this.curPageIndex > 0) {
					this.curPageIndex--;
					this.startX = this.curPageIndex * this.pageWidth;
					this.update();
					egret.Tween.get(this.scroller.viewport).to({ scrollH: this.curPageIndex * this.pageWidth }, 300);
				}
			}
		}
		else {
			egret.Tween.get(this.scroller.viewport).to({ scrollH: this.curPageIndex * this.pageWidth }, 200)
		}
	}

	private onLeftBtn(evt: egret.Event) {
		console.log("StoryChapterPageView::onLeftBtn()");
		var self = this;
		var oldScaleX = evt.currentTarget.scaleX;
		var oldScaleY = evt.currentTarget.scaleY;

		egret.Tween.get(evt.currentTarget)
			.to({ scaleX: oldScaleX * 1.05, scaleY: oldScaleY * 1.05 }, 100)
			.to({ scaleX: oldScaleX, scaleY: oldScaleY }, 50)
			.call(function () {
				self.curPageIndex--;
				self.startX = self.curPageIndex * self.pageWidth;
				self.scroller.viewport.scrollH = self.startX;
				self.update();
			});
	}

	private onRightBtn(evt: egret.Event) {
		console.log("StoryChapterPageView::onRightBtn()");
		console.log(evt.currentTarget.color);
		var self = this;
		var oldScaleX = evt.currentTarget.scaleX;
		var oldScaleY = evt.currentTarget.scaleY;
		egret.Tween.get(evt.currentTarget)
			.to({ scaleX: oldScaleX * 1.05, scaleY: oldScaleY * 1.05 }, 100)
			.to({ scaleX: oldScaleX, scaleY: oldScaleY }, 50)
			.call(function () {
				self.curPageIndex++;
				self.startX = self.curPageIndex * self.pageWidth;
				self.scroller.viewport.scrollH = self.startX;
				self.update();
			});
	}

	private onReturntBtn(evt: egret.Event) {
		var scaleAction = DisplayMgr.buttonScale(evt.target);
		scaleAction.call(function () {
			SceneMgr.gotoMainScene();
		});
	}

	private startStory(evt: egret.Event) {
		NetLoading.showLoading();
		this.storyData = evt.data;
		var request: egret.URLRequest = HttpProtocolMgr.startStory_501(this.storyData["index"]);
		HttpMgr.postRequest(request);
	}

	private afterStartStory_501(evt: egret.Event) {
		NetLoading.removeLoading();
		SceneMgr.gotoStoryScene(this.storyData["index"], this.storyData["file"]);
	}

	// Inner --------------------------------------------------
	private container: eui.Group = null;
	private content: eui.Group = null;
	private scroller: eui.Scroller = null;
	private bg: eui.Image = null;
	private role: eui.Image = null;
	private head: eui.Image = null;
	private leftBtn: eui.Image = null;
	private rightBtn: eui.Image = null;
	private returnBtn: eui.Image = null;

	private templateData: Array<any> = null;
	private dynamicData: Object = null;
	private dataSource: eui.ArrayCollection = null;
	private checkDistance: number = 100;
	private pageWidth: number = 400; 	// 下面重新计算
	private pageCount: number = 3; 		// 下面重新计算
	private curPageIndex: number = 0;
	private startX: number = 0;
	private movedX: number = 0;
	private storyData: {};

	public constructor(templateData: Array<any>, dynamicData: Object, curPhase: number, curRating: number, index?: number) {
		super();
		this.skinName = "resource/skins/story/StoryChapterPageView.exml";

		var mask = DisplayMgr.createSceneMask();
		this.addChild(mask);
        this.mask = mask;

		if (dynamicData != null) {
			for (var i in dynamicData) {
				var arr: string[] = dynamicData[i];
				if (arr.indexOf("-1") == -1) {
					this.curPageIndex = parseInt(i);
				}
			}
		}

		this.templateData = templateData;
		this.dynamicData = dynamicData;
		this.synthesizeDataSource(this.templateData, this.dynamicData, curPhase, curRating);
		
		if(index) {
			this.curPageIndex = index;
		}

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.whenEnter, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.whenExit, this);
	}

	private update() {
		var obj = this.dataSource.source[this.curPageIndex];
		this.bg.source = obj["bg"];
		this.role.source = obj["role"];
		this.head.source = obj["head"];

		if (this.curPageIndex == 0) {
			if (this.content.contains(this.leftBtn)) {
				this.content.removeChild(this.leftBtn);
			}
		}
		else {
			if (!this.content.contains(this.leftBtn)) {
				this.content.addChild(this.leftBtn);
			}
		}

		if (this.curPageIndex == this.pageCount - 1) {
			if (this.content.contains(this.rightBtn)) {
				this.content.removeChild(this.rightBtn);
			}
		}
		else {
			if (!this.content.contains(this.rightBtn)) {
				this.content.addChild(this.rightBtn);
			}
		}
	}

	private synthesizeDataSource(templateData: Array<any>, dynamicData: Object, curPhase: number, curRating: number) {
		var strIndex: string = null;
		var newArr = CommonFunc.simpleCloneObj(templateData);
		var isFirst: boolean = true;
		for (var i = 0; i < newArr.length; i++) {
			strIndex = i.toString();
			if (dynamicData.hasOwnProperty(strIndex)) {
				newArr[i]["owned_endings"] = dynamicData[strIndex];
			}
			else {
				newArr[i]["owned_endings"] = [];
			}

			var arr: string[] = dynamicData[strIndex];
			if ((arr == null || arr.indexOf("-1") == -1) && isFirst) {
				isFirst = false;
				this.curPageIndex = i;
			}

			if(i == newArr.length - 1 && arr != null && arr.indexOf("-1") != -1) {
				this.curPageIndex = i;
			}

			newArr[i]["curPhase"] = curPhase;
			newArr[i]["curRating"] = curRating;
		}
		//用ArrayCollection包装
        this.dataSource = new eui.ArrayCollection(newArr);
		
	}
}