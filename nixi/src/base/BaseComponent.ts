/**
 *
 * @author 
 *
 */
class BaseComponent extends eui.Component {
	// Export --------------------------------------------------

	// Event & Callback --------------------------------------------------
	public constructor(name: string, coin: number, diam: number, energy: number) {
		super();
		egret.log("BaseComponent constructor");
		var self = this;
		self.skinName = "BaseSkin";
		self.addEventListener(egret.Event.ADDED_TO_STAGE, function () {
			self.container.width = DisplayMgr.stageW;
			self.group_2.width = Math.min(DisplayMgr.stageW, 852);

			self.nameComp.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onNameClicked, self);
			self.coinComp.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onCoinClicked, self);
			self.diamComp.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onDiamClicked, self);
			self.energyComp.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onEnergyClicked, self);

			CustomEventMgr.addEventListener("Need Update nickname", self.needUpdateNickname, self);
			CustomEventMgr.addEventListener("Update Player Info", self.updatePlayerInfo, self);
			CustomEventMgr.addEventListener("100", self.afterData_100, self);

			self.nameComp["label"].text = name;
			self.coinComp["label"].text = coin;
			self.diamComp["label"].text = diam;
			self.energyComp["label"].text = energy;
		}, self);
		self.addEventListener(egret.Event.REMOVED_FROM_STAGE, self.atExit, self);
	}

	// Inner --------------------------------------------------
	public container: eui.Group;
	public group_2: eui.Group;
	private data: {} = {};
	private nameComp: eui.Component;
	private coinComp: eui.Component;
	private diamComp: eui.Component;
	private energyComp: eui.Component;
	private countDown: eui.Component;

	private atExit() {
		CustomEventMgr.removeEventListener("Need Update nickname", this.needUpdateNickname, this);
		CustomEventMgr.removeEventListener("Update Player Info", this.updatePlayerInfo, this);
		CustomEventMgr.removeEventListener("100", this.afterData_100, this);
	}

	private updatePlayerInfo(evt: egret.Event) {
		this.coinComp["label"].text = PlayerData.coin;
		this.diamComp["label"].text = PlayerData.diam;
		this.energyComp["label"].text = PlayerData.energy;
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

	private onEnergyClicked() {
		var self = this;
		DisplayMgr.buttonScale(this.energyComp, function () {
			var energyPanel = new ExchangePanel("energy");
			DisplayMgr.set2Center(energyPanel);
			self.stage.addChild(energyPanel);
		});
	}

	private afterData_100() {
		NetLoading.removeLoading();
		var shouchongPanel = new ShouchongPanel();
		DisplayMgr.set2Center(shouchongPanel);
		this.stage.addChild(shouchongPanel);
	}
}
