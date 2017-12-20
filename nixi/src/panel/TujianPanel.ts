class TujianPanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public model: Model;
	public label_name: eui.Label;
	public itemGroup: eui.Group;
	public btn_left: eui.Image;
	public btn_right: eui.Image;
	public label_diam: eui.Label;
	public label_coin: eui.Label;
	public btn_buy: eui.Image;
	public flagGroup: eui.Group;
	public btn_rev: eui.Image;

	private clothesArr: string[];
	private curIndex: number = 1;
	private counts: number = 1;

	private pageCounts: number = 0;

	private isAllOwn: boolean = true;

	private isSaveClothes: boolean = false;

	public constructor() {
		super();

		this.skinName = "TujianPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(852, DisplayMgr.stageW);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

		var data: {} = RES.getRes("task_perfect_tip_json");
		for (var p in data) {
			this.pageCounts += 1;
		}
		this.clothesArr = data[this.curIndex + ""]["clothes"];
		this.counts = this.clothesArr.length;
		this.updateView();

		this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
		this.btn_rev.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRev, this);
		this.btn_left.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLeft, this);
		this.btn_right.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRight, this);

		CustomEventMgr.addEventListener("403", this.result_of_403, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("403", this.result_of_403, this);
	}

	private updateView() {
		var price_diam: number = 0;
		var price_coin: number = 0;

		var firstItem = ClothesData.clothesTemplateData(this.clothesArr[0][0], this.clothesArr[0]);
		this.label_name.text = firstItem["name"];

		var own_num: number = 0;

		for (var i = 0; i < this.counts; i++) {
			var id: number = parseInt(this.clothesArr[i]);
			var part: string = Math.floor(id / 10000) + "";
			var sub_part: string;
			var tempData = ClothesData.clothesTemplateData(part, this.clothesArr[i]);
			if (part == "7") {
				sub_part = tempData["sub_part"];
			} else {
				sub_part = tempData["part"];
			}

			this.model.dressItem(sub_part, id);
			this.model.dressItemOfSuit(sub_part, id);

			var flagImg = new eui.Image("tujian_flag_2_png");
			this.flagGroup.addChild(flagImg);

			var item = new TujianItem();
			item.icon.source = "icon" + id + "_png";
			if (ClothesData.hasOwnedClohtes(id)) {
				own_num ++;
				item.currentState = "state_2";
			} else {
				item.currentState = "state_1";
				this.isAllOwn = false;
				var clothes_item = ClothesData.clothesTemplateData(this.clothesArr[i][0], this.clothesArr[i]);
				if (clothes_item["type"] == "1") {
					item.costType.source = "shopUI_json.shop_ui_coin2";
					item.costLabel.text = clothes_item["cost"];
					price_coin += parseInt(clothes_item["cost"]);
					item.data = clothes_item;
				} else if (clothes_item["type"] == "2") {
					item.costType.source = "shopUI_json.shop_ui_diam2";
					item.costLabel.text = clothes_item["cost"];
					price_diam += parseInt(clothes_item["cost"]);
					item.data = clothes_item;
				} else {
					item.currentState = "state_3";
				}
			}
			this.itemGroup.addChild(item);
		}

		if(this.counts <= 4) {
			this.itemGroup.layout = new eui.VerticalLayout();
		}else {
			this.itemGroup.layout = new eui.TileLayout();

		}

		for(var j = 0; j < own_num; j++) {
			var img = <eui.Image>(this.flagGroup.getChildAt(j));
			img.source = "tujian_flag_1_png";
		}

		this.label_diam.text = "" + price_diam;
		this.label_coin.text = "" + price_coin;

		if (this.isAllOwn) {
			this.btn_buy.source = "tujian_btn_dress_png";
		} else {
			this.btn_buy.source = "tujian_btn_buy_png";
		}
	}

	private onBuy() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_buy, function () {
			SoundManager.instance().buttonSound("buy");

			if (self.isAllOwn) {
				//一键穿搭
				self.dressAllClothes();
			} else {
				//一键购买
				if (self.label_coin.text == "0" && self.label_diam.text == "0") {
					Prompt.showPrompt(self.stage, "没有可供购买的衣服!");
					return;
				}

				var ondress = CommonFunc.simpleCloneObj(ClothesData.ondressCache);
				var ornaments = CommonFunc.simpleCloneObj(ClothesData.ornamentsCache);
				for (var i = 0; i < self.counts; i++) {
					var item = ClothesData.clothesTemplateData(self.clothesArr[i][0], self.clothesArr[i]);
					if (item["type"] == "1" || item["type"] == "2") {
						if (item["part"] != "7") {
							ondress[item["part"]] = parseInt(self.clothesArr[i]);
						} else {
							ornaments[item["sub_part"]] = parseInt(self.clothesArr[i]);
						}
					} else {
						//非卖品
					}
				}

				NetLoading.showLoading();
				self.isSaveClothes = false;
				var request: egret.URLRequest;
				request = HttpProtocolMgr.new_save_dressed_403(ondress, ornaments);

				HttpMgr.postRequest(request);
			}
		});
	}

	private updatePrice() {
		var price_diam: number = 0;
		var price_coin: number = 0;
		this.isAllOwn = true;
		for (var i = 0; i < this.counts; i++) {
			var id: number = parseInt(this.clothesArr[i]);

			var item = <TujianItem>(this.itemGroup.getChildAt(i));
			if (ClothesData.hasOwnedClohtes(id)) {
				item.currentState = "state_2";
			} else {
				item.currentState = "state_1";
				this.isAllOwn = false;
				var clothes_item = ClothesData.clothesTemplateData(this.clothesArr[i][0], this.clothesArr[i]);
				if (clothes_item["type"] == "1") {
					// item.costType.source = "shopUI_json.shop_ui_coin2";
					// item.costLabel.text = clothes_item["cost"];
					price_coin += parseInt(clothes_item["cost"]);
					// item.data = clothes_item;
				} else if (clothes_item["type"] == "2") {
					// item.costType.source = "shopUI_json.shop_ui_diam2";
					// item.costLabel.text = clothes_item["cost"];
					price_diam += parseInt(clothes_item["cost"]);
					// item.data = clothes_item;
				} else {
					item.currentState = "state_3";
				}
			}
		}

		this.label_diam.text = "" + price_diam;
		this.label_coin.text = "" + price_coin;

		if (this.isAllOwn) {
			this.btn_buy.source = "tujian_btn_dress_png";
		} else {
			this.btn_buy.source = "tujian_btn_buy_png";
		}
	}

	private dressAllClothes() {
		this.model.takeOffAllClothes();
        ClothesData.ondressCache = { "1": 10000, "2": 20000, "3": 30000, "4": 40000, "5": 50000, "6": 60000, "8": 80000, "9": 90000, "10": 100000 };
        ClothesData.ornamentsCache = {
            "11": 70000, "12": 70000, "13": 70000, "14": 70000, "15": 70000, "16": 70000, "17": 70000, "18": 70000, "19": 70000, "20": 70000, "21": 70000, "22": 70000, "23": 70000
        };

        this.dressItems();
	}

	private dressItems() {
        for (var i = 0; i < this.counts; i++) {
            var item = ClothesData.clothesTemplateData(this.clothesArr[i][0], this.clothesArr[i]);
            if (item["part"] != "7") {
                ClothesData.ondressCache[item["part"]] = parseInt(this.clothesArr[i]);
            } else {
                ClothesData.ornamentsCache[item["sub_part"]] = parseInt(this.clothesArr[i]);
            }
        }
        this.model.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);

		NetLoading.showLoading();
		this.isSaveClothes = true;
		var request: egret.URLRequest;
		request = HttpProtocolMgr.new_save_dressed_403(ClothesData.ondressCache, ClothesData.ornamentsCache);
		HttpMgr.postRequest(request);
    }

	private onRev() {

	}

	private onLeft() {
		SoundManager.instance().buttonSound("flip");
		this.curIndex -= 1;
		this.curIndex = this.curIndex >= 1 ? this.curIndex : 1;

		if (this.curIndex == 1) {
			this.btn_left.visible = false;
			this.btn_right.visible = true;
		} else if (this.curIndex == this.pageCounts) {
			this.btn_left.visible = true;
			this.btn_right.visible = false;
		} else {
			this.btn_left.visible = true;
			this.btn_right.visible = true;
		}

		this.updateView();
	}

	private onRight() {
		SoundManager.instance().buttonSound("flip");
		this.curIndex += 1;
		this.curIndex = this.curIndex <= this.pageCounts ? this.curIndex : this.pageCounts;

		if (this.curIndex == 1) {
			this.btn_left.visible = false;
			this.btn_right.visible = true;
		} else if (this.curIndex == this.pageCounts) {
			this.btn_left.visible = true;
			this.btn_right.visible = false;
		} else {
			this.btn_left.visible = true;
			this.btn_right.visible = true;
		}

		this.updateView();
	}

	private result_of_403() {
		NetLoading.removeLoading();
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		this.updatePrice();
		if(this.isSaveClothes) {
			Prompt.showPrompt(this.stage, "保存成功~!");
		}else {
			Prompt.showPrompt(this.stage, "购买成功~!");
		}
		
	}

	private onTap(evt: egret.TouchEvent) {
		var rectAngle = this.bg.getTransformedBounds(this.stage);
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


class TujianItem extends eui.Component {
	public icon: eui.Image;
	public costType: eui.Image;
	public costLabel: eui.Label;
	public btnBuy: eui.Image;
	public data: {} = null;

	public constructor() {
		super();

		this.skinName = "TujianItemSkin";
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