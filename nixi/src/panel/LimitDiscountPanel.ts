class LimitDiscountPanel extends eui.Component{
	public group: eui.Group;
	public group2: eui.Group;
	public diamNumImg: eui.Image;
	public coinNumImg: eui.Image;
	public energyNumImg: eui.Image;
	public title: eui.Image;
	public btnBuy: eui.Image;

	private type: number = 6;

	public constructor(type: number) {
		super();

		this.type = type;
		this.skinName = "LimitDiscountPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);

		this.initView(this.type);
		CustomEventMgr.addEventListener("Hide TL", this.closePanel, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("Hide TL", this.closePanel, this);
	}

	private initView(type: number) {
		if(type == 6) {
			this.title.source = "tl_title_6_png";
			this.diamNumImg.source = "tl_num_120_png";
			this.coinNumImg.source = "tl_num_10000_png";
			this.energyNumImg.source = "tl_num_100_png";
		}else if(type == 30) {
			this.title.source = "tl_title_30_png";
			this.diamNumImg.source = "tl_num_600_png";
			this.coinNumImg.source = "tl_num_30000_png";
			this.energyNumImg.source = "tl_num_300_png";
		}

		this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
	}

	private onBuy() {
		var self = this;
		DisplayMgr.buttonScale(this.btnBuy, function() {
			SoundManager.instance().buttonSound();

			var urlRequest = new egret.URLRequest(ConstData.Conf.WanbaOrderAddr);
			urlRequest.method = egret.URLRequestMethod.POST;

			var vcaString = "";
			if(TLDiscountData.type == 6) {
				vcaString = "6元限时礼包";
			}else if(TLDiscountData.type == 30) {
				vcaString = "30元限时礼包";
			}

			var order_id = LoginData.uuid + "-" + CommonFunc.curTimeStamp() + "-" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10);
			// TDGA.onChargeRequest({
			// 	orderId: order_id,
			// 	iapId: TLDiscountData.id,
			// 	currencyType: "CNY",
			// 	currencyAmount: "" + TLDiscountData.money,
			// 	virtualCurrencyAmount: vcaString
			// });

			tdData = {
				orderId: order_id,
				iapId: TLDiscountData.id,
				currencyType: "CNY",
				currencyAmount: "" + TLDiscountData.money,
				virtualCurrencyAmount: vcaString
			};

			urlData = "product_id=" + TLDiscountData.id + "&sid=" + LoginData.sid + "&openid=" + window["OPEN_DATA"].openid +
				"&openkey=" + window["OPEN_DATA"].openkey + "&platform=" + window["OPEN_DATA"].platform;
			urlRequest.data = urlData;
			var urlLoader = new egret.URLLoader();
			urlLoader.addEventListener(egret.Event.COMPLETE, self.onLoadComplete, self);
			urlLoader.load(urlRequest);
		});
	}

	private onLoadComplete(evt: egret.Event) {
		var loader = <egret.URLLoader>evt.target;
		console.log(loader.data);
		var obj: {} = JSON.parse(loader.data);

		if (obj && obj["result"] == "SUCCESS") {
			//余额足够，无二次请求
			if (obj["product_id"] && (obj["product_id"] == "tiegao_17" || obj["product_id"] == "tiegao_18")) {
				TLDiscountData.resetDL();
			}
			DataMgr.checkNews();

			window["mqq"].ui.showDialog({
				title: "提示",
				text: "支付成功!请前往邮箱领取物品!",
				needOkBtn: true,
				needCancelBtn: false,
				okBtnText: "确认",
				cancelBtnText: ""
			}, function (data) {
				console.log(data);
			});

		} else if (obj && obj["result"] == "FAIL" && obj["code"] == 1004) {
			window["popPayTips"]({
				defaultScore: obj["need_score"],
				appid: window["OPEN_DATA"].appid
			});
		}
	}

	private touchTap(evt: egret.TouchEvent) {
		var rectAngle = this.group2.getTransformedBounds(this.stage);
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