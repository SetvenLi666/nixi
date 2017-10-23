class ExchangePanel extends eui.Component {
	public group: eui.Group;
	public exchangeComp: ExchangeComp;
	private type: string;

	public constructor(type: string) {
		super();

		this.type = type;
		this.skinName = "ExchangePanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		if (this.type == "coin") {
			if (PurchaseData.coin_times >= PurchaseData.coin_limit) {
				this.exchangeComp.title.text = "已达今日金币兑换次数上限~";
			} else {
				this.exchangeComp.title.text = "使用" + PurchaseData.coin_cost + "钻石兑换" + PurchaseData.coin_gain + "金币";
			}

			this.exchangeComp.tip.text = "今日已兑换" + PurchaseData.coin_times + "/" + PurchaseData.coin_limit + "次";
		} else if (this.type = "energy") {
			if (PurchaseData.energy_times >= PurchaseData.energy_limit) {
				this.exchangeComp.title.text = "已达今日体力兑换次数上限~";
			} else {
				this.exchangeComp.title.text = "使用" + PurchaseData.energy_cost + "钻石兑换" + PurchaseData.energy_gain + "点体力";
			}

			this.exchangeComp.tip.text = "今日已兑换" + PurchaseData.energy_times + "/" + PurchaseData.energy_limit + "次";
		}

		this.exchangeComp.btn_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel, this);
		this.exchangeComp.btn_confirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirm, this);

		CustomEventMgr.addEventListener("101", this.afterData_101, this);
		CustomEventMgr.addEventListener("103", this.afterData_103, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("101", this.afterData_101, this);
		CustomEventMgr.removeEventListener("103", this.afterData_103, this);
	}

	private onTouch(evt: egret.TouchEvent) {
		var rectRangle = this.exchangeComp.getTransformedBounds(this.stage);
		if (!rectRangle.contains(evt.stageX, evt.stageY)) {
			this.closePanel();
		}
	}

	private onCancel() {
		this.closePanel();
	}

	private onConfirm() {
		if (this.type == "coin") {
			if (PurchaseData.coin_times >= PurchaseData.coin_limit) {
				Prompt.showPrompt(this.stage, "今日金币兑换次数已达上限");
			} else {
				NetLoading.showLoading();
				var request = HttpProtocolMgr.exchange_coin_103();
				HttpMgr.postRequest(request);
			}
		} else if (this.type == "energy") {
			if (PlayerData.energy >= 100) {
				Prompt.showPrompt(this.stage, "体力已满");
			} else {
				if (PurchaseData.energy_times >= PurchaseData.energy_limit) {
					Prompt.showPrompt(this.stage, "今日体力兑换次数已达上限");
				} else {
					NetLoading.showLoading();
					var request = HttpProtocolMgr.buy_energy_101();
					HttpMgr.postRequest(request);
				}
			}

		}
	}

	private afterData_101() {
		NetLoading.removeLoading();
		Prompt.showPrompt(this.stage, "成功兑换体力~!");
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		this.closePanel();
	}

	private afterData_103() {
		NetLoading.removeLoading();
		Prompt.showPrompt(this.stage, "成功兑换金币~!");
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		this.closePanel();
	}

	private closePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}