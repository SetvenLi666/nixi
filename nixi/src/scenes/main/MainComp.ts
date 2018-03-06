class MainComp extends eui.Component {
	public container: eui.Group;
	public group: eui.Group;
	public mailGroup: eui.Group;
	public mailTip: eui.Image;
	public niudanGroup: eui.Group;
	public scGroup: eui.Image;
	public sc_icon: eui.Image;
	public sc_text: eui.Image;
	public lbGroup: eui.Group;
	public libao_icon: eui.Image;
	public libao_ac: eui.Image;
	public libao_text: eui.Image;
	public shareGroup: eui.Group;
	public niudan_ac: eui.Image;
	public leijiGroup: eui.Group;
	public dtGroup: eui.Group;
	public hdGroup: eui.Group;
	public yqGroup: eui.Group;

	public bg: eui.Image;

	public td_ac: eui.Image;
	public dt_tip: eui.Image;

	public mcGroup: eui.Group;

	public tl_ac: eui.Image;
	public tlGroup: eui.Group;
	public tlGroup2: eui.Group;
	public tlTime: eui.Label;

	public hd_tip: eui.Image;

	public touchRect: eui.Rect;

	public shareImg: eui.Image;
	public shareText: eui.Image;

	// public sj_comp: eui.Component;
	// public xt_comp: eui.Component;
	// public yl_comp: eui.Component;
	// public sd_comp: eui.Component;
	// public jj_comp: eui.Component;

	public btnGroup: eui.Group;
	public btn_shequ: eui.Image;
	public btn_xingtu: eui.Image;
	public btn_tonggao: eui.Image;
	public btn_shangdian: eui.Image;
	public btn_jinji: eui.Group;

	public imglock: eui.Image;

	public model: Model;

	private hideTime: number = 500;

	private isTask: boolean = false;

	private timer: egret.Timer;

	public constructor() {
		super();

		this.skinName = "MainButtonCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);

		this.container.width = DisplayMgr.stageW;
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		var self = this;

		this.updateBg();

		this.initView();

		//图鉴josn生成
		// this.checkAllClothes();

		// SoundManager.instance().startBgSound("main");
		// SoundManager.instance().startBgSound("story");

		this.niudanGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnGashapon, this);
		this.mailGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMailTap, this);
		this.hdGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHd, this);

		this.leijiGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnLj, this);
		this.lbGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnLb, this);
		this.scGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnSc, this);
		this.dtGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnDt, this);
		this.yqGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnYq, this);
		this.mcGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnMc, this);

		this.tlGroup2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnTl, this);

		this.shareGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);

		// this.newShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);

		this.touchRect.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRect, this);

		CustomEventMgr.addEventListener("304", this.result_of_304, this);
		CustomEventMgr.addEventListener("306", this.result_of_306, this);
		CustomEventMgr.addEventListener("160", this.result_of_160, this);
		CustomEventMgr.addEventListener("312", this.result_of_312, this);
		CustomEventMgr.addEventListener("302", this.result_of_302, this);
		CustomEventMgr.addEventListener("301", this.result_of_301, this);
		CustomEventMgr.addEventListener("106", this.result_of_106, this);

		CustomEventMgr.addEventListener("500", this.afterFetchStoryData_500, this);
		CustomEventMgr.addEventListener("600", this.afterFetchMissionData_600, this);
		CustomEventMgr.addEventListener("800", this.afterSocialInfo_800, this);
		CustomEventMgr.addEventListener("400", this.afterFetchClothesData_400, this);
		CustomEventMgr.addEventListener("200", this.afterCoffersInfo_200, this);
		CustomEventMgr.addEventListener("704", this.afterHomeInfo_704, this);
		CustomEventMgr.addEventListener("700", this.afterFetchMailData_700, this);

		// CustomEventMgr.addEventListener("175", this.result_of_175, this);
		CustomEventMgr.addEventListener("114", this.afterFetchTujianData_114, this);

		CustomEventMgr.addEventListener("104", this.afterTakePackageInfo_104, this);

		CustomEventMgr.addEventListener("910", this.result_of_910, this);

		CustomEventMgr.addEventListener("820", this.result_of_820, this);
		CustomEventMgr.addEventListener("827", this.result_of_827, this);
		CustomEventMgr.addEventListener("630", this.result_of_630, this);
		CustomEventMgr.addEventListener("165", this.reuslt_of_165, this);

		CustomEventMgr.addEventListener("Update Libao View", this.updateLibaoView, this);
		CustomEventMgr.addEventListener("Update Sc View", this.updateScView, this);
		CustomEventMgr.addEventListener("CheckOut DT Status", this.checkDailyTargetStates, this);
		// CustomEventMgr.addEventListener("Update New Share", this.updateNewShare, this);

		CustomEventMgr.addEventListener("Change Model Clothes", this.changeModelClothes, this);

		CustomEventMgr.addEventListener("Update TL View", this.updateDlView, this);
		CustomEventMgr.addEventListener("Hide TL", this.hideDlView, this);

		//获取每日任务数据
		var request = HttpProtocolMgr.take_welfare_data_630();
		HttpMgr.postRequest(request);
		//============
		if (PlayerData.guide == 1) {
			CustomEventMgr.addEventListener("Talk Message", this.playGuideTalk, this);
			CustomEventMgr.addEventListener("Guide_Step_1_1", this.onTouchRect, this);
			CustomEventMgr.addEventListener("Guide_Step_1_2", this.onYlComp, this);
		} else if (PlayerData.guide == 2) {
			var guidePanel = new NewGuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.stage.addChild(guidePanel);
			guidePanel.currentState = "guide_step_2_100";
			guidePanel.playAnimation();
			CustomEventMgr.addEventListener("Guide_Step_2_100", this.onYlComp, this);
		} else if (PlayerData.guide == 5) {
			var guidePanel = new NewGuidePanel();
			DisplayMgr.set2Center(guidePanel);
			this.stage.addChild(guidePanel);
			guidePanel.currentState = "guide_step_5_100";
			// console.log((this.group.width - 30 - this.btn_shequ.width * 5) / 4 + 159);
			// guidePanel.acGroup.horizontalCenter = (this.group.width - 30 - this.btn_shequ.width * 5) / 4 + 159;
			// console.log(guidePanel.acGroup.horizontalCenter);
			// guidePanel.acGroup.validateNow();
			// guidePanel.acGroup.x = 0;
			guidePanel.playAnimation();
			CustomEventMgr.addEventListener("Guide_Step_5_100", this.onXtComp, this);
		} else if (PlayerData.guide == 6) {
			CustomEventMgr.addEventListener("Guide_Step_6", this.onBtnGashapon, this);
		}

		if (PlayerData.pkGuide == 1) {
			var pkguide = new PkGuidePanel();
			DisplayMgr.set2Center(pkguide);
			this.stage.addChild(pkguide);
			pkguide.currentState = "pkGuide_step_2";
			// pkguide.acGroup.x = this.jj_comp.x = this.group.width * 0.88;
			pkguide.stopAnimation();
			// this.jj_comp["imgLock"].visible = true;
			this.imglock.visible = true;
			CustomEventMgr.addEventListener("PkGuide_Step_2", this.onJjComp, this);
			egret.setTimeout(function () {
				var tw_lock = egret.Tween.get(self.imglock);
				tw_lock.to({ alpha: 0 }, 500)
					.to({ alpha: 1 }, 500)
					.to({ alpha: 0 }, 500)
					.to({ alpha: 1 }, 500)
					.to({ alpha: 0 }, 500)
					.call(function () {
						CustomEventMgr.dispatchEventWith("Play PkGuide Animation", false);
					}, self);
			}, this, 1000);
		}
	}

	private updateBg() {
		var time = new Date();
		var hour = time.getHours();
		if (hour >= 5 && hour < 11) {
			this.bg.source = "main_bg_1_png";
		} else if (hour >= 11 && hour < 17) {
			this.bg.source = "main_bg_2_png";
		} else if (hour >= 17 || hour < 5) {
			this.bg.source = "main_bg_3_png";
		}
	}

	private checkAllClothes() {
		// var arr = ClothesData.allClothesArray();
		// var len = arr.length;
		// var end_data: {} = {};
		// var taskdata: {}[] = RES.getRes("task_serial_json");
		// var len2 = taskdata.length;
		// for (var j = 0; j < len2; j++) {
		// 	var taskitem = taskdata[j];
		// 	var itemdata: {} = {
		// 		"task_id": taskitem["task_id"],
		// 		"serial": taskitem["serial"],
		// 		"clothes": []
		// 	};

		// 	for (var i = 0; i < len; i++) {
		// 		var item = arr[i];
		// 		if (item["serial"] == taskitem["serial"]) {
		// 			itemdata["clothes"].push(item["id"]);
		// 		}
		// 	}

		// 	end_data[taskitem["task_id"]] = itemdata;
		// }
		var arr = ClothesData.allClothesArray();
		var len = arr.length;
		var end_data: {} = {};
		var taskdata: {}[] = RES.getRes("task_serial_json");
		var len2 = taskdata.length;
		var index: number = 1;
		for (var j = 0; j < len2; j++) {
			var taskitem = taskdata[j];
			var itemdata: {} = {
				"index": index,
				"serial": taskitem["serial"],
				"clothes": []
			};

			for (var i = 0; i < len; i++) {
				var item = arr[i];
				if (item["serial"] == taskitem["serial"]) {
					itemdata["clothes"].push(item["id"]);
				}
			}


			var isActive: boolean = true;
			for (var p in end_data) {
				if (end_data[p]["serial"] == itemdata["serial"]) {
					isActive = false;
				}
			}

			if (itemdata["clothes"].length == 0) {

			} else if (isActive) {
				end_data[index] = itemdata;
				index++;
			}
		}

		egret.localStorage.setItem("end_data", JSON.stringify(end_data));
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		egret.Tween.removeAllTweens();

		if (this.timer) {
			this.timer.stop();
			this.timer = null;
		}
		// if (this.timer2) {
		// 	this.timer2.stop();
		// 	this.timer2 = null;
		// }

		// SoundManager.instance().destroyStartSound();

		CustomEventMgr.removeEventListener("304", this.result_of_304, this);
		CustomEventMgr.removeEventListener("306", this.result_of_306, this);
		CustomEventMgr.removeEventListener("160", this.result_of_160, this);
		CustomEventMgr.removeEventListener("312", this.result_of_312, this);
		CustomEventMgr.removeEventListener("302", this.result_of_302, this);
		CustomEventMgr.removeEventListener("301", this.result_of_301, this);
		CustomEventMgr.removeEventListener("106", this.result_of_106, this);

		CustomEventMgr.removeEventListener("500", this.afterFetchStoryData_500, this);
		CustomEventMgr.removeEventListener("600", this.afterFetchMissionData_600, this);
		CustomEventMgr.removeEventListener("800", this.afterSocialInfo_800, this);
		CustomEventMgr.removeEventListener("400", this.afterFetchClothesData_400, this);
		CustomEventMgr.removeEventListener("200", this.afterCoffersInfo_200, this);
		CustomEventMgr.removeEventListener("704", this.afterHomeInfo_704, this);
		CustomEventMgr.removeEventListener("700", this.afterFetchMailData_700, this);

		// CustomEventMgr.removeEventListener("175", this.result_of_175, this);

		CustomEventMgr.removeEventListener("104", this.afterTakePackageInfo_104, this);

		CustomEventMgr.removeEventListener("114", this.afterFetchTujianData_114, this);

		CustomEventMgr.removeEventListener("910", this.result_of_910, this);

		CustomEventMgr.removeEventListener("820", this.result_of_820, this);
		CustomEventMgr.removeEventListener("827", this.result_of_827, this);
		CustomEventMgr.removeEventListener("630", this.result_of_630, this);
		CustomEventMgr.removeEventListener("165", this.reuslt_of_165, this);

		CustomEventMgr.removeEventListener("Update Libao View", this.updateLibaoView, this);
		CustomEventMgr.removeEventListener("Update Sc View", this.updateScView, this);
		CustomEventMgr.removeEventListener("CheckOut DT Status", this.checkDailyTargetStates, this);

		// CustomEventMgr.removeEventListener("Update New Share", this.updateNewShare, this);
		CustomEventMgr.removeEventListener("Change Model Clothes", this.changeModelClothes, this);


		CustomEventMgr.removeEventListener("Update TL View", this.updateDlView, this);
		CustomEventMgr.removeEventListener("Hide TL", this.hideDlView, this);

		CustomEventMgr.removeEventListener("Talk Message", this.playGuideTalk, this);
		CustomEventMgr.removeEventListener("Guide_Step_1_1", this.onTouchRect, this);
		CustomEventMgr.removeEventListener("Guide_Step_1_2", this.onYlComp, this);
		CustomEventMgr.removeEventListener("Guide_Step_6", this.onBtnGashapon, this);
		CustomEventMgr.removeEventListener("Guide_Step_2_100", this.onYlComp, this);
		CustomEventMgr.removeEventListener("Guide_Step_5_100", this.onXtComp, this);

		this.niudanGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnGashapon, this);
		this.mailGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMailTap, this);

		this.leijiGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnLj, this);
		this.lbGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnLb, this);
		this.scGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnSc, this);
		this.dtGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnDt, this);
		this.hdGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHd, this);

		this.mcGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnMc, this);

		this.tlGroup2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnTl, this);

		this.shareGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);

		this.touchRect.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRect, this);

		this.btn_shequ.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSjComp, this);
		this.btn_xingtu.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onXtComp, this);
		this.btn_tonggao.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onYlComp, this);
		this.btn_shangdian.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSdComp, this);
		this.btn_jinji.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onJjComp, this);

		if (PlayerData.pkGuide == 1) {
			CustomEventMgr.removeEventListener("PkGuide_Step_2", this.onJjComp, this);
		}
	}

	private initView() {
		if (NewsData.mail > 0) {
			this.mailTip.visible = true;
			var tw_tip = egret.Tween.get(this.mailTip, { loop: true });
			tw_tip.to({ scaleX: 1.05, scaleY: 1.05 }, 300)
				.to({ scaleX: 1, scaleY: 1 }, 300);
		} else {
			this.mailTip.visible = false;
			egret.Tween.removeTweens(this.mailGroup);
			egret.Tween.removeTweens(this.mailTip);
		}

		// this.shareIndex = Math.floor(Math.random() * 3) + 1;
		// // this.curTextIndex = this.shareIndex;
		// this.newShare.source = "newshare_role_" + this.shareIndex + "_png";
		// this.newShareText.source = "newshare_text_" + this.shareIndex + "_png";
		// this.newShareText.mask = this.textMask;
		// this.newShareAnimationFirst();

		//限时礼包========
		this.checkoutTlDiscount();

		//邀请
		// if (ConstData.Conf.whiteList.indexOf(LoginData.sid) != -1 || window["OPEN_DATA"].openid == "aaaa") {
		// 	this.yqGroup.visible = true;
		// } else {
		// 	this.yqGroup.visible = false;
		// }

		// this.sj_comp.x = this.group.width * 0.12;
		// this.xt_comp.x = this.group.width * 0.28;
		// this.yl_comp.x = this.group.width * 0.50;
		// this.sd_comp.x = this.group.width * 0.72;
		// this.jj_comp.x = this.group.width * 0.88;

		// this.btn_shequ.x = this.btnGroup.width * 0.12;
		// this.btn_xingtu.x = this.btnGroup.width * 0.28;
		// this.btn_tonggao.x = this.btnGroup.width * 0.50;
		// this.btn_shangdian.x = this.btnGroup.width * 0.72;
		// this.btn_jinji.x = this.btnGroup.width * 0.88;
		var layout = new eui.HorizontalLayout();
		layout.horizontalAlign = "center";
		layout.verticalAlign = "center";
		layout.gap = (this.group.width - 30 - this.btn_shequ.width * 5) / 4; 
		this.btnGroup.layout = layout;

		//更新礼包视图
		this.updateLibaoView();
		//更新首冲视图
		this.updateScView();

		this.updateNewShare();

		this.model.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);

		if (PlayerData.mission <= 6) {
			// this.jj_comp["imgLock"].visible = true;
			this.imglock.visible = true;
		} else {
			// this.jj_comp["imgLock"].visible = false;
			this.imglock.visible = false;
		}

		this.btn_shequ.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSjComp, this);
		this.btn_xingtu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onXtComp, this);
		this.btn_tonggao.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onYlComp, this);
		this.btn_shangdian.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSdComp, this);
		this.btn_jinji.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onJjComp, this);

		// this.playCompAnimation();

		if (PlayerData.guide == 0) {
			var n = Math.floor(Math.random() * 3) + 4;
			this.timer = new egret.Timer(n * 1000, 0);
			this.timer.addEventListener(egret.TimerEvent.TIMER, this.createTalkComp, this);
			this.timer.start();
		}

		var tw_td_ac = egret.Tween.get(this.td_ac, { loop: true });
		tw_td_ac.to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);

		var tw_niudan = egret.Tween.get(this.niudan_ac, { loop: true });
		tw_niudan.to({ rotation: 10 }, 800).wait(Math.floor(Math.random() * 2) * (Math.floor(Math.random() * 5)) * 1000)
			.to({ rotation: 0 }, 800).wait(Math.floor(Math.random() * 2) * (Math.floor(Math.random() * 5)) * 1000)
			.to({ rotation: -10 }, 800).wait(Math.floor(Math.random() * 2) * (Math.floor(Math.random() * 5)) * 1000)
			.to({ rotation: 0 }, 800).wait(Math.floor(Math.random() * 2) * (Math.floor(Math.random() * 5)) * 1000);

		var tw_coin = egret.Tween.get(this.libao_ac, { loop: true });
		tw_coin.to({ rotation: 360 }, 4500);

		// var tw_sj = egret.Tween.get(this.sj_comp["tween"], { loop: true });
		// tw_sj.to({ scaleX: 1.1, scaleY: 1.1 }, 600)
		// 	.wait(100)
		// 	.to({ scaleX: 1, scaleY: 1 }, 700);

		// var tw_xt = egret.Tween.get(this.xt_comp["tween"], { loop: true });
		// tw_xt.to({ scaleX: 1.1, scaleY: 1.1 }, 600)
		// 	.wait(100)
		// 	.to({ scaleX: 1, scaleY: 1 }, 700);

		// var tw_yl = egret.Tween.get(this.yl_comp["tween"], { loop: true });
		// tw_yl.to({ scaleX: 1.1, scaleY: 1.1 }, 600)
		// 	.wait(100)
		// 	.to({ scaleX: 1, scaleY: 1 }, 700);

		// var tw_sd = egret.Tween.get(this.sd_comp["tween"], { loop: true });
		// tw_sd.to({ scaleX: 1.1, scaleY: 1.1 }, 600)
		// 	.wait(100)
		// 	.to({ scaleX: 1, scaleY: 1 }, 700);

		// var tw_jj = egret.Tween.get(this.jj_comp["tween"], { loop: true });
		// tw_jj.to({ scaleX: 1.1, scaleY: 1.1 }, 600)
		// 	.wait(100)
		// 	.to({ scaleX: 1, scaleY: 1 }, 700);
	}

	private createTalkComp() {
		var textArr = ["去聊聊天认识新朋友吧！", "技痒难耐，来一场竞技如何？", "想知道更多故事细节么？看看星途去", "要当大明星么？行动起来从去娱乐圈接通告开始。", "竞技胜利一次就有10钻石，还不快去！"]
		var text = textArr[Math.floor(Math.random() * textArr.length)];

		var comp = new TalkComp(text);
		comp.x = (this.group.width - comp.width) / 2;
		comp.y = 550;
		this.group.addChild(comp);
		this.timer.delay = (Math.floor(Math.random() * 5) + 12) * 1000;
	}

	private updateLibaoView() {
		if (WanbaData.packageData.indexOf("libao_1") == -1) {
			this.libao_icon.source = "newmain_ui_json.main_libao_1";
			this.libao_ac.source = "newmain_ui_json.main_coin_1";
			this.libao_text.source = "newmain_ui_json.main_coin_text_1";
		} else if (WanbaData.packageData.indexOf("libao_2") == -1) {
			this.libao_icon.source = "newmain_ui_json.main_libao_6";
			this.libao_ac.source = "newmain_ui_json.main_coin_6";
			this.libao_text.source = "newmain_ui_json.main_coin_text_6";
		} else if (WanbaData.packageData.indexOf("libao_3") == -1) {
			this.libao_icon.source = "newmain_ui_json.main_libao_30";
			this.libao_ac.source = "newmain_ui_json.main_coin_30";
			this.libao_text.source = "newmain_ui_json.main_coin_text_30";
		} else {
			this.lbGroup.visible = false;
		}
	}

	private updateScView() {

		if (ShareData.isFirstPay == false || ShareData.firstpay_lottery_times == 0) {
			this.sc_icon.source = "newmain_ui_json.main_ui_cz_bg";
			this.sc_text.source = "newmain_ui_json.main_shouchong_text";
		} else if (ShareData.isDailyPay == false || ShareData.dailypay_normal_times == 0 || ShareData.dailypay_lottery_times == 0) {
			this.sc_icon.source = "newmain_ui_json.main_daily_icon";
			this.sc_text.source = "newmain_ui_json.main_dialy_text";
		} else {
			this.sc_icon.source = "newmain_ui_json.main_ui_cz_bg";
			this.sc_text.source = "newmain_ui_json.main_ui_cz_text";
		}
	}

	private changeModelClothes() {
		this.model.takeOffAllClothes();
		this.model.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);
	}

	private checkoutTlDiscount() {
		if (TLDiscountData.leftTime <= 0) {
			if (Math.floor(Math.random() * 2) == 1) {
				var type: number = 6;
				var rand = Math.floor(Math.random() * 2);
				if (rand == 0) {
					type = 6;
				} else {
					type = 30;
				}
				console.log(type);
				var request = HttpProtocolMgr.take_timelimitDiscount_info_106(type);
				HttpMgr.postRequest(request);
			}
		} else {
			this.updateDlView();
			this.tlGroup.visible = true;
			var tw_tl_ac = egret.Tween.get(this.tl_ac, { loop: true });
			tw_tl_ac.to({ rotation: 360 }, 10000);
			var tw_tl_ac2 = egret.Tween.get(this.tl_ac, { loop: true });
			tw_tl_ac2.to({ alpha: 0 }, 300)
				.to({ alpha: 1 }, 300);
		}
	}

	private playCompAnimation() {
		// egret.Tween.get(this.sj_comp).to({ y: 820 }, 750, egret.Ease.backOut);
		// egret.Tween.get(this.xt_comp).to({ y: 930 }, 900, egret.Ease.backOut);
		// egret.Tween.get(this.yl_comp).to({ y: 975 }, 600, egret.Ease.backOut);
		// egret.Tween.get(this.sd_comp).to({ y: 930 }, 900, egret.Ease.backOut);
		// egret.Tween.get(this.jj_comp).to({ y: 820 }, 750, egret.Ease.backOut);
	}

	// private newShareAnimationFirst() {
	// 	var tw = egret.Tween.get(this.newShareText);
	// 	tw.to({ x: 74 }, 1500);
	// }

	private onBtnGashapon() {
		DisplayMgr.buttonScale(this.niudanGroup, function () {
			SoundManager.instance().buttonSound("pop");
			NetLoading.showLoading();
			var request: egret.URLRequest;
			if (GashaponData.has_init_gashapon_template()) {
				request = HttpProtocolMgr.gashapon_info_306(false);
			} else {
				request = HttpProtocolMgr.gashapon_info_306(true);
			}
			HttpMgr.postRequest(request);
		});
	}

	private onMailTap() {
		DisplayMgr.buttonScale(this.mailGroup, function () {
			SoundManager.instance().buttonSound("pop");
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.all_mails_700();
			HttpMgr.postRequest(request);
		});
	}

	private onChatComp() {
		NetLoading.showLoading();
		var request: egret.URLRequest = HttpProtocolMgr.social_info_800();
		HttpMgr.postRequest(request);
	}

	private onShare() {
		var self = this;
		DisplayMgr.buttonScale(this.shareGroup, function () {
			SoundManager.instance().buttonSound("pop");
			var panel = new ShareGroupPanel();
			DisplayMgr.set2Center(panel);
			self.stage.addChild(panel);
		});
	}

	private onBtnLj() {
		DisplayMgr.buttonScale(this.leijiGroup, function () {
			SoundManager.instance().buttonSound("pop");
			NetLoading.showLoading();
			var request: egret.URLRequest;
			if (RechargeData.has_init_purchase_template()) {
				request = HttpProtocolMgr.purchase_achievement_info_304(false);
			} else {
				request = HttpProtocolMgr.purchase_achievement_info_304(true);
			}
			HttpMgr.postRequest(request);
		});
	}

	private onBtnLb() {
		var self = this;
		DisplayMgr.buttonScale(this.lbGroup, function () {
			SoundManager.instance().buttonSound("pop");
			NetLoading.showLoading();
			var request = HttpProtocolMgr.take_package_info_104();
			HttpMgr.postRequest(request);
		});
	}

	private onBtnHd() {
		var self = this;
		DisplayMgr.buttonScale(this.hdGroup, function () {
			SoundManager.instance().buttonSound("pop");
			var panel = new HuodongPanel();
			DisplayMgr.set2Center(panel);
			self.stage.addChild(panel);
			// var panel = new NewHuodongPanel();
			// DisplayMgr.set2Center(panel);
			// self.stage.addChild(panel);
		});
	}

	private onBtnYq() {
		var self = this;
		DisplayMgr.buttonScale(this.yqGroup, function () {
			SoundManager.instance().buttonSound("pop");
			NetLoading.showLoading();
			var request = HttpProtocolMgr.take_invite_info_165();
			HttpMgr.postRequest(request);
		});
	}

	private onBtnSc() {
		var self = this;
		DisplayMgr.buttonScale(this.scGroup, function () {
			// NetLoading.showLoading();
			// var request = HttpProtocolMgr.all_products_100();
			// HttpMgr.postRequest(request);
			SoundManager.instance().buttonSound("pop");
			if (ShareData.isFirstPay && ShareData.firstpay_lottery_times == 1 && ShareData.isDailyPay && ShareData.dailypay_normal_times == 1 && ShareData.dailypay_lottery_times == 1) {
				//
				NetLoading.showLoading();
				var request = HttpProtocolMgr.all_products_100();
				HttpMgr.postRequest(request);
			} else if ((ShareData.isFirstPay == false) || (ShareData.isFirstPay && ShareData.firstpay_lottery_times == 0)) {
				var panel = new FirstPayPanel();
				DisplayMgr.set2Center(panel);
				self.stage.addChild(panel);
			} else {
				var onePanel = new ScPanel();
				DisplayMgr.set2Center(onePanel);
				self.stage.addChild(onePanel);
			}
		});
	}

	private onBtnDt() {
		WelfareData.isBtnReq = true;
		var self = this;
		DisplayMgr.buttonScale(this.dtGroup, function () {
			SoundManager.instance().buttonSound("pop");
			NetLoading.showLoading();
			var request = HttpProtocolMgr.take_welfare_data_630();
			HttpMgr.postRequest(request);
		});
	}

	private onBtnTl() {
		var self = this;
		DisplayMgr.buttonScale(this.tlGroup2, function () {
			SoundManager.instance().buttonSound("pop");
			var panel = new LimitDiscountPanel(TLDiscountData.type);
			DisplayMgr.set2Center(panel);
			self.stage.addChild(panel);
		});
	}

	private onBtnMc() {
		var self = this;
		DisplayMgr.buttonScale(this.mcGroup, function () {
			SoundManager.instance().buttonSound("pop");
			var panel = new MonthCardPanel();
			DisplayMgr.set2Center(panel);
			self.stage.addChild(panel);
		});
	}

	private onTouchRect() {
		// this.onBtnGo();
	}

	private onSjComp() {
		DisplayMgr.buttonScale(this.btn_shequ, function () {
			SoundManager.instance().buttonSound();
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.social_info_800();
			HttpMgr.postRequest(request);
		});
	}

	private onXtComp() {
		DisplayMgr.buttonScale(this.btn_xingtu, function () {
			SoundManager.instance().buttonSound();
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.fetchStoryData_500();
			HttpMgr.postRequest(request);
		});
	}

	private onYlComp() {
		DisplayMgr.buttonScale(this.btn_tonggao, function () {
			SoundManager.instance().buttonSound();
			NetLoading.showLoading();
			if (true === CofferData.hasInitTemplateData()) {
				var request: egret.URLRequest = HttpProtocolMgr.cofferInfo_200(false);
				HttpMgr.postRequest(request);
			}
			else {
				var request: egret.URLRequest = HttpProtocolMgr.cofferInfo_200(true);
				HttpMgr.postRequest(request);
			}
		});
	}

	private onSdComp() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_shangdian, function () {
			SoundManager.instance().buttonSound();
			if (ClothesData.hasFetchedUserClohtes()) {
				self.afterFetchClothesData_400(null);
			}
			else {
				NetLoading.showLoading();
				var request: egret.URLRequest = HttpProtocolMgr.fetchOwnClothesData_400();
				HttpMgr.postRequest(request);
			}
		});
	}

	private onJjComp() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_jinji, function () {
			SoundManager.instance().buttonSound();
			if (PlayerData.mission <= 6) {
				Prompt.showPrompt(self.stage, "完成娱乐圈任务6之后解锁");
				return;
			}

			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.competition_info_820(!CompetitionData.hasInitRankInfo());
			HttpMgr.postRequest(request);
		});
	}

	private afterTakePackageInfo_104() {
		NetLoading.removeLoading();
		var panel: eui.Component = null;
		if (WanbaData.packageData.indexOf("libao_1") == -1) {
			panel = new OnePanel();
		} else if (WanbaData.packageData.indexOf("libao_2") == -1) {
			panel = new SixPanel();
		} else if (WanbaData.packageData.indexOf("libao_3") == -1) {
			panel = new ThirtyPanel();
		}

		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}

	private result_of_106() {
		this.tlGroup.visible = true;
		var tw_tl_ac = egret.Tween.get(this.tl_ac, { loop: true });
		tw_tl_ac.to({ rotation: 360 }, 10000);
		var tw_tl_ac2 = egret.Tween.get(this.tl_ac, { loop: true });
		tw_tl_ac2.to({ alpha: 0 }, 300)
			.to({ alpha: 1 }, 300);
	}

	private updateDlView() {
		var leftTime = TLDiscountData.leftTime;
		var min = Math.floor(leftTime / 60);
		var sec = leftTime - min * 60;
		this.tlTime.text = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
	}

	private hideDlView() {
		this.tlGroup.visible = false;
	}

	private result_of_302(evt: egret.Event) {
		NetLoading.removeLoading();
		var panel = new SigninPanel();
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}

	private result_of_312(evt: egret.Event) {
		NetLoading.removeLoading();
		var panel = new NewSignPanel();
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}

	private result_of_304(evt: egret.Event) {
		NetLoading.removeLoading();
		var panel = new RechargePanel();
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}

	private result_of_306(evt: egret.Event) {
		NetLoading.removeLoading();
		var panel = new GashaponPanel();
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}

	private afterFetchOwnClothes_400() {
		NetLoading.removeLoading();
		SceneMgr.gotoDressScene(null, null, null, null);
	}

	private result_of_160() {
		DiscountData.isOk = true;
		var request: egret.URLRequest;
		request = HttpProtocolMgr.fetchOwnClothesData_400();
		HttpMgr.postRequest(request);
	}

	private reuslt_of_165() {
		NetLoading.removeLoading();
		var panel = new InvitePanel();
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}

	private afterFetchTujianData_114() {
		NetLoading.removeLoading();
		RES.getResAsync("tujian_list_json", (data, key) => {
			var panel = new TujianPanel(data);
			DisplayMgr.set2Center(panel);
			this.stage.addChild(panel);
		}, this);
	}

	// private result_of_175(evt: egret.Event) {
	// 	if (evt.data.type == "do_share_reward") {
	// 		ShareData.isShowNewShare = false;
	// 		this.newShareGroup.visible = ShareData.isShowNewShare;
	// 	}

	// 	var data: {} = evt.data.reward;
	// 	var reward: {}[] = [];
	// 	for (var i in data) {
	// 		var item = { type: i, num: data[i] };
	// 		reward.push(item);
	// 	}
	// 	this.playRewardAnimation(reward);
	// }

	private playRewardAnimation(reward: {}[]) {
		var panel = new CommonRewardPanel(reward);
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);

		CustomEventMgr.dispatchEventWith("Update Player Info", false);
	}

	private updateNewShare() {
		var index = (Math.floor(Math.random() * 3) + 1);
		this.shareImg.source = "mian_share_icon_" + index + "_png";
		this.shareText.source = "main_role_text_" + index + "_png";
	}

	private afterFetchStoryData_500(evt: egret.Event) {
		if (EventData.isEventReq) {
			return;
		}

		if (this.isTask) {
			if (true === TaskData.hasInitUserData()) {
				this.afterFetchMissionData_600(null);
			}
			else {
				var request: egret.URLRequest = HttpProtocolMgr.fetchMissionData_600();
				HttpMgr.postRequest(request);
			}
		} else {
			NetLoading.removeLoading();
			// SoundManager.instance().destroyStartSound();
			SceneMgr.gotoNewStorySelectScene();
		}
	}

	private afterFetchMissionData_600(evt: egret.Event) {
		if (!EventData.isEventReq) {
			NetLoading.removeLoading();
			EventData.isEventReq = false;
			SceneMgr.gotoTaskScene(PlayerData.phase, PlayerData.mission);
		}
	}

	private result_of_630() {
		if (WelfareData.isBtnReq) {
			NetLoading.removeLoading();
			var panel = new DailyTargetPanel();
			DisplayMgr.set2Center(panel);
			egret.MainContext.instance.stage.addChild(panel);
		} else {
			this.checkDailyTargetStates();
		}
	}

	private checkDailyTargetStates() {
		var items = WelfareData.items;
		var item_len = items.length;
		var statics = WelfareData.statis;

		for (var i = 0; i < item_len; i++) {
			if (items[i]["status"] == 1) {
				this.showDailyTargetTip();
				return;
			}
		}

		for (var p in statics) {
			if (statics[p]["status"] == 1) {
				this.showDailyTargetTip();
				return;
			}
		}

		this.hideDailyTargetTip();
	}

	private showDailyTargetTip() {
		this.dt_tip.visible = true;
		var tw_tip = egret.Tween.get(this.dt_tip, { loop: true });
		tw_tip.to({ scaleX: 1.05, scaleY: 1.05 }, 300);
	}

	private hideDailyTargetTip() {
		this.dt_tip.visible = false;
		egret.Tween.removeTweens(this.dt_tip);
	}

	private result_of_820(evt: egret.Event) {
		// NetLoading.removeLoading();
		// SceneMgr.gotoPK();
		var request = HttpProtocolMgr.competition_prepare_827();
		HttpMgr.postRequest(request);
	}

	private result_of_827() {
		NetLoading.removeLoading();
		SceneMgr.gotoPK();
	}

	private afterSocialInfo_800(evt: egret.Event) {
		NetLoading.removeLoading();
		SceneMgr.gotoMainFriend();
	}

	private afterFetchClothesData_400(evt: egret.Event) {
		NetLoading.removeLoading();
		SceneMgr.gotoShopScene();
	}

	private afterCoffersInfo_200(evt: egret.Event) {
		EventData.isEventReq = false;
		if (StoryData.has_init_story()) {
			if (true === TaskData.hasInitUserData()) {
				this.afterFetchMissionData_600(null);
			}
			else {
				var request: egret.URLRequest = HttpProtocolMgr.fetchMissionData_600();
				HttpMgr.postRequest(request);
			}
		} else {
			this.isTask = true;
			NetLoading.showLoading();
			var request: egret.URLRequest = HttpProtocolMgr.fetchStoryData_500();
			HttpMgr.postRequest(request);
		}


	}

	private afterHomeInfo_704() {
		NetLoading.removeLoading();
	}

	private afterFetchMailData_700() {
		egret.Tween.removeTweens(this.mailGroup);
		egret.Tween.removeTweens(this.mailTip);
		this.mailTip.visible = false;
		NetLoading.removeLoading();
		var panel = new EmailPanel();
		DisplayMgr.set2Center(panel);
		egret.MainContext.instance.stage.addChild(panel);
	}

	private result_of_910() {
		if (NewsData.mail > 0) {
			// var tw_mailGroup = egret.Tween.get(this.mailGroup, {loop: true});
			// tw_mailGroup
			// .to({rotation: 8}, 150)
			// .to({rotation: 0}, 150)
			// .to({rotation: -8}, 150)
			// .to({rotation: 0}, 150)
			// .to({rotation: 8}, 150)
			// .to({rotation: 0}, 150)
			// .to({rotation: -8}, 150)
			// .to({rotation: 0}, 150)
			// .wait(2000);

			this.mailTip.visible = true;
			var tw_tip = egret.Tween.get(this.mailTip, { loop: true });
			tw_tip.to({ scaleX: 1.05, scaleY: 1.05 }, 300)
				.to({ scaleX: 1, scaleY: 1 }, 300);
		} else {
			this.mailTip.visible = false;
			egret.Tween.removeTweens(this.mailGroup);
			egret.Tween.removeTweens(this.mailTip);
		}

		if (NewsData.energy1 == 1 || NewsData.energy2 == 1) {
			this.hd_tip.visible = true;
			var tw_hd_tip = egret.Tween.get(this.hd_tip, { loop: true });
			tw_hd_tip.to({ scaleX: 1.05, scaleY: 1.05 }, 300)
				.to({ scaleX: 1, scaleY: 1 }, 300);
		} else {
			this.hd_tip.visible = false;
			egret.Tween.removeTweens(this.hd_tip);
		}
	}

	private result_of_301(evt: egret.Event) {
		NetLoading.removeLoading();
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		Prompt.showPrompt(this.stage, "成功领取" + evt.data + "体力");
		if (this.hd_tip.visible) {
			this.hd_tip.visible = false;
			egret.Tween.removeTweens(this.hd_tip);
		}
	}

	//-----------guide----------
	private playGuideTalk(evt: egret.Event) {
		var comp = new TalkComp(evt.data);
		comp.x = (this.group.width - comp.width) / 2;
		comp.y = 550;
		this.group.addChild(comp);
	}
}