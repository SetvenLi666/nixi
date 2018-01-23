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
		// if (ConstData.Conf.whiteList.indexOf(LoginData.sid) != -1 || window["OPEN_DATA"].openid == "aaaa") {

		// } else {
		// 	return;
		// }

		var soundType = "";
		if (!type) {
			soundType = "button";
		} else {
			soundType = type;
		}

		switch (soundType) {
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
			case "button":
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
	private _timeOutkey: number = null;
	private isLoop: boolean = false;
	private _pause_position: number = 0;

	public startBgSound(type: string) {
		// if (ConstData.Conf.whiteList.indexOf(LoginData.sid) != -1 || window["OPEN_DATA"].openid == "aaaa") {

		// } else {
		// 	return;
		// }

		if (type == "main" && this._soundChannel != null && !this.isLoop) {
			console.log("main music is playing");
			return;
		}

		if (type == "story" && this._soundChannel != null && !this.isLoop) {
			console.log("story music is playing");
			return;
		}

		this.isLoop = false;

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
				switch (type) {
					case "load":
						self._loadSoundBg = sound;
						break;
					case "main":
						self._mainSoundBg = sound;
						break;
					case "task":
						self._taskSoundBg = sound;
						break;
					case "story":
						self._storySoundBg = sound;
						break;
				}

				self._soundChannel = sound.play(0, 1);
				self._soundChannel.addEventListener(egret.Event.SOUND_COMPLETE, self.bgSoundComplete, self);
			}, this);
			loader.load(new egret.URLRequest(url));
		} else {
			// console.log("sound is null");
			// this._timeOutkey = egret.setTimeout(function () {
			// 	this._soundChannel = sound.play(0, 1);
			// 	this._soundChannel.addEventListener(egret.Event.SOUND_COMPLETE, self.bgSoundComplete, self);
			// }, this, delay);

			this._soundChannel = sound.play(0, 1);
			this._soundChannel.addEventListener(egret.Event.SOUND_COMPLETE, self.bgSoundComplete, self);
		}
	}

	private bgSoundComplete() {
		// if (this._timeOutkey) {
		// 	egret.clearTimeout(this._timeOutkey);
		// }

		this.isLoop = true;
		this.startBgSound(this._curBgSoundType);
	}

	public destroyStartSound() {
		// if (ConstData.Conf.whiteList.indexOf(LoginData.sid) != -1 || window["OPEN_DATA"].openid == "aaaa") {

		// } else {
		// 	return;
		// }

		if (this._soundChannel) {
			this._soundChannel.stop();
			this._soundChannel = null;
			this._curBgSoundType = "";
		}
	}

	public pauseSound() {
		// if (ConstData.Conf.whiteList.indexOf(LoginData.sid) != -1 || window["OPEN_DATA"].openid == "aaaa") {

		// } else {
		// 	return;
		// }

		if (this._soundChannel) {
			this._pause_position = this._soundChannel.position;
			this._soundChannel.stop();
			this._soundChannel = null;
		}
	}

	public replaySound() {
		// if (ConstData.Conf.whiteList.indexOf(LoginData.sid) != -1 || window["OPEN_DATA"].openid == "aaaa") {

		// } else {
		// 	return;
		// }

		console.log(this._soundChannel);
		if(this._soundChannel) {
			return;
		}

		if (this._curBgSoundType == "main") {
			this._soundChannel = this._mainSoundBg.play(this._pause_position, 1);
			this._soundChannel.addEventListener(egret.Event.SOUND_COMPLETE, this.bgSoundComplete, this);
		} else if (this._curBgSoundType == "story") {
			this._soundChannel = this._storySoundBg.play(this._pause_position, 1);
			this._soundChannel.addEventListener(egret.Event.SOUND_COMPLETE, this.bgSoundComplete, this);
		}
	}
}