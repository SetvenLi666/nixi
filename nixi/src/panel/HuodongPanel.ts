class HuodongPanel extends eui.Component {
	private group: eui.Group;
	private bg: eui.Image;
	private list: eui.List;
	private data: eui.ArrayCollection;

	public constructor() {
		super();

		this.skinName = "HuodongPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		var sourceData: {}[] = [
			{ name: "sc_cj", source: "hd_panel_sc_cj_png" },
			{ name: "sigin7", source: "hd_panel_sigin7_png" },
			{ name: "tili", source: "hd_panel_tili_png" },
			{ name: "sc", source: "hd_panel_sc_png" },
			{ name: "lb1", source: "hd_panel_lb1_png" },
			{ name: "lb6", source: "hd_panel_lb6_png" },
			{ name: "lb30", source: "hd_panel_lb30_png" },
			{ name: "leiji", source: "hd_panel_leiji_png" },
			{ name: "dt", source: "hd_panel_target_png" }
		];

		if(window["OPEN_DATA"] && window["OPEN_DATA"].platform == 2) {
			sourceData.splice(4, 1);
		}

		this.data = new eui.ArrayCollection(sourceData);
		this.list.dataProvider = this.data;
		this.list.itemRenderer = HuodongPanelRenderer;
	}

	private onTouch(evt: egret.TouchEvent) {
		var rectAngle = this.bg.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.close();
		}
	}

	private close() {
		if (this && this.parent) {
			this.parent.removeChild(this);
		}
	}
}


class HuodongPanelRenderer extends eui.ItemRenderer {
	private imageBg: eui.Image;
	private tip: eui.Image;

	public constructor() {
		super();

		this.skinName = "HuodongPanelRendererSkin";
	}

	protected createChildren() {
		super.createChildren();

		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}

	protected dataChanged() {
		this.imageBg.source = this.data.source;

		if(this.data.name == "tili" && (NewsData.energy1 == 1 || NewsData.energy2 == 1)) {
			this.tip.visible = true;
			var tw = egret.Tween.get(this.tip, {loop: true});
			tw.to({ scaleX: 1.05, scaleY: 1.05 }, 300)
				.to({ scaleX: 1, scaleY: 1 }, 300);
		}else {
			this.tip.visible = false;
			egret.Tween.removeTweens(this.tip);
		}
	}

	private onTouch() {
		var self = this;
		switch (this.data.name) {
			case "sc_cj":
				if (ShareData.isFirstPay && ShareData.firstpay_lottery_times == 1 && ShareData.isDailyPay && ShareData.dailypay_normal_times == 1 && ShareData.dailypay_lottery_times == 1) {
					//
					NetLoading.showLoading();
					var request = HttpProtocolMgr.all_products_100();
					HttpMgr.postRequest(request);
				} else {
					var onePanel = new ScPanel();
					DisplayMgr.set2Center(onePanel);
					self.stage.addChild(onePanel);
				}
				break;
			case "sigin7":
				NetLoading.showLoading();
				var request: egret.URLRequest;
				if (SigninData.has_init_signin7_template()) {
					request = HttpProtocolMgr.signin7_info_302(false);
				} else {
					request = HttpProtocolMgr.signin7_info_302(true);
				}
				HttpMgr.postRequest(request);
				break;
			case "tili":
				var panel = new EnergyPanel();
				DisplayMgr.set2Center(panel);
				egret.MainContext.instance.stage.addChild(panel);
				break;
			case "sc":
				NetLoading.showLoading();
				var request = HttpProtocolMgr.all_products_100();
				HttpMgr.postRequest(request);
				break;
			case "lb1":
				NetLoading.showLoading();
				var request = HttpProtocolMgr.take_package_info_104();
				HttpMgr.postRequest(request);
				break;
			case "lb6":
				NetLoading.showLoading();
				var request = HttpProtocolMgr.take_package_info_104();
				HttpMgr.postRequest(request);
				break;
			case "lb30":
				NetLoading.showLoading();
				var request = HttpProtocolMgr.take_package_info_104();
				HttpMgr.postRequest(request);
				break;
			case "leiji":
				NetLoading.showLoading();
				var request: egret.URLRequest;
				if (RechargeData.has_init_purchase_template()) {
					request = HttpProtocolMgr.purchase_achievement_info_304(false);
				} else {
					request = HttpProtocolMgr.purchase_achievement_info_304(true);
				}
				HttpMgr.postRequest(request);
				break;
			case "dt":
				NetLoading.showLoading();
				WelfareData.isBtnReq = true;
				var request = HttpProtocolMgr.take_welfare_data_630();
				HttpMgr.postRequest(request);
				break;
		}
	}
}