class DailySigninPanel extends eui.Component {
	public group: eui.Group;
	public boxComp: eui.Component;
	public rectMask: eui.Rect;

	private canClose: boolean = false;

	public constructor() {
		super();

		this.skinName = "DailySigninSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		// this.group.mask = this.rectMask;
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.boxComp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBoxTouched, this);

		CustomEventMgr.addEventListener("323", this.result_of_323, this);

		var boxImg: eui.Image = this.boxComp["boxImg"];
		var tw = egret.Tween.get(boxImg, { loop: true });
		tw.to({ scaleX: 1.1, scaleY: 1.1 }, 300)
			.to({ scaleX: 1, scaleY: 1 }, 300);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("323", this.result_of_323, this);
		egret.Tween.removeTweens(this.boxComp);
	}

	private onBoxTouched() {
		NetLoading.showLoading();
		var request: egret.URLRequest = HttpProtocolMgr.commit_daily_signin_323();
		HttpMgr.postRequest(request);
		// CustomEventMgr.dispatchEventWith("323", false, {type: "diam", num: 10})
	}

	private result_of_323(evt: egret.Event) {
		NetLoading.removeLoading();

		this.boxComp.touchChildren = false;
		this.boxComp.touchEnabled = false;
		var data = evt.data;
		egret.Tween.removeTweens(this.boxComp["boxImg"]);
		var tw = egret.Tween.get(this.boxComp);
		tw.to({ currentState: "box_0" })
			.wait(100)
			.to({ currentState: "box_1" })
			.wait(100)
			.to({ currentState: "box_2" })
			.call(function () {
				var iconComp = <eui.Component>this.boxComp["iconComp"];
				iconComp.visible = true;
				var numArr = [0, 1, 2, 3];
				numArr.sort(function (a: number, b: number): number {
					return Math.random() > 0.5 ? 1 : -1;
				})
				var arr: string[] = ["diam", "coin", "energy"];
				if (data["type"] == arr[numArr[3]]) {
					var t = Math.floor(Math.random() * 2);
					var a = numArr[3];
					numArr[3] = numArr[t];
					numArr[t] = a;
				}

				var curIndex = Math.floor(Math.random() * arr.length);
				var tw_icon = egret.Tween.get(iconComp);
				tw_icon.to({ currentState: arr[numArr[0]] })
					.wait(200)
					.to({ currentState: arr[numArr[1]] })
					.wait(200)
					.to({ currentState: arr[numArr[2]] })
					.wait(200)
					.to({ currentState: arr[numArr[3]] })
					.wait(200)
					.to({ currentState: data["type"] })
					.to({ scaleX: 1.2, scaleY: 1.2 }, 500)
					.call(function () {
						var count = <eui.Label>this.boxComp["iconComp"]["count"];
						count.text = "" + data["num"];
						count.visible = true;

						var light = <eui.Image>this.boxComp["light"];
						light.visible = true;
						var light_tw = egret.Tween.get(light, { loop: true });
						light_tw.to({ rotation: -360 }, 36000);
						this.canClose = true;
					}, this);
			}, this);
	}

	private onTouch() {
		if (this.canClose && this.parent) {
			CustomEventMgr.dispatchEventWith("Update Player Info", false);

			if (NewsData.signin7 == 1) {
				NetLoading.showLoading();
				var request: egret.URLRequest;
				// ========老版七日签到========
				if (SigninData.has_init_signin7_template()) {
					request = HttpProtocolMgr.signin7_info_302(false);
				} else {
					request = HttpProtocolMgr.signin7_info_302(true);
				}

				HttpMgr.postRequest(request);
			}else if(((ShareData.isFirstPay && ShareData.firstpay_lottery_times == 0) || (ShareData.isFirstPay == false)) && ShareData.isShowScPop) {
				ShareData.isShowScPop = false;
				var panel = new FirstPayPanel();
				DisplayMgr.set2Center(panel);
				this.stage.addChild(panel);
			}else if(!(ShareData.isDailyPay && ShareData.dailypay_normal_times == 1 && ShareData.dailypay_lottery_times == 1) && ShareData.isShowScPop) {
				ShareData.isShowScPop = false;
				var onePanel = new ScPanel();
				DisplayMgr.set2Center(onePanel);
				this.stage.addChild(onePanel);
			}

			this.parent.removeChild(this);
		}
	}
}