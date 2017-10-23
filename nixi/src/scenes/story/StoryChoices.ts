class StoryChoices extends eui.Component implements eui.UIComponent {
	// Export -------------------------------------------------
	public isShow: Boolean = false;

	public constructor() {
		super();
		this.skinName = "resource/skins/story/StoryChoices.exml";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	public update(text1: string, text2: string, text3: string) {
		console.log("StoryChoices::update() ...");
		var self = this;
		self.isShow = true;
		var duration = 600;
		self.group1.touchChildren = false;
		self.group2.touchChildren = false;
		self.group3.touchChildren = false;

		if (text1.length > 0) {
			self.label1.text = text1;
			egret.Tween.get(self.group1).to({ x: self.originX1 }, duration).call(function () {
				self.group1.touchChildren = true;
			});
		}
		if (text2.length > 0) {
			self.label2.text = text2;
			egret.Tween.get(self.group2).wait(200).to({ x: self.originX2 }, duration).call(function () {
				self.group2.touchChildren = true;
			});
		}
		if (text3.length > 0) {
			self.label3.text = text3;
			egret.Tween.get(self.group3).wait(400).to({ x: self.originX3 }, duration).call(function () {
				self.group3.touchChildren = true;
			});
		}
	}

	// Event && Callback ---------------------------------------
	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
	}

	private onEnter() {
		this.originX1 = this.group1.x;
		this.originX2 = this.group2.x;
		this.originX3 = this.group3.x;

		this.bar1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChoose, this);
		this.bar2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChoose, this);
		this.bar3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChoose, this);

		CustomEventMgr.addEventListener("Guide_Step_5_5", this.guide_step_5_5, this);

		this.resetGroup();
	}

	private onExit() {
		CustomEventMgr.removeEventListener("Guide_Step_5_5", this.guide_step_5_5, this);
	}

	private onChoose(evt: egret.Event) {
		console.log("StoryChoices::onChoose()");
		var self = this;
		var taget = evt.currentTarget;
		var duration = 300;
		var choosed = 0;

		self.group1.touchChildren = false;
		self.group2.touchChildren = false;
		self.group3.touchChildren = false;

		if (self.bar1 === taget) {
			console.log("choose 1");
			choosed = 1;
			egret.Tween.get(self.group2).to({ alpha: 0 }, duration);
			egret.Tween.get(self.group3).to({ alpha: 0 }, duration);
		}
		if (self.bar2 === taget) {
			console.log("choose 2");
			choosed = 2;
			egret.Tween.get(self.group1).to({ alpha: 0 }, duration);
			egret.Tween.get(self.group3).to({ alpha: 0 }, duration);
		}
		if (self.bar3 === taget) {
			console.log("choose 3");
			choosed = 3;
			egret.Tween.get(self.group1).to({ alpha: 0 }, duration);
			egret.Tween.get(self.group2).to({ alpha: 0 }, duration);
		}

		egret.setTimeout(function () {
			self.resetGroup();
			var event = new egret.Event("ON_CHOOSED", true);
			event.data = choosed;
			self.dispatchEvent(event);
			self.resetGroup();
		}, self, duration + 500);
	}

	private guide_step_5_5() {
		var self = this;
		var taget = self.bar2;
		var duration = 300;
		var choosed = 0;

		choosed = 2;
		egret.Tween.get(self.group1).to({ alpha: 0 }, duration);
		egret.Tween.get(self.group3).to({ alpha: 0 }, duration);

		egret.setTimeout(function () {
			self.resetGroup();
			var event = new egret.Event("ON_CHOOSED", true);
			event.data = choosed;
			self.dispatchEvent(event);
			self.resetGroup();
		}, self, duration + 500);
	}

	// Inner --------------------------------------------------
	private group1: eui.Group = null;
	private group2: eui.Group = null;
	private group3: eui.Group = null;

	private bar1: eui.Image = null;
	private bar2: eui.Image = null;
	private bar3: eui.Image = null;

	private label1: eui.Label = null;
	private label2: eui.Label = null;
	private label3: eui.Label = null;

	private originX1: number = 0;
	private originX2: number = 0;
	private originX3: number = 0;

	private resetGroup() {
		this.group1.alpha = 1;
		this.group2.alpha = 1;
		this.group3.alpha = 1;
		this.group1.x = -DisplayMgr.stageW;
		this.group2.x = -DisplayMgr.stageW;
		this.group3.x = -DisplayMgr.stageW;

		this.isShow = false;
	}

	private showStoryBranch(segment: Object) {
		var temp = [];
		if (segment["array_1"].length > 0) {
			var choice1 = new egret.TextField();
			choice1.text = segment["array_1"];
			temp.push(choice1);
		}
		if (segment["array_2"].length > 0) {
			var choice2 = new egret.TextField();
			choice2.text = segment["array_2"];
			temp.push(choice2);
		}
		if (segment["array_3"].length > 0) {
			var choice3 = new egret.TextField();
			choice3.text = segment["array_3"];
			temp.push(choice3);
		}

		var barContainer: egret.Sprite = null;
		var bar: egret.Bitmap = null;
		var tf: egret.TextField = null;
		for (var i = 0; i < temp.length; i++) {
			barContainer = new egret.Sprite();
			DisplayMgr.setCenter(barContainer);
			barContainer.x = DisplayMgr.stageW * 0.5;
			barContainer.y = DisplayMgr.stageH * (0.35 + 0.3 / temp.length * i);

			bar = new egret.Bitmap(RES.getRes("qj_rwtiao_png"));
			barContainer.addChild(bar);

			barContainer.addChild(temp[i]);

			this.addChild(barContainer);
		}
	}
}