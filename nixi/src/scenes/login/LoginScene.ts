class LoginScene extends eui.Component {
	// Export ----------------------------------------------
	public constructor() {
		super();
		this.skinName = "resource/skins/login/LoginSkin.exml";

		this.width = DisplayMgr.stageW;

		var mask = DisplayMgr.createSceneMask();
		this.addChild(mask);
		this.mask = mask;

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.whenEnter, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.whenExit, this);
	}

	// Event && Callback -----------------------------------
	private whenEnter() {
		SoundManager.instance().startBgSound("load");
		
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.whenEnter, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.version.text = ConstData.Conf.version;
		this.login.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLogin, this);

		CustomEventMgr.addEventListener("ON_SAVE_NICKNAME", this.whenSaveNickname, this);
		CustomEventMgr.addEventListener("Open Nickname Panel", this.openNickNamePanel, this);

		CustomEventMgr.addEventListener("900", this.afterEasyLogin_900, this);
		CustomEventMgr.addEventListener("902", this.afterGameLogin_902, this);
		CustomEventMgr.addEventListener("904", this.afterSaveNickname_904, this);

		var tw_star = egret.Tween.get(this.ac_star, { loop: true });
		tw_star.to({ rotation: 360 }, 20000);
		var tw_sha = egret.Tween.get(this.ac_sha, { loop: true });
		tw_sha.to({ rotation: -360 }, 20000);

		//===============
		var panel = new RegisterPanel();
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}

	private whenExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.whenExit, this);
		CustomEventMgr.removeEventListener("ON_SAVE_NICKNAME", this.whenSaveNickname, this);
		CustomEventMgr.removeEventListener("Open Nickname Panel", this.openNickNamePanel, this);

		CustomEventMgr.removeEventListener("900", this.afterEasyLogin_900, this);
		CustomEventMgr.removeEventListener("902", this.afterGameLogin_902, this);
		CustomEventMgr.removeEventListener("904", this.afterSaveNickname_904, this);

		this.login.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onLogin, this);
		egret.Tween.removeAllTweens();
		RES.destroyRes("login");
		SoundManager.instance().destroyStartSound();
	}

	private onLogin(evt: egret.TouchEvent) {
		var self = this;
		loginImageBtn = this.login;
		var btn: egret.DisplayObject = evt.target;
		DisplayMgr.buttonScale(btn, function () {
			//按钮声音
			btn.touchEnabled = false;
			SoundManager.instance().buttonSound();

			if (LoginData.uuid == "") {
				Prompt.showPrompt(self.stage, "参数错误");
			} else {
				NetLoading.showLoading();
				var request: egret.URLRequest = HttpProtocolMgr.easyLogin_900(ConstData.Conf.channel, LoginData.uuid);
				HttpMgr.postRequest(request);
			}
			// window['ExternalInterface']['call']("callNative", "message from JS");
		});
	}

	private whenSaveNickname(evt: egret.Event) {
		NetLoading.showLoading();
		var request: egret.URLRequest = HttpProtocolMgr.saveNickname_904(evt.data);
		HttpMgr.postRequest(request);
	}

	private openNickNamePanel() {
		if ("" === ShowData.nickname) {
			var panel = new NicknamePanel();
			DisplayMgr.set2Center(panel);
			this.stage.addChild(panel);
		}
		else {
			SceneMgr.gotoMainScene();
		}
	}

	private afterEasyLogin_900(evt: egret.Event) {
		console.log("afterEasyLogin_900");
		var request: egret.URLRequest = HttpProtocolMgr.gameLogin_902(LoginData.skey);
		HttpMgr.postRequest(request);
	}

	private afterGameLogin_902(evt: egret.Event) {
		console.log("afterGameLogin_902");
		// TDGA.Account({
		// 	accountId: LoginData.uuid,
		// 	level: 1,
		// 	accountName: ShowData.nickname
		// });
		ClothesData.initTemplate(RES.getRes("clothes_json"));
		ConfigData.initConfig(RES.getRes("mission_json"));

		NetLoading.removeLoading();


		if ("" == ShowData.nickname) {
			var namePanel = new NicknamePanel();
			DisplayMgr.set2Center(namePanel);
			this.stage.addChild(namePanel);
		}
		else {
			SceneMgr.gotoMainScene();
		}

		// //引导页
		// if (PlayerData.guide == 1) {
		// 	var panel = new OpenPanel();
		// 	DisplayMgr.set2Center(panel);
		// 	this.stage.addChild(panel);
		// } else {
		// 	if ("" === ShowData.nickname) {
		// 		var namePanel = new NicknamePanel();
		// 		DisplayMgr.set2Center(namePanel);
		// 		this.stage.addChild(namePanel);
		// 	}
		// 	else {
		// 		SceneMgr.gotoMainScene();
		// 	}
		// }
	}

	private afterSaveNickname_904() {
		//是否为被邀请玩家
		// var reg = new RegExp("(^|&)" + "isid" + "=([^&]*)(&|$)");
		// var r = window.location.search.substr(1).match(reg);
		// if (r != null) {
		// 	var sid = decodeURI(r[2]);
		// 	var request = HttpProtocolMgr.post_inviter_sid_166(sid);
		// 	HttpMgr.postRequest(request);
		// }

		NetLoading.removeLoading();

		if (PlayerData.guide == 1) {
			var panel = new OpenPanel();
			DisplayMgr.set2Center(panel);
			this.stage.addChild(panel);
		} else {
			// window['ExternalInterface']['call']("callNative", "message from JS");
			// window['ExternalInterface']['call']("callNative", "message from JS");
			// window['ExternalInterface']['call']("callNative", "message from JS");
			SceneMgr.gotoMainScene();
		}
	}

	// Inner -----------------------------------------------
	public group: eui.Group;
	private version: eui.Label;
	private ac_star: eui.Image;
	private ac_sha: eui.Image;
	private login: eui.Image;

	private testHttp() {
		console.log("test http()");

		var urlreq2: egret.URLRequest = new egret.URLRequest();
		urlreq2.url = "http://httpbin.org/post";
		urlreq2.method = egret.HttpMethod.POST;

		HttpMgr.postRequest(urlreq2);
	}
}

var loginImageBtn: eui.Image;