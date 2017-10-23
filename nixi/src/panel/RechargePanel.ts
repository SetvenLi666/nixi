class RechargePanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public btn_image: eui.Image;
	public label_1: eui.Label;
	public label_2: eui.Label;

	public btn_left: eui.Image;
	public btn_right: eui.Image;
	public shower: Model;
	private curIndex: number = 1;
	private counts: number;
	// private flagIndex: number;

	public constructor() {
		super();

		this.skinName = "RechargePanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);

		CustomEventMgr.addEventListener("305", this.result_of_305, this);

		this.initView();
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("305", this.result_of_305, this);

		this.btn_left.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onLeft, this);
		this.btn_right.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRight, this);
		this.btn_image.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButton, this);
	}

	private initView() {
		this.btn_left.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLeft, this);
		this.btn_right.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRight, this);

		this.counts = 4;

		if (this.curIndex == 1) {
			this.btn_left.visible = false;
		}

		if (RechargeData.achievement["total"] < RechargeData.template[this.curIndex.toString()]["goal"]) {
			this.btn_image.source = "recharge_chongzhi_png";
		} else {
			this.btn_image.source = "recharge_lingqu_png";
		}
		this.btn_image.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButton, this);

		this.label_1.text = RechargeData.template[this.curIndex.toString()]["goal"];
		this.label_2.text = RechargeData.achievement["total"];

		this.dressClothes();
	}

	private dressClothes() {
		// var arr:{}[] = this["arr" + this.curIndex];
		var arr:number[] = RechargeData.template[this.curIndex.toString()]["clothes"];
		var len = arr.length;
		for (var i = 0; i < len; i++) {
			var id: number = arr[i];
			var part: string = Math.floor(id / 10000) + "";
			var sub_part: string;
			var tempData = ClothesData.clothesTemplateData(part, id.toString());
			if (part == "7") {
				sub_part = tempData["sub_part"];
			} else {
				sub_part = tempData["part"];
			}

			// this.shower.dressItem(sub_part, id);
			this.shower.dressItemOfSuit(sub_part, id);
		}
	}

	private onLeft() {
		this.curIndex -= 1;
		this.curIndex = this.curIndex >= 1 ? this.curIndex : 1;

		if (this.curIndex == 1) {
			this.btn_left.visible = false;
			this.btn_right.visible = true;
		} else if (this.curIndex == this.counts) {
			this.btn_left.visible = true;
			this.btn_right.visible = false;
		} else {
			this.btn_left.visible = true;
			this.btn_right.visible = true;
		}

		this.updateView();
	}

	private onRight() {
		this.curIndex += 1;
		this.curIndex = this.curIndex <= this.counts ? this.curIndex : this.counts;

		if (this.curIndex == 1) {
			this.btn_left.visible = false;
			this.btn_right.visible = true;
		} else if (this.curIndex == this.counts) {
			this.btn_left.visible = true;
			this.btn_right.visible = false;
		} else {
			this.btn_left.visible = true;
			this.btn_right.visible = true;
		}

		this.updateView();
	}

	private updateView() {

		this.label_1.text = RechargeData.template[this.curIndex.toString()]["goal"];
		this.label_2.text = RechargeData.achievement["total"];

		if (RechargeData.achievement["total"] < RechargeData.template[this.curIndex.toString()]["goal"]) {
			this.btn_image.source = "recharge_chongzhi_png";
		} else {
			this.btn_image.source = "recharge_lingqu_png";
		}

		this.shower.takeOffAllClothes2();
		this.dressClothes();
	}

	private onButton() {
		if (RechargeData.achievement["total"] < RechargeData.template[this.curIndex.toString()]["goal"]) {
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.all_products_100();
			HttpMgr.postRequest(request);
		} else {
			var record: string[] = RechargeData.achievement["record"];
			var temp_id: string = RechargeData.template[this.curIndex.toString()]["id"];
			if (record.indexOf(temp_id) == -1) {
				NetLoading.showLoading();
				var request: egret.URLRequest = HttpProtocolMgr.take_purchase_achievement_305(this.curIndex.toString());
				HttpMgr.postRequest(request);
			} else {
				Prompt.showPrompt(this.stage, "奖励已领取");
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
			this.parent.removeChild(this);
		}
	}

	private result_of_305() {
		NetLoading.removeLoading();
		Prompt.showPrompt(this.stage, "领取成功");
	}
}