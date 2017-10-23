class NewSignPanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public btn_right: eui.Image;
	public btn_left: eui.Image;
	public shower: Shower;
	public curDay: eui.Label;
	public leftDays: eui.Label;
	public btn_receive: eui.Button;

	private itemGroup: eui.Group = new eui.Group;

	private curPage: number;

	public constructor() {
		super();

		this.skinName = "NewSignPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		this.initView();
	}

	private onExit() {
		CustomEventMgr.removeEventListener("313", this.resutl_of_313, this);
	}

	private initView() {
		var signInfo = NewSignData.signInfoObj;
		var num: number = 0;
		for(var i in signInfo) {
			if(signInfo[i]) {
				num++;
			}
		}
		this.curPage = num;
		this.curDay.text = "第" + num + "天";

		if(this.curPage <= 2) {
			this.leftDays.text = (2 - this.curPage) + "";
		}else {
			this.leftDays.text = (7 - this.curPage) + "";
		}

		if(NewSignData.signInfoObj[this.curPage.toString()] && NewSignData.signInfoObj[this.curPage.toString()] == 1) {
			this.btn_receive.currentState = "up";
			this.btn_receive.enabled = true;
		}else {
			this.btn_receive.currentState = "disabled";
			this.btn_receive.enabled = false;
		}

		this.initItemsView();
		this.initShower();

		this.btn_left.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLeft, this);
		this.btn_right.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRight, this);
		this.btn_receive.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReceive, this);
		CustomEventMgr.addEventListener("313", this.resutl_of_313, this);
	}

	private initItemsView() {
		this.itemGroup.width = 234;

		var obj = NewSignData.tempObj[this.curPage.toString()];
		if (obj["type"] == "wealth") {
			this.itemGroup.height = (Math.ceil(4 / 2) - 1) * 140 + 95;
			var wealObj: {} = obj["rewards"];
			for (var k in wealObj) {
				var item = new eui.Component();
				item.skinName = "NewSignItemSkin";

				if (k == "piece") {
					item["icon"].source = "newSignin_piece_png";
					item.left = 0;
					item.y = 0;
				} else if (k == "energy") {
					item["icon"].source = "newSignin_energy_png";
					item.right = 0;
					item.y = 0;
				} else if (k == "diam") {
					item["icon"].source = "newSignin_diam_png";
					item.left = 0;
					item.y = 140;
				} else if (k == "coin") {
					item["icon"].source = "newSignin_coin_png";
					item.right = 0;
					item.y = 140;
				}

				item["count"].text = wealObj[k];
				this.itemGroup.addChild(item);
			}

			this.itemGroup.horizontalCenter = -94;
			this.itemGroup.verticalCenter = 0;
			this.group.addChild(this.itemGroup);

		} else if (obj["type"] == "clothes") {
			var clothesArr: number[] = obj["rewards"];
			var len = clothesArr.length;
			this.itemGroup.height = (Math.ceil(len / 2) - 1) * 140 + 95;
			for (var i = 0; i < len; i++) {
				var cthItem = new eui.Component();
				cthItem.skinName = "NewSignClothesItemSkin";
				cthItem["icon"].source = "icon" + clothesArr[i] + "_png";
				if (i % 2 == 0) {
					cthItem.left = 0;
				} else {
					cthItem.right = 0;
				}

				cthItem.y = Math.floor(i / 2) * 140;
				this.itemGroup.addChild(cthItem);
			}
			this.itemGroup.horizontalCenter = -94;
			this.itemGroup.verticalCenter = 0;
			this.group.addChild(this.itemGroup);
		}
	}

	private initShower() {
		var clothesArr: number[] = [];
		if(this.curPage <= 2) {
			clothesArr = NewSignData.tempObj["2"]["rewards"];
		}else {
			clothesArr = NewSignData.tempObj["7"]["rewards"];
		}

		var len = clothesArr.length;
		for (var i = 0; i < len; i++) {
			var id = clothesArr[i];
			var part: string = Math.floor(id / 10000) + "";
			var sub_part: string
			if (part == "7") {
				sub_part = ClothesData.clothesTemplateData(part, id.toString())["sub_part"];
			} else {
				sub_part = ClothesData.clothesTemplateData(part, id.toString())["part"];
			}

			this.shower.dressItem(sub_part, id);
		}
	}

	private onLeft(evt: egret.TouchEvent) {
		var lastPage = this.curPage;
		if(this.curPage == 1) {
			this.curPage = 7;
		}else {
			this.curPage--;
		}
		
		if(this.curPage <= 2) {
			this.leftDays.text = (2 - this.curPage) + "";
		}else {
			this.leftDays.text = (7 - this.curPage) + "";
		}

		if(NewSignData.signInfoObj[this.curPage.toString()] && NewSignData.signInfoObj[this.curPage.toString()] == 1) {
			this.btn_receive.currentState = "up";
			this.btn_receive.enabled = true;
		}else {
			this.btn_receive.currentState = "disabled";
			this.btn_receive.enabled = false;
		}

		this.updateItemView();
		if((lastPage <= 2 && this.curPage > 2) || (lastPage > 2 && this.curPage <= 2)) {
			this.shower.takeOffAllClothes();
			this.initShower();
		}
	}

	private onRight(evt: egret.TouchEvent) {
		var lastPage = this.curPage;
		if(this.curPage == 7) {
			this.curPage = 1;
		}else {
			this.curPage++;
		}

		if(this.curPage <= 2) {
			this.leftDays.text = (2 - this.curPage) + "";
		}else {
			this.leftDays.text = (7 - this.curPage) + "";
		}

		if(NewSignData.signInfoObj[this.curPage.toString()] && NewSignData.signInfoObj[this.curPage.toString()] == 1) {
			this.btn_receive.currentState = "up";
			this.btn_receive.enabled = true;
		}else {
			this.btn_receive.currentState = "disabled";
			this.btn_receive.enabled = false;
		}

		this.updateItemView();

		if((lastPage <= 2 && this.curPage > 2) || (lastPage > 2 && this.curPage <= 2)) {
			this.shower.takeOffAllClothes();
			this.initShower();
		}
	}

	private onReceive() {
		DisplayMgr.buttonScale(this.btn_receive, function() {
			NetLoading.showLoading();
			var request = HttpProtocolMgr.perform_signin7_313();
			HttpMgr.postRequest(request);
		});
	}

	private resutl_of_313(evt: egret.Event) {
		if(NewSignData.signInfoObj[this.curPage.toString()] && NewSignData.signInfoObj[this.curPage.toString()] == 1) {
			this.btn_receive.currentState = "up";
			this.btn_receive.enabled = true;
		}else {
			this.btn_receive.currentState = "disabled";
			this.btn_receive.enabled = false;
		}
		NetLoading.removeLoading();
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		Prompt.showPrompt(this.stage, "领取成功~");
	}

	private updateItemView() {
		this.itemGroup.removeChildren();
		this.initItemsView();
	}

	private onTouch(evt: egret.TouchEvent) {
		var rectAngle = this.bg.getTransformedBounds(this.stage);
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