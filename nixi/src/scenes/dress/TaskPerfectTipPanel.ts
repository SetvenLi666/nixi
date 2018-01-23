class TaskPerfectTipPanel extends eui.Component {
	public group: eui.Group;
	public group2: eui.Group;
	public item_1: PerfectTipItem;
	public item_2: PerfectTipItem;
	public item_3: PerfectTipItem;
	public item_4: PerfectTipItem;
	public item_5: PerfectTipItem;
	public item_6: PerfectTipItem;
	public item_7: PerfectTipItem;
	public item_8: PerfectTipItem;
	public item_9: PerfectTipItem;
	public clothesName: eui.Label;
	public starsGroup: eui.Group;
	public clothesDesc: eui.Label;
	public diamCost: eui.Label;
	public coinCost: eui.Label;
	public btnBuy: eui.Image;

	private clothes_data: string[];
	private isAllOwn: boolean = true;

	public constructor(clothes_data: string[]) {
		super();

		this.clothes_data = clothes_data;
		this.skinName = "TaskPerfectTipPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.group.width = Math.min(852, DisplayMgr.stageW);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

		this.initView();

		CustomEventMgr.addEventListener("Update Total Price", this.updateTotalPrice, this);
	}

	private initView() {
		var total_coin: number = 0;
		var total_diam: number = 0;
		for (var i = 1; i < 10; i++) {
			var item: PerfectTipItem = this["item_" + i];
			if (this.clothes_data[i - 1]) {
				item.icon.source = "icon" + this.clothes_data[i - 1] + "_png";
				if (ClothesData.hasOwnedClohtes(parseInt(this.clothes_data[i - 1]))) {
					item.currentState = "state_2";
				} else {
					item.currentState = "state_1";
					this.isAllOwn = false;
					var clothes_item = ClothesData.clothesTemplateData(this.clothes_data[i - 1][0], this.clothes_data[i - 1]);
					if (clothes_item["type"] == "1") {
						item.costType.source = "shopUI_json.shop_ui_coin2";
						item.costLabel.text = clothes_item["cost"];
						total_coin += parseInt(clothes_item["cost"]);
						item.data = clothes_item;
					} else if (clothes_item["type"] == "2") {
						item.costType.source = "shopUI_json.shop_ui_diam2";
						item.costLabel.text = clothes_item["cost"];
						total_diam += parseInt(clothes_item["cost"]);
						item.data = clothes_item;
					} else {
						item.currentState = "state_3";
					}
				}
			} else {
				item.currentState = "state_0";
			}
		}

		this.coinCost.text = "" + total_coin;
		this.diamCost.text = "" + total_diam;

		var firstItem = ClothesData.clothesTemplateData(this.clothes_data[0][0], this.clothes_data[0]);
		this.clothesName.text = firstItem["name"];
		this.clothesDesc.text = firstItem["label"];

		var phase: number = parseInt(firstItem["phase"]);
		for (var j = 0; j < phase; j++) {
			var star = new eui.Image("shopUI_json.shop_ui_star");
			this.starsGroup.addChild(star);
		}

		if (this.isAllOwn) {
			this.btnBuy.source = "dress_tasktip_btn_dress_png";
		} else {
			this.btnBuy.source = "dress_tasktip_btn_buy_png";
		}

		this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
	}

	private onBuy() {
		var self = this;
		DisplayMgr.buttonScale(this.btnBuy, function () {
			SoundManager.instance().buttonSound("buy");

			if (self.isAllOwn) {
				//一键穿搭
				CustomEventMgr.dispatchEventWith("Dress Suit", false, self.clothes_data);
				self.closePanel();
			} else {
				//一键购买
				if(self.coinCost.text == "0" && self.diamCost.text == "0") {
					Prompt.showPrompt(self.stage, "没有可供购买的衣服!");
					return;
				}

				var ondress = CommonFunc.simpleCloneObj(ClothesData.ondressCache);
				var ornaments = CommonFunc.simpleCloneObj(ClothesData.ornamentsCache);
				var len = self.clothes_data.length;
				for (var i = 0; i < len; i++) {
					var item = ClothesData.clothesTemplateData(self.clothes_data[i][0], self.clothes_data[i]);
					if (item["type"] == "1" || item["type"] == "2") {
						if (item["part"] != "7") {
							ondress[item["part"]] = parseInt(self.clothes_data[i]);
						} else {
							ornaments[item["sub_part"]] = parseInt(self.clothes_data[i]);
						}
					}else {
						//非卖品
					}
				}

				NetLoading.showLoading();
				TaskData.isBuyOf403 = true;
				var request: egret.URLRequest;
				request = HttpProtocolMgr.new_save_dressed_403(ondress, ornaments);

				HttpMgr.postRequest(request);
			}
		});
	}

	private updateTotalPrice() {
		var total_coin: number = 0;
		var total_diam: number = 0;
		this.isAllOwn = true;
		for (var i = 1; i < 10; i++) {
			var item: PerfectTipItem = this["item_" + i];
			if (this.clothes_data[i - 1]) {
				if (ClothesData.hasOwnedClohtes(parseInt(this.clothes_data[i - 1]))) {
					item.currentState = "state_2";
				} else {
					item.currentState = "state_1";
					this.isAllOwn = false;
					var clothes_item = ClothesData.clothesTemplateData(this.clothes_data[i - 1][0], this.clothes_data[i - 1]);
					if (clothes_item["type"] == "1") {
						total_coin += parseInt(clothes_item["cost"]);
					} else if (clothes_item["type"] == "2") {
						total_diam += parseInt(clothes_item["cost"]);
					} else {
						item.currentState = "state_3";
					}
				}
			} else {
				item.currentState = "state_0";
			}
		}

		if (this.isAllOwn) {
			this.btnBuy.source = "dress_tasktip_btn_dress_png";
		} else {
			this.btnBuy.source = "dress_tasktip_btn_buy_png";
		}

		this.coinCost.text = "" + total_coin;
		this.diamCost.text = "" + total_diam;
	}

	private onTap(evt: egret.TouchEvent) {
		var rectAngle = this.group2.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.closePanel();
		}
	}

	private closePanel() {
		if (this.parent) {
			TaskData.isBuyOf403 = false;
			this.parent.removeChild(this);
		}
	}
}


class PerfectTipItem extends eui.Component {
	public icon: eui.Image;
	public costType: eui.Image;
	public costLabel: eui.Label;
	public btnBuy: eui.Image;
	public data: {} = null;

	public constructor() {
		super();

		this.skinName = "PerfectTipItemSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
	}

	private onBuy() {
		var self = this;
		DisplayMgr.buttonScale(this.btnBuy, function () {
			SoundManager.instance().buttonSound("buy");

			if (!self.data) {
				return;
			}

			if (PlayerData.phase < parseInt(self.data["phase"])) {
				Prompt.showPrompt(self.stage, "等级不足，无法购买!");
				return;
			}

			if (ClothesData.clothesParts.indexOf(self.data["part"]) == -1) {
				Prompt.showPrompt(self.stage, "部位异常，无法购买!");
				return;
			} else if (self.data["part"] == "7" && ClothesData.clothesSub_parts.indexOf(self.data["sub_part"]) == -1) {
				Prompt.showPrompt(self.stage, "部位异常，无法购买!");
				return;
			}

			if (self.data["type"] == "1" && PlayerData.coin < parseInt(self.data["cost"])) {
				var panel = new ExchangePanel("coin");
				DisplayMgr.set2Center(panel);
				self.stage.addChild(panel);
				Prompt.showPrompt(self.stage, "金币不足!");
				return;
			} else if (self.data["type"] == "2" && PlayerData.diam < parseInt(self.data["cost"])) {
				var panel = new ExchangePanel("pay");
				DisplayMgr.set2Center(panel);
				self.stage.addChild(panel);
				Prompt.showPrompt(self.stage, "钻石不足!");
				return;
			}

			var id = self.data["id"];
			var ondress = CommonFunc.simpleCloneObj(ClothesData.ondressCache);
			var ornaments = CommonFunc.simpleCloneObj(ClothesData.ornamentsCache);
			if (self.data["part"] != "7") {
				ondress[self.data["part"]] = parseInt(id);
			} else {
				ornaments[self.data["sub_part"]] = parseInt(id);
			}

			NetLoading.showLoading();
			TaskData.isBuyOf403 = true;
			var request: egret.URLRequest;
			request = HttpProtocolMgr.new_save_dressed_403(ondress, ornaments);

			HttpMgr.postRequest(request);
		});
	}
}

