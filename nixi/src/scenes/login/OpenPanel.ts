class OpenPanel extends eui.Component{
	public group: eui.Group;
	public img: eui.Image;
	private index: number = 1;
	public constructor() {
		super();

		this.skinName = "OpenPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		this.img.touchEnabled = false;
		var self = this;
		egret.setTimeout(function() {
			self.img.touchEnabled = true;
		}, this, 200);
	}

	private onTouch() {
		if(this.index == 1) {
			var self = this;
			this.index = 2;
			this.img.source = "open_img_2_png";
		}else if(this.index == 2) {
			// CustomEventMgr.dispatchEventWith("Open Nickname Panel", false);
			SceneMgr.gotoMainScene();
			this.closePanel();
		}
	}

	private closePanel() {
		if(this.parent) {
			this.parent.removeChild(this);
		}
	}
}