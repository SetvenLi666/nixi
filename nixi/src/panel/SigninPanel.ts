class SigninPanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public item_1: SignItemComp;
	public item_2: SignItemComp;
	public item_3: SignItemComp;
	public item_4: SignItemComp;
	public item_5: SignItemComp;
	public item_6: SignItemComp;
	public item_7: SignItemComp;

	public id: string;

	// public shower: Model;

	public constructor() {
		super();

		this.skinName = "SigninPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);

		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);

		CustomEventMgr.addEventListener("303", this.afterFetchInfo_303, this);

		this.initSignView();
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		this.group.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);
		CustomEventMgr.removeEventListener("303", this.afterFetchInfo_303, this);
		this.item_1.btn_rev.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onItemTouched, this);
		this.item_2.btn_rev.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onItemTouched, this);
		this.item_3.btn_rev.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onItemTouched, this);
		this.item_4.btn_rev.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onItemTouched, this);
		this.item_5.btn_rev.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onItemTouched, this);
		this.item_6.btn_rev.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onItemTouched, this);
		this.item_7.btn_rev.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onItemTouched, this);
	}

	private initSignView() {
		for (var i = 0; i < 7; i++) {
			var id: number = parseInt(SigninData.tempArray[i]["uri"]);
			var part: string = Math.floor(id / 10000) + "";
			var sub_part: string;
			var tempData = ClothesData.clothesTemplateData(part, id.toString());
			if (part == "7") {
				sub_part = tempData["sub_part"];
			} else {
				sub_part = tempData["part"];
			}

			// this.shower.dressItem(sub_part, id);
			// this.shower.dressItemOfSuit(sub_part, id);

			var item = <SignItemComp>this["item_" + (i + 1)];
			item.btn_rev.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onItemTouched, this);

			item.itemBg.source = "ac_res_json.ac_signin_item_bg";
			item.icon.source = "icon" + SigninData.tempArray[i]["uri"] + "_png";
			item.clothes_name.text = tempData["name"];
			var item_id = SigninData.tempArray[i]["id"];
			var state: number = SigninData.getCurrentState(item_id);
			switch (state) {
				case 0:
					item.currentState = "unuse";
					// item.touchEnabled = false;
					// item.touchChildren = false;
					break;
				case 1:
					item.currentState = "canuse";
					break;
				case 2:
					item.currentState = "used";
					// item.touchEnabled = false;
					// item.touchChildren = false;
					break;
			}
		}
	}

	private touchTap(evt: egret.TouchEvent) {
		var rectAngle = this.bg.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.closePanel();
		}
	}

	private closePanel() {
		if (this.parent) {
			// if (NewsData.dailySignin == 1) {
			// 	var panel = new DailySigninPanel();
			// 	DisplayMgr.set2Center(panel);
			// 	this.stage.addChild(panel);
			// }
			if(ShareData.isFirstPay && ShareData.firstpay_normal_times == 1 && ShareData.firstpay_lottery_times == 1 && ShareData.isDailyPay && ShareData.dailypay_normal_times == 1 && ShareData.dailypay_lottery_times == 1) {

			}else if(ShareData.isShowScPop){
				ShareData.isShowScPop = false;
				var onePanel = new ScPanel();
				DisplayMgr.set2Center(onePanel);
				this.stage.addChild(onePanel);
			}

			this.parent.removeChild(this);
		}
	}

	private onItemTouched(evt: egret.TouchEvent) {
		switch (evt.currentTarget.parent) {
			case this.item_1:
				this.id = "1";
				break;
			case this.item_2:
				this.id = "2";
				break;
			case this.item_3:
				this.id = "3";
				break;
			case this.item_4:
				this.id = "4";
				break;
			case this.item_5:
				this.id = "5";
				break;
			case this.item_6:
				this.id = "6";
				break;
			case this.item_7:
				this.id = "7";
				break;
		}
		console.log(this.id);
		var request: egret.URLRequest = HttpProtocolMgr.perform_signin7_303(this.id);
		HttpMgr.postRequest(request);
	}

	private afterFetchInfo_303() {
		var item = <SignItemComp>this["item_" + this.id];
		item.currentState = "used";
		item.touchChildren = false;
		item.touchEnabled = false;
		Prompt.showPrompt(this.stage, "领取成功");
	}
}