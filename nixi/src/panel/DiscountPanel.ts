class DiscountPanel extends eui.Component {
	public group: eui.Group;
	public image_bg: eui.Image;
	public shower: Shower;
	public buttonComp: eui.Component;
	public leftTime: eui.Label;
	public btn_dress: eui.Image;

	private timer: egret.Timer;
	private deadline: number;
	private itemArr: {}[] = [];

	private ondress = { 1: 10000, 2: 20000, 3: 30000, 4: 40000, 5: 50000, 6: 60000, 8: 80000, 9: 90000, 10: 100000 };
	private ornaments = { 11: 70000, 12: 70000, 13: 70000, 14: 70000, 15: 70000, 16: 70000, 17: 70000, 18: 70000, 19: 70000, 20: 70000 };

	public constructor() {
		super();

		this.skinName = "DiscountPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		this.initView();
		CustomEventMgr.addEventListener("161", this.result_of_161, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("161", this.result_of_161, this);
	}

	private initView() {
		this.timer = new egret.Timer(1000, 0);
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimerCallback, this);
		this.deadline = DiscountData.deadline;
		var hour = Math.floor(DiscountData.deadline / 3600);
		var hour_text = hour >= 10 ? hour : "0" + hour;
		var min = Math.floor((DiscountData.deadline - hour * 3600) / 60);
		var min_text = min >= 10 ? min : "0" + min;
		var second = DiscountData.deadline - hour * 3600 - min * 60;
		var second_text = second >= 10 ? second : "0" + second;
		this.leftTime.text = hour_text + ":" + min_text + ":" + second_text;
		this.timer.start();

		this.buttonComp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
		this.btn_dress.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDress, this);

		var arr = DiscountData.clothes;
		var len = arr.length;
		var allOwn: boolean = true;
		for (var i = 0; i < len; i++) {
			var item = new eui.Component();
			item.skinName = "DiscountItemSkin";
			item["icon"].source = "icon" + arr[i] + "_png";

			if (ClothesData.hasOwnedClohtes(arr[i])) {
				item["flag"].visible = true;
			} else {
				item["flag"].visible = false;
				allOwn = false;
			}

			this.group.addChild(item);
			this.itemArr.push(item);

			var part: string = "" + Math.floor(arr[i] / 10000);
			var sub_part: string
			if (part == "7") {
				sub_part = ClothesData.clothesTemplateData(part, arr[i].toString())["sub_part"];
				this.ornaments[sub_part] = arr[i];
			} else {
				sub_part = ClothesData.clothesTemplateData(part, arr[i].toString())["part"];
				this.ondress[sub_part] = arr[i];
			}

			this.shower.dressItem(sub_part, arr[i]);

			if (i % 2 == 0) {
				item.horizontalCenter = -190;
			} else {
				item.horizontalCenter = 190;
			}

			item.y = 265 + (Math.floor(i / 2)) * 140;
		}

		if (allOwn) {
			this.buttonComp.visible = false;
			this.btn_dress.visible = true;
		} else {
			this.buttonComp.visible = true;
			this.btn_dress.visible = false;
		}

		this.buttonComp["lab_discount"].text = DiscountData.discount + "折";
		this.buttonComp["lab_oldPrice"].text = DiscountData.oldPrice;
		this.buttonComp["lab_newPrice"].text = DiscountData.nowPrice;
	}

	private onTimerCallback(evt: egret.TimerEvent) {
		if (this.deadline <= 0) {
			this.leftTime.text = "00:00:00";
		} else {
			this.deadline--;
			var hour = Math.floor(this.deadline / 3600);
			var hour_text = hour >= 10 ? hour : "0" + hour;
			var min = Math.floor((this.deadline - hour * 3600) / 60);
			var min_text = min >= 10 ? min : "0" + min;
			var second = this.deadline - hour * 3600 - min * 60;
			var second_text = second >= 10 ? second : "0" + second;
			this.leftTime.text = hour_text + ":" + min_text + ":" + second_text;
		}
	}

	private onBuy() {
		var self = this;
		DisplayMgr.buttonScale(this.buttonComp, function () {
			if (DiscountData.phase > PlayerData.phase) {
				var panel = new DiscountTipPanel();
				DisplayMgr.set2Center(panel);
				self.stage.addChild(panel);
			} else {
				NetLoading.showLoading();
				var request = HttpProtocolMgr.flash_sale_buying_161();
				HttpMgr.postRequest(request);
			}
		});
	}

	private result_of_161(evt: egret.Event) {
		this.buttonComp.visible = false;
		this.btn_dress.visible = true;
		NetLoading.removeLoading();
		Prompt.showPrompt(this.stage, "购买成功~");
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		for (var i = 0; i < this.itemArr.length; i++) {
			this.itemArr[i]["flag"].visible = true;
		}
	}

	private onDress() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_dress, function () {
			for (var i in self.ondress) {
				ClothesData.ondressCache[i] = self.ondress[i];
			}
			for (var j in self.ornaments) {
				ClothesData.ornamentsCache[j] = self.ornaments[j];
			}
			SceneMgr.gotoDressScene(null, null, null, null);
		});
	}

	private onTouch(evt: egret.TouchEvent) {
		var rectAngle = this.image_bg.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.closePanel();
		}
	}

	private closePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}