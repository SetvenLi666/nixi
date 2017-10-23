class DressBaseComp extends eui.Component {
	public container: eui.Group;
	public group_2: eui.Group;
	public nameComp: eui.Component;
	public coinComp: eui.Component;
	public diamComp: eui.Component;
	public debrisComp: eui.Component;

	public constructor(name: string, coin: number, diam: number, debris: number) {
		super();

		this.skinName = "DressBaseCompSkin";
		this.nameComp["label"].text = name;
		this.coinComp["label"].text = coin;
		this.diamComp["label"].text = diam;
		this.debrisComp["label"].text = debris;
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.container.width = DisplayMgr.stageW;
		this.group_2.width = Math.min(DisplayMgr.stageW, 852);

		this.nameComp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNameClicked, this);
		this.coinComp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCoinClicked, this);
		this.diamComp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDiamClicked, this);
		// this.debrisComp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDebrisClicked, this);

		CustomEventMgr.addEventListener("Need Update nickname", this.needUpdateNickname, this);
		CustomEventMgr.addEventListener("Update Player Info", this.updatePlayerInfo, this);
		CustomEventMgr.addEventListener("100", this.afterData_100, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("Need Update nickname", this.needUpdateNickname, this);
		CustomEventMgr.removeEventListener("Update Player Info", this.updatePlayerInfo, this);
		CustomEventMgr.removeEventListener("100", this.afterData_100, this);
	}

	private updatePlayerInfo(evt: egret.Event) {
		this.coinComp["label"].text = PlayerData.coin;
		this.diamComp["label"].text = PlayerData.diam;
		this.debrisComp["label"].text = GashaponData.gashapon["piece"];
	}

	private needUpdateNickname(evt: egret.Event) {
		this.nameComp["label"].text = ShowData.nickname;
	}

	private onNameClicked() {
		var self = this;
		DisplayMgr.buttonScale(this.nameComp, function () {
			var setPanel = new SetPanel();
			DisplayMgr.set2Center(setPanel);
			self.stage.addChild(setPanel);
		});

	}

	private onCoinClicked() {
		var self = this;
		DisplayMgr.buttonScale(this.coinComp, function () {
			var coinPanel = new ExchangePanel("coin");
			DisplayMgr.set2Center(coinPanel);
			self.stage.addChild(coinPanel);
		});
	}

	private onDiamClicked() {
		DisplayMgr.buttonScale(this.diamComp, function () {
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.all_products_100();
			HttpMgr.postRequest(request);
		});
	}

	private onDebrisClicked() {
		// var self = this;
		// DisplayMgr.buttonScale(this.debrisComp, function () {
		// 	var energyPanel = new ExchangePanel("energy");
		// 	DisplayMgr.set2Center(energyPanel);
		// 	self.stage.addChild(energyPanel);
		// });
	}

	private afterData_100() {
		NetLoading.removeLoading();
		var shouchongPanel = new ShouchongPanel();
		DisplayMgr.set2Center(shouchongPanel);
		this.stage.addChild(shouchongPanel);
	}
}