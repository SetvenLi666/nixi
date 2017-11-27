class SoundManager {
	private static _instance: SoundManager = null;
	public static instance(): SoundManager {
		if (!this._instance) {
			this._instance = new SoundManager();
		}

		return this._instance;
	}

	private _buttonSound: egret.Sound = null;
	private _popSound: egret.Sound = null;
	private _buySound: egret.Sound = null;
	private _flipSound: egret.Sound = null;
	public buttonSound(type?: string) {
		var soundType = "";
		if (!type) {
			soundType = "button";
		} else {
			soundType = type;
		}
		switch (type) {
			case "pop":
				if (!this._popSound) {
					this._popSound = RES.getRes("pop_wav");
				}

				this._popSound.play(0, 1);
				break;
			case "buy":
				if (!this._buySound) {
					this._buySound = RES.getRes("buy_wav");
				}

				this._buySound.play(0, 1);
				break;
			case "flip":
				if (!this._flipSound) {
					this._flipSound = RES.getRes("flip_wav");
				}

				this._flipSound.play(0, 1);
				break;
			default:
				if (!this._buttonSound) {
					this._buttonSound = RES.getRes("button_wav");
				}

				this._buttonSound.play(0, 1);
				break;
		}
	}

	private _loadSoundBg: egret.Sound = null;
	private _mainSoundBg: egret.Sound = null;
	private _taskSoundBg: egret.Sound = null;
	private _storySoundBg: egret.Sound = null;
	private _soundChannel: egret.SoundChannel = null;
	private _curBgSoundType: string = "";
	public startBgSound(type: string) {
		var self = this;
		var delay: number = 5000;
		var url: string = "";
		var sound: egret.Sound = null;
		this._curBgSoundType = type;
		switch (type) {
			case "load":
				url = "resource/game/audio/start_bg.mp3";
				sound = this._loadSoundBg;
				break;
			case "main":
				url = "resource/game/audio/main_bg.mp3";
				sound = this._mainSoundBg;
				break;
			case "task":
				url = "resource/game/audio/task_bg.mp3";
				sound = this._taskSoundBg;
				break;
			case "story":
				url = "resource/game/audio/story_bg.mp3";
				sound = this._storySoundBg;
				break;
		}
		var soundChannel: egret.SoundChannel = null;
		if (!sound) {
			var loader: egret.URLLoader = new egret.URLLoader();
			loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
			loader.addEventListener(egret.Event.COMPLETE, function loadOver(event: egret.Event) {
				sound = loader.data;
				self._soundChannel = sound.play(0, 1);
				self._soundChannel.addEventListener(egret.Event.SOUND_COMPLETE, self.bgSoundComplete, self);
			}, this);
			loader.load(new egret.URLRequest(url));
		} else {
			egret.setTimeout(function () {
				this._soundChannel = sound.play(0, 1);
				this._soundChannel.addEventListener(egret.Event.SOUND_COMPLETE, self.bgSoundComplete, self);
			}, this, delay);
		}
	}

	private bgSoundComplete() {
		this.startBgSound(this._curBgSoundType);
	}

	public destroyStartSound() {
		if (this._soundChannel) {
			this._soundChannel.stop();
			this._soundChannel = null;
			this._curBgSoundType = "";
		}
	}
}