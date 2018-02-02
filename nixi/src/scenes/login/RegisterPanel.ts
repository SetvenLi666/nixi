class RegisterPanel extends eui.Component {
	public group: eui.Group;
	public loginGroup: eui.Group;
	public btn_login: eui.Image;
	public btn_register: eui.Image;
	public login_account: eui.EditableText;
	public login_password: eui.EditableText;
	public registerGroup: eui.Group;
	public btn_create: eui.Image;
	public btn_back: eui.Image;
	public register_account: eui.EditableText;
	public register_password1: eui.EditableText;
	public register_password2: eui.EditableText;

	public constructor() {
		super();

		this.skinName = "RegisterPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(852, DisplayMgr.stageW);

		if(egret.localStorage.getItem("account")) {
			this.login_account.text = egret.localStorage.getItem("account");
		}

		this.btn_login.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLogin, this);
		this.btn_create.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCreate, this);
		this.btn_register.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gotoRegister, this);
		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackToLogin, this);

		CustomEventMgr.addEventListener("901", this.result_of_901, this);
		CustomEventMgr.addEventListener("903", this.result_of_903, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("901", this.result_of_901, this);
		CustomEventMgr.removeEventListener("903", this.result_of_903, this);
	}

	private onLogin() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_login, function () {
			SoundManager.instance().buttonSound();
			var account = self.login_account.text;
			var password = self.login_password.text;
			if(account == "") {
				Prompt.showPrompt(self.stage, "请输入账号");
				return;
			}
			if(password == "") {
				Prompt.showPrompt(self.stage, "请输入密码");
				return;
			}

			NetLoading.showLoading();
			var request = HttpProtocolMgr.accountLogin_901(self.login_account.text, self.login_password.text);
			HttpMgr.postRequest(request);
		})
	}

	private onCreate() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_create, function() {
			SoundManager.instance().buttonSound();
			var account = self.register_account.text;
			var password1 = self.register_password1.text;
			var password2 = self.register_password2.text;
			if(account == "") {
				Prompt.showPrompt(self.stage, "请输入账号");
				return;
			}

			if(password1 != password2) {
				Prompt.showPrompt(self.stage, "密码不一致，请重新输入");
				return;
			}

			NetLoading.showLoading();
			var request = HttpProtocolMgr.registerAccount_903(account, password1);
			HttpMgr.postRequest(request);
		});
	}

	private gotoRegister() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_register, function () {
			SoundManager.instance().buttonSound();
			self.loginGroup.visible = false;
			self.registerGroup.visible = true;
		});
	}

	private onBackToLogin() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_back, function () {
			SoundManager.instance().buttonSound();
			self.registerGroup.visible = false;
			self.loginGroup.visible = true;
		});
	}

	private result_of_901() {
		//登陆成功
		// Prompt.showPrompt(this.stage, "登陆成功");
		var request: egret.URLRequest = HttpProtocolMgr.gameLogin_902(LoginData.skey);
		HttpMgr.postRequest(request);
		
		if(this.parent) {
			this.parent.removeChild(this);
		}
	}

	private result_of_903() {
		//注册成功
		NetLoading.removeLoading();
		Prompt.showPrompt(this.stage, "注册成功");
		egret.localStorage.setItem("account", this.register_account.text);
		// egret.localStorage.setItem("password", this.register_password1.text);
		this.login_account.text = this.register_account.text;
		this.login_password.text = this.register_password1.text;
		this.registerGroup.visible = false;
		this.loginGroup.visible = true;
	}
}