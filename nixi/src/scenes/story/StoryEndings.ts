class StoryEndings extends eui.Component implements  eui.UIComponent {
	// Export --------------------------------------------------
	public showEnding(isPass: Boolean, achievementName: string, index: string) {
		var self = this;
		self.index = index;
		if (isPass) {
			self.showPass();
		}
		else {
			self["label"].text = achievementName;
			self.showAchievement();
		}
	}

	// Event & Callback --------------------------------------------------
	public constructor() {
		super();
		this.skinName = "resource/skins/story/StoryEndingSkin.exml";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.whenEnter, this);
	}

	// Inner --------------------------------------------------
	private index: string;
	private flowers: eui.Group = null;
	private lights: eui.Group = null;
	private pass: eui.Group = null;
	private achievement: eui.Group = null;

	protected whenEnter() {

	}

	protected partAdded(partName:string,instance:any):void {
		super.partAdded(partName,instance);
	}

	protected childrenCreated():void {
		super.childrenCreated();
	}

	private startFlowers() {
		var self = this;
		var startX = -100;
		var distance = self.flowers.width * 1.1;

		var action = function (item) {
			var duration = 2000 - Math.random() * 1200;
			var scale = 0.5 - Math.random() * 0.25;
			item.scaleX = scale;
			item.scaleY = scale;
			egret.Tween.get(item).to({x: startX}, 0).to({x: distance}, duration)
				.call(function (item) {
					action(item);
				}, self, [item]);
		}
		
		var num = self.flowers.numChildren;
		for (var i = 0; i < num; i++) {
			var item = this.flowers.getChildAt(i);			
			action(item);
		}
	}

	private startLights() {
		var self = this;
		var startX = -100;
		var distance = self.lights.width * 1.1;
		
		var action = function (item) {
			var duration = 1200 - Math.random() * 400;
			
			egret.Tween.get(item).to({x: startX}, 0).to({x: distance}, duration)
				.call(function (item) {
					action(item);
				}, self, [item]);
		}
		
		var num = self.lights.numChildren;
		for (var i = 0; i < num; i++) {
			var item = this.lights.getChildAt(i);			
			action(item);
		}
	}

	private showPass() {
		console.log("showPass");
		
		var self = this;
		egret.Tween.get(self.pass)
			.to({scaleX: 0.1, scaleY: 0.1})
			.to({y: DisplayMgr.stageH * 0.38, scaleX: 1.1, scaleY: 1.1}, 300, egret.Ease.sineIn)
			.to({y: DisplayMgr.stageH * 0.33, scaleX: 1, scaleY: 1}, 100)
			.call(function () {
				self.startFlowers();
				self.startLights();
				self.reportFinished();
			});
	}

	private showAchievement() {
		console.log("show achievement");
		var self = this;
		egret.Tween.get(self.achievement)
			.to({scaleX: 0.1, scaleY: 0.1})
			.to({y: DisplayMgr.stageH * 0.35, scaleX: 1.1, scaleY: 1.1}, 300, egret.Ease.sineIn)
			.to({y: DisplayMgr.stageH * 0.3, scaleX: 1, scaleY: 1}, 100)
			.call(function () {
				self.startFlowers();
				self.startLights();
				self.reportFinished();
				
				//时光之门
				CustomEventMgr.dispatchEventWith("Show TimeBack", false);
			});
	}

	public backAnimation() {
		var self = this;
		var num = self.flowers.numChildren;
		for (var i = 0; i < num; i++) {
			var item = this.flowers.getChildAt(i);			
			egret.Tween.removeTweens(item);
			item.x = -100;
		}

		var num2 = self.lights.numChildren;
		for (var j = 0; j < num2; j++) {
			var item2 = this.lights.getChildAt(j);			
			egret.Tween.removeTweens(item2);
			item2.x = -100;
		}

		var tw = egret.Tween.get(self.achievement);
		tw.to({y: -100}, 500, egret.Ease.backIn);
	}

	private reportFinished() {
		var self = this;
		// egret.setTimeout(function () {
		// 	var event = new egret.Event("ON_STORY_FINISH", true, false, parseInt(self.index));
		// 	self.dispatchEvent(event);
		// }, self, 2000);


		
	}
}