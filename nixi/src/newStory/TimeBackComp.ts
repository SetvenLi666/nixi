class TimeBackComp extends eui.Component{
	public img_effect: eui.Image;
	
	public constructor() {
		super();

		this.skinName = "TimeBackCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.anchorOffsetX = this.width / 2;
		this.anchorOffsetY = this.height / 2;
		this.scaleX = 0;
		this.scaleY = 0;
		this.touchEnabled = false;

		var self = this;
		var tw = egret.Tween.get(this);
		tw.to({scaleX: 1, scaleY: 1}, 500, egret.Ease.backOut)
			.call(function() {
				self.touchEnabled = true;
				self.effectAnimation();
			});
	}

	private effectAnimation() {
		var tw = egret.Tween.get(this.img_effect, {loop: true});
		tw.to({rotation: 180, scaleX: 0.6, scaleY: 0.6}, 8000)
			.to({rotation: 360, scaleX: 1, scaleY: 1}, 8000);
	}
}