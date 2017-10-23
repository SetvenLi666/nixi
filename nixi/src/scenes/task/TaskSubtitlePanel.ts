class TaskSubtitlePanel extends eui.Component implements  eui.UIComponent {
	// Export --------------------------------------------------
	public constructor() {
		super();

		this.skinName = "resource/skins/task/TaskSubtitleSkin.exml";
	}

	public fastPlay(dialog) {
		if ("stoped" === this.currentState) {
			return false;
		}
		else {
			this.dialog = dialog;
			this.currentState = "idle";
			this.spring();
			return true;
		}
	}

	//@ return: 是否开始新的对话
	public playing(dialog: Object): Boolean {
		if ("init" === this.currentState) {
			this.btnHistory.touchEnabled = true;
			this.btnFastPlay.touchChildren = true;
			this.currentState = "playing"
			this.dialog = dialog;
			this.playingSubtitle();
			return true;
		}
		else if ("playing" === this.currentState) {
			this.currentState = "idle";
			this.spring();
			return false;
		}
		else if ("idle" === this.currentState) {
			this.currentState = "playing"
			this.dialog = dialog;
			this.playingSubtitle();
			return true;
		}
		else if ("stoped" === this.currentState) {
			return false;
		}
	}

	public endDialog() {
		this.spring();
		this.currentState = "stoped";
		this.tapFlag.visible = false;
	}

	public reset() {
		this.btnHistory.touchEnabled = false;
		this.btnFastPlay.selected = false;
		this.lblSubtitle.text = "";
		this.tapFlag.visible = false;
		this.currentState = "init";
	}

	// Event & Callback --------------------------------------------------
	protected partAdded(partName:string,instance:any):void {
		super.partAdded(partName,instance);
	}

	protected childrenCreated():void {
		super.childrenCreated();

		var data = RES.getRes("tapflag_json");
		var tex = RES.getRes("tapflag_png");
		var mcf:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, tex);
		this.tapFlag = new egret.MovieClip(mcf.generateMovieClipData());
		this.tapFlag.x = 540;
		this.tapFlag.y = 200;
		this.addChild(this.tapFlag);
		this.tapFlag.play(-1);
		this.tapFlag.visible = false;

		// touches
		this.touchEnabled = false;		
		var len = this.numChildren;
		for (var i = 0; i < len; i++) {
			this.getChildAt(i).touchEnabled = false;
		}
		// display
		this.currentState = "init";

		this.btnHistory.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHistory, this);
		this.btnFastPlay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnFastPlay, this);
	}

	private onBtnHistory(evt: egret.TouchEvent) {
		console.log("TaskSubtitlePanel::onBtnHistory() ...");
		CustomEventMgr.dispatchEventWith("NEED_SHOW_HISTORY");
	}

	private onBtnFastPlay(evt: egret.Event) {
		console.log("TaskSubtitlePanel::onBtnFastPlay() ...");
		CustomEventMgr.dispatchEventWith("ON_TOGGLE_FASTPLAY", false, this.btnFastPlay.selected);
	}

	
	// Inner --------------------------------------------------
	private dialog: {} = null;
	private btnHistory: eui.Image;
	private btnFastPlay: eui.ToggleButton;
	private lblSubtitle: eui.Label;
	private timer: egret.Timer;
	private tapFlag: egret.MovieClip = null;

	private playingSubtitle() {
		var self = this;
		this.tapFlag.visible = false;
		var said: string = self.dialog["said"];
		var count: number = 0;
		//注册事件侦听器
		self.timer = new egret.Timer(ConstData.Conf.StoryTextFlashInterval, said.length);
        self.timer.addEventListener(egret.TimerEvent.TIMER, function () {
			count++;
			self.lblSubtitle.text = said.substr(0, count);
		}, self);

        self.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
			self.timer = null;
			this.tapFlag.visible = true;
			this.currentState = "idle";
		}, self);
        //开始计时
        self.timer.start();
	}

	public spring() {
		if (this.timer !== null) {
			this.timer.stop();
			this.timer = null;
		}

		this.lblSubtitle.text = this.dialog["said"];
		this.tapFlag.visible = true;
		this.currentState = "idle";
	}

}