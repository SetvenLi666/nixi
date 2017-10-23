class BaseComp extends eui.Component {
	public container: eui.Group;
	public group: eui.Group;
	public energyGroup: eui.Group;
	public progressBar: eui.ProgressBar;
	public diamGroup: eui.Group;
	public diam_lab: eui.Label;
	public coinGroup: eui.Group;
	public coin_lab: eui.Label;
	public playerGroup: eui.Group;
	public nickname_lab: eui.Label;
	public energy_lab: eui.Label;
	public playerLv: eui.Image;

	private nickname: string = "";
	private coin: number = 0;
	private diam: number = 0;
	private energy: number = 0;

	public constructor(name: string, coin: number, diam: number, energy: number) {
		super();

		this.nickname = name;
		this.coin = coin;
		this.diam = diam;
		this.energy = energy;

		this.skinName = "BaseCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.container.width = DisplayMgr.stageW;
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.progressBar.maximum = 80;
		this.progressBar.minimum = 0;
		this.progressBar.slideDuration = 0;

		this.updatePlayerInfo();

		this.energyGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEnergyClicked, this);
		this.diamGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDiamClicked, this);
		this.coinGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCoinClicked, this);
		this.playerGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlayerGroup, this);

		CustomEventMgr.addEventListener("Need Update nickname", this.needUpdateNickname, this);
		CustomEventMgr.addEventListener("Update Player Info", this.updatePlayerInfo, this);
		CustomEventMgr.addEventListener("100", this.afterData_100, this);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		this.energyGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEnergyClicked, this);
		this.diamGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onDiamClicked, this);
		this.coinGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCoinClicked, this);
		this.playerGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlayerGroup, this);
		CustomEventMgr.removeEventListener("Need Update nickname", this.needUpdateNickname, this);
		CustomEventMgr.removeEventListener("Update Player Info", this.updatePlayerInfo, this);
		CustomEventMgr.removeEventListener("100", this.afterData_100, this);
	}

	private onNameClicked() {
		var self = this;
		DisplayMgr.buttonScale(this.playerGroup, function () {
			var setPanel = new SetPanel();
			DisplayMgr.set2Center(setPanel);
			self.stage.addChild(setPanel);
		});

	}

	private onCoinClicked() {
		var self = this;
		DisplayMgr.buttonScale(this.coinGroup, function () {
			var coinPanel = new ExchangePanel("coin");
			DisplayMgr.set2Center(coinPanel);
			self.stage.addChild(coinPanel);
		});
	}

	private onDiamClicked() {
		DisplayMgr.buttonScale(this.diamGroup, function () {
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.all_products_100();
			HttpMgr.postRequest(request);
		});
	}

	private onEnergyClicked() {
		var self = this;
		DisplayMgr.buttonScale(this.energyGroup, function () {
			var energyPanel = new ExchangePanel("energy");
			DisplayMgr.set2Center(energyPanel);
			self.stage.addChild(energyPanel);
		});
	}

	private onPlayerGroup() {
		var self = this;
		DisplayMgr.buttonScale(this.playerGroup, function() {
			var panel = new SetPanel();
			DisplayMgr.set2Center(panel);
			self.stage.addChild(panel);
		});
	}

	private updatePlayerInfo() {
		this.nickname_lab.text = ShowData.nickname;
		this.coin_lab.text = PlayerData.coin + "";
		this.diam_lab.text = PlayerData.diam + "";
		this.energy_lab.text = PlayerData.energy + "/80";
		this.progressBar.value = PlayerData.energy;
		this.playerLv.source = "base_lv" + PlayerData.phase + "_png";
	}

	public setPlayerLvIcon(lastLv: number) {
		this.playerLv.source = "base_lv" + lastLv + "_png";
	}

	private needUpdateNickname(evt: egret.Event) {
		this.nickname_lab.text = ShowData.nickname;
	}

	private afterData_100() {
		NetLoading.removeLoading();
		var shouchongPanel = new ShouchongPanel();
		DisplayMgr.set2Center(shouchongPanel);
		this.stage.addChild(shouchongPanel);
	}
}