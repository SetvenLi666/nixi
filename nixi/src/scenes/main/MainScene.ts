/**
 *
 * @author 
 *
 */
class MainScene extends egret.DisplayObjectContainer {
	private shapeMask: egret.Shape;

	public constructor() {
		super();

		var mask = DisplayMgr.createSceneMask();
		this.addChild(mask);
		this.mask = mask;

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		WebSocketMagr.connect();

		var mainView = new MainComp();
		this.addChild(mainView);

		var baseView = new BaseComp(ShowData.nickname, PlayerData.coin, PlayerData.diam, PlayerData.energy);
		this.addChild(baseView);

		CustomEventMgr.addEventListener("169", this.result_of_169, this);

		if (PlayerData.guide == 0) {
			if (NewsData.dailySignin == 1) {
				//每日登陆礼盒
				ShareData.isShowScPop = true;
				var panel = new DailySigninPanel();
				DisplayMgr.set2Center(panel);
				this.stage.addChild(panel);
			} else if (NewsData.signin7 == 1) {
				NetLoading.showLoading();
				var request: egret.URLRequest;
				// ========老版七日签到========
				if (SigninData.has_init_signin7_template()) {
					request = HttpProtocolMgr.signin7_info_302(false);
				} else {
					request = HttpProtocolMgr.signin7_info_302(true);
				}

				HttpMgr.postRequest(request);
			}
		} else if (PlayerData.guide == 1) {
			var guidePanel = new NewGuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.addChild(guidePanel);
			guidePanel.currentState = "guide_step_1_2";
		} else if (PlayerData.guide == 6 && PlayerData.pkGuide != 1) {
			var guidePanel = new NewGuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.addChild(guidePanel);
			guidePanel.playAnimation();
		} else if (PlayerData.guide == 2) {

		}


		//玩吧每日礼包
		var reg = new RegExp("(^|&)" + "GIFT" + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);

		if (r != null && ShareData.isShowGift) {
			var gift_id = decodeURI(r[2]);
			ShareData.isShowGift = false;
			if (gift_id == "101") { //新手礼包
				if (ShareData.can_take_once_gift) {
					NetLoading.showLoading();
					var request = HttpProtocolMgr.take_daily_gift_reward_169(gift_id);
					HttpMgr.postRequest(request);
				}
			} else { //每日礼包
				if (ShareData.can_take_gift) {
					//发送礼包请求
					NetLoading.showLoading();
					var request = HttpProtocolMgr.take_daily_gift_reward_169(gift_id);
					HttpMgr.postRequest(request);
				} else {
					egret.setTimeout(function () {
						var giftPanel = new DailyGiftPanel("2", gift_id);
						DisplayMgr.set2Center(giftPanel);
						this.stage.addChild(giftPanel);
					}, this, 500);
				}
			}
		}
	}

	private onExit() {
		CustomEventMgr.removeEventListener("169", this.result_of_169, this);
	}

	private result_of_169() {
		var reg = new RegExp("(^|&)" + "GIFT" + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		var gift_id = decodeURI(r[2]);
		NetLoading.removeLoading();
		var giftPanel = new DailyGiftPanel("1", gift_id);
		DisplayMgr.set2Center(giftPanel);
		this.stage.addChild(giftPanel);
	}
}
