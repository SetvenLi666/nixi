class SubtitlePanel extends eui.Component implements  eui.UIComponent {
	// Export -------------------------------------------------
	public isUpdating: Boolean = false;

	public constructor() {
		super();
		this.skinName = "resource/skins/story/SubtitleSkin.exml";

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.whenEnter, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.whenExit, this);
	}
	
	public init(callback: Function, handler: Object) {
		this.playCompleteCallback = callback;
		this.playCompleteHandler = handler;
	}

	public play(name: string, text: string) {
		console.log("SubtitlePanel::play() - ");
		var self = this;
		
		this.hideTapFlag();

		if ("" === name) {
			self.namePlate.visible = false;
		}
		else {
			self.curFullText = text;
			self.lblName.text = name;
			self.namePlate.visible = true;
		}

		self.curFullText = text;
		var len = text.length;
		self.timer = new egret.Timer(ConstData.Conf.StoryTextFlashInterval, len);
		var count = 0;
		 //注册事件侦听器
        self.timer.addEventListener(egret.TimerEvent.TIMER, function () {
			self.isUpdating = true;
			count++;
			self.lblSubtitle.text = self.curFullText.substr(0, count);
		}, self);

        self.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
			self.timer = null;
			self.isUpdating = false;
			self.showTapFlag();
			self.playCompleteCallback.apply(self.playCompleteHandler, []);
		}, self);
        //开始计时
        self.timer.start();
	}

	public fastPlay(name: string, text: string) {
		this.hideTapFlag();

		if ("" === name) {
			this.namePlate.visible = false;
		}
		else {
			this.lblName.text = name;
			this.namePlate.visible = true;
		}

		this.curFullText = text;
		this.lblSubtitle.text = text;
		console.log(this.lblSubtitle);
	}

	public spring() {
		this.isUpdating = false;
		if (this.timer !== null) {
			this.timer.stop();
			this.timer = null;
		}

		this.lblSubtitle.text = this.curFullText;
		console.log(this.curFullText);
		this.showTapFlag();
		this.playCompleteCallback.apply(this.playCompleteHandler, []);
	}

	public showTapFlag() {
		// if (! this.contains(this.tapFlag)) {
		// 	this.addChild(this.tapFlag);
		// }
		// this.tapFlag.play(-1);
		this.tagImg.visible = true;
	}

	public hideTapFlag() {
		// this.tapFlag.stop();
		// if (this.contains(this.tapFlag)) {
		// 	this.removeChild(this.tapFlag);
		// }
		this.tagImg.visible = false;
	}

	// Event && Callback ---------------------------------------
	protected partAdded(partName:string,instance:any):void {
		super.partAdded(partName,instance);
	}

	protected childrenCreated():void {
		super.childrenCreated();

		// var data = RES.getRes("tapflag_json");
		// var tex = RES.getRes("tapflag_png");
		// var mcf:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, tex);
		// this.tapFlag = new egret.MovieClip(mcf.generateMovieClipData());
		// this.tapFlag.x = 530;
		// this.tapFlag.y = 205;
		// this.addChild(this.tapFlag);
		var tw = egret.Tween.get(this.tagImg, { loop: true });
		tw.to({ alpha: 0 }, 500)
			.wait(150)
			.to({ alpha: 1 }, 500)
			.wait(150);
	}

	private whenEnter() {
		this.cbFastPlay.selected = false;
		this.cbAutoPlay.selected = false;
		this.namePlate.visible = false;
		this.lblName.text = "";
		this.lblSubtitle.text = "";
		this.timer = null;
		this.curFullText = "";
		this.hideTapFlag();
		console.log("whenenter", this.curFullText);

		this.cbFastPlay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFastPlay, this);
		this.cbAutoPlay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAutoPlay, this);
		this.btnLog.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnLog, this);
		this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);
	}

	private whenExit() {
		this.cbFastPlay.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onFastPlay, this);
		this.cbAutoPlay.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onAutoPlay, this);
		this.btnLog.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnLog, this);
		this.btnShare.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);
	}

	private onFastPlay(evt: egret.TouchEvent) {
		SoundManager.instance().buttonSound();
		var btn: eui.CheckBox = evt.target;
		this.dispatchEvent(new egret.Event("ON_FAST_PLAY", true, true, btn.selected));
		this.cbAutoPlay.selected = false;
	}

	private onAutoPlay(evt: egret.TouchEvent) {
		SoundManager.instance().buttonSound();
		var btn: eui.CheckBox = evt.target;
		this.dispatchEvent(new egret.Event("ON_AUTO_PLAY", true, true, btn.selected));
		this.cbFastPlay.selected = false;
	}

	private onBtnLog(evt: Event) {
		var self = this;
		DisplayMgr.buttonScale(evt.target, function () {
			SoundManager.instance().buttonSound();
			self.dispatchEvent(new egret.Event("ON_HISTORY", true));
		})
	}

	private onShare() {
		DisplayMgr.buttonScale(this.btnShare, function() {
			console.log("story share");
			ShareData.share("story");
		});
	}

	// Inner --------------------------------------------------
	public cbFastPlay: eui.CheckBox;
	public cbAutoPlay: eui.CheckBox;
	public btnLog: eui.Button;
	private namePlate: eui.Group;
	private lblName: eui.Label;
	public lblSubtitle: eui.Label;
	private tapFlag: egret.MovieClip = null;
	private tagImg: eui.Image;
	private timer: egret.Timer = null;
	private curFullText: string = "";

	private playCompleteCallback: Function;
	private playCompleteHandler: Object;

	public btnShare: eui.Image;
}