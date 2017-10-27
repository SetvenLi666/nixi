class NewGuidePanel extends eui.Component {
	public group: eui.Group;
	public acGroup: eui.Group;
	public imgQuan: eui.Image;
	public imgFinger: eui.Image;
	public diamGroup: eui.Group;

	private isComplete: boolean = false;

	private rect_1: eui.Rect;
	private rect_2: eui.Rect;


	public constructor() {
		super();

		this.skinName = "NewGuidePanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.acGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.fingerCallback, this);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGroup, this);

		this.initGuidePanel();

		CustomEventMgr.addEventListener("Play Guide Animation", this.playAnimation, this);
		CustomEventMgr.addEventListener("905", this.result_of_905, this);
		CustomEventMgr.addEventListener("174", this.result_of_174, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("Play Guide Animation", this.playAnimation, this);
		CustomEventMgr.removeEventListener("905", this.result_of_905, this);
		CustomEventMgr.removeEventListener("174", this.result_of_174, this);
	}

	private initGuidePanel() {
		this.currentState = "guide_step_" + PlayerData.guide;
		this.imgFinger.scaleX = 0.8;
		this.imgFinger.scaleY = 0.8;

		this.beginGuide();
	}

	private beginGuide() {
		if (PlayerData.guide == 1) {
			this.eyesAnimation();
		}
	}

	private fingerCallback() {
		console.log("on finger touch");
		console.log(PlayerData.guide);
		console.log(this.currentState);
		if (PlayerData.guide == 1) {
			if (this.currentState == "guide_step_1_2") {
				this.updatePlayerGuideStep(2);
				// CustomEventMgr.dispatchEventWith("Guide_Step_1_2", false);
			} else if (this.currentState == "guide_step_1") {
				this.stopAnimation();
				var self = this;
				CustomEventMgr.dispatchEventWith("Guide_Step_1_1", false);
				egret.setTimeout(function () {
					self.currentState = "guide_step_1_2";
					CustomEventMgr.dispatchEventWith("Talk Message", false, "功能界面在这里，先去工作吧")
				}, this, 1500);
			}
		} else if (PlayerData.guide == 2) {
			if (this.currentState == "guide_step_2_2") {
				CustomEventMgr.dispatchEventWith("Show DialogComp", false, 1);
				this.currentState = "guide_step_2_3";
				this.playAnimation();
			} else if (this.currentState == "guide_step_2_3") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_3", false);
				this.currentState = "guide_step_2_4";
			} else if (this.currentState == "guide_step_2_4") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_4", false);
				this.closeGuidePanel();
			} else if (this.currentState == "guide_step_2_5") {
				PlayerData.guide = 3;
				CustomEventMgr.dispatchEventWith("Guide_Step_2_5", false);
			} else if (this.currentState == "guide_step_2_100") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_100", false);
			}
		} else if (PlayerData.guide == 3) {
			if (this.currentState == "guide_step_2_6") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_6", false);
			} else if (this.currentState == "guide_step_2_7") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_7", false);
				this.currentState = "guide_step_2_9";
			} else if (this.currentState == "guide_step_2_8") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_8", false);
				this.currentState = "guide_step_2_9";
			} else if (this.currentState == "guide_step_2_9") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_9", false);
				this.currentState = "guide_step_2_10";
			} else if (this.currentState == "guide_step_2_10") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_10", false);
				this.currentState = "guide_step_2_12";
			} else if (this.currentState == "guide_step_2_11") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_11", false);
				this.currentState = "guide_step_2_12";
			} else if (this.currentState == "guide_step_2_12") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_9", false);
				this.currentState = "guide_step_2_25";
			} else if (this.currentState == "guide_step_2_25") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_25", false);
				this.currentState = "guide_step_2_26";
			} else if (this.currentState == "guide_step_2_26") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_9", false);
				this.currentState = "guide_step_2_27";
			} else if (this.currentState == "guide_step_2_27") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_9", false);
				this.currentState = "guide_step_2_28";
			} else if (this.currentState == "guide_step_2_28") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_9", false);
				this.currentState = "guide_step_2_13";
			} else if (this.currentState == "guide_step_2_13") {
				PlayerData.guide = 4;
				CustomEventMgr.dispatchEventWith("Guide_Step_2_13", false);
			}
		} else if (PlayerData.guide == 4) {
			if (this.currentState == "guide_step_2_14") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_14", false);
				this.currentState = "guide_step_2_15";
			} else if (this.currentState == "guide_step_2_15") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_15", false);
				this.currentState = "guide_step_2_16";
			} else if (this.currentState == "guide_step_2_16") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_16", false);
				this.currentState = "guide_step_2_17";
			} else if (this.currentState == "guide_step_2_17") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_17", false);
				this.currentState = "guide_step_2_19";
			} else if (this.currentState == "guide_step_2_19") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_19", false);
				this.currentState = "guide_step_2_20";
			} else if (this.currentState == "guide_step_2_20") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_20", false);
				this.currentState = "guide_step_2_21";
			} else if (this.currentState == "guide_step_2_21") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_21", false);
				this.currentState = "guide_step_2_22";
			} else if (this.currentState == "guide_step_2_22") {
				CustomEventMgr.dispatchEventWith("Guide_Step_2_22", false);
				this.currentState = "guide_step_2_18";
			} else if (this.currentState == "guide_step_2_18") {
				// this.updatePlayerGuideStep(5);
				CustomEventMgr.dispatchEventWith("Guide_Step_2_18", false);
			}
		} else if (PlayerData.guide == 5) {
			if (this.currentState == "guide_step_5") {
				CustomEventMgr.dispatchEventWith("Guide_Step_5", false);
				this.closeGuidePanel();
			} else if (this.currentState == "guide_step_5_1") {
				CustomEventMgr.dispatchEventWith("Guide_Step_5_1", false);
			} else if (this.currentState == "guide_step_5_3") {
				CustomEventMgr.dispatchEventWith("Guide_Step_5_3", false);
			} else if (this.currentState == "guide_step_5_4") {
				CustomEventMgr.dispatchEventWith("Guide_Step_5_4", false);
			} else if (this.currentState == "guide_step_5_5") {
				CustomEventMgr.dispatchEventWith("Guide_Step_5_5", false);
				this.closeGuidePanel();
			} else if (this.currentState == "guide_step_5_100") {
				CustomEventMgr.dispatchEventWith("Guide_Step_5_100", false);
			}
		} else if (PlayerData.guide == 6) {
			if (this.currentState == "guide_step_6") {
				CustomEventMgr.dispatchEventWith("Guide_Step_6", false);
				this.currentState = "guide_step_6_1";
			} else if (this.currentState == "guide_step_6_1") {
				this.updatePlayerGuideStep(0);
			} else if (this.currentState == "guide_step_6_11") {
				CustomEventMgr.dispatchEventWith("Guide_Step_6_11", false);
				this.closeGuidePanel();
			} else if (this.currentState == "guide_step_6_13") {
				CustomEventMgr.dispatchEventWith("Guide_Step_6_13", false);
			} else if (ClientMapData.taskGuide && ClientMapData.taskGuide == 2 && this.currentState == "guide_step_6_16") {
				CustomEventMgr.dispatchEventWith("Guide_Step_6_16", false);
				this.closeGuidePanel();
			} else if (ClientMapData.taskGuide && ClientMapData.taskGuide == 3 && this.currentState == "guide_step_6_17") {
				CustomEventMgr.dispatchEventWith("Guide_Step_6_17", false);
				this.closeGuidePanel();
			} else if (ClientMapData.taskGuide && ClientMapData.taskGuide == 4 && this.currentState == "guide_step_6_18") {
				CustomEventMgr.dispatchEventWith("Guide_Step_6_18", false);
				this.closeGuidePanel();
			}
		} else if (ClientMapData.taskGuide && ClientMapData.taskGuide == 2 && this.currentState == "guide_step_6_16") {
			CustomEventMgr.dispatchEventWith("Guide_Step_6_16", false);
			this.closeGuidePanel();
		} else if (ClientMapData.taskGuide && ClientMapData.taskGuide == 3 && this.currentState == "guide_step_6_17") {
			CustomEventMgr.dispatchEventWith("Guide_Step_6_17", false);
			this.closeGuidePanel();
		} else if (ClientMapData.taskGuide && ClientMapData.taskGuide == 4 && this.currentState == "guide_step_6_18") {
			CustomEventMgr.dispatchEventWith("Guide_Step_6_18", false);
			this.closeGuidePanel();
		}
	}

	private onGroup() {
		if (PlayerData.guide == 2) {
			if (this.currentState == "guide_step_2") {
				this.currentState = "guide_step_2_30";
			} else if (this.currentState == "guide_step_2_30") {
				this.currentState = "guide_step_2_1";
				this.playAnimation();
				this.acGroup.touchEnabled = false;
			} else if (this.currentState == "guide_step_2_1") {
				this.currentState = "guide_step_2_2";
				this.playAnimation();
			}
		} else if (PlayerData.guide == 5) {
			if (this.currentState == "guide_step_5_2") {
				this.currentState = "guide_step_5_3";
				this.playAnimation();
			} else if (this.currentState == "guide_step_5_10") {
				this.closeGuidePanel();
			}
		} else if (PlayerData.guide == 6) {
			// if(this.currentState == "guide_step_6_10") {
			// 	this.closeGuidePanel();
			// }
			if (this.currentState == "guide_step_6_12") {
				this.currentState = "guide_step_6_13";
				this.playAnimation();
			}
			else if (this.currentState == "guide_step_6_14" && ClientMapData.taskGuide && ClientMapData.taskGuide == 2) {
				this.currentState = "guide_step_6_15";
			} else if (this.currentState == "guide_step_6_15" && ClientMapData.taskGuide && ClientMapData.taskGuide == 2) {
				// this.group.touchEnabled = false;
				if (this.diamGroup && !this.isComplete) {
					this.isComplete = true;
					NetLoading.showLoading();
					var request = HttpProtocolMgr.take_guide_reward_174();
					HttpMgr.postRequest(request);
				}
			}else if(this.currentState == "guide_step_6_16" && ClientMapData.taskGuide && ClientMapData.taskGuide == 2) {
				this.closeGuidePanel();
			}else if(this.currentState == "guide_step_6_17" && ClientMapData.taskGuide && ClientMapData.taskGuide == 3) {
				this.closeGuidePanel();
			}else if(this.currentState == "guide_step_6_18" && ClientMapData.taskGuide && ClientMapData.taskGuide == 4) {
				this.closeGuidePanel();
			}
			
		} else if (ClientMapData.taskGuide && ClientMapData.taskGuide == 2) {
			if (this.currentState == "guide_step_6_14") {
				this.currentState = "guide_step_6_15";
			} else if (this.currentState == "guide_step_6_15") {
				// this.group.touchEnabled = false;
				if (this.diamGroup && !this.isComplete) {
					this.isComplete = true;
					NetLoading.showLoading();
					var request = HttpProtocolMgr.take_guide_reward_174();
					HttpMgr.postRequest(request);
				}
			}else if(this.currentState == "guide_step_6_16") {
				this.closeGuidePanel();
			}
		}else if(PlayerData.guide == 0) {
			if(this.currentState == "guide_step_6_16" && ClientMapData.taskGuide && ClientMapData.taskGuide == 2) {
				this.closeGuidePanel();
			}else if(this.currentState == "guide_step_6_17" && ClientMapData.taskGuide && ClientMapData.taskGuide == 3) {
				this.closeGuidePanel();
			}else if(this.currentState == "guide_step_6_18" && ClientMapData.taskGuide && ClientMapData.taskGuide == 4) {
				this.closeGuidePanel();
			}
		}
	}

	public playAnimation() {
		var self = this;
		this.acGroup.visible = true;

		var tw_1 = egret.Tween.get(this.imgFinger, { loop: true });

		tw_1.to({ scaleX: 0.6, scaleY: 0.6 }, 500).call(function () {
			var tw_2 = egret.Tween.get(self.imgQuan);
			tw_2.to({ source: "newguide_quan_1_png" })
				.wait(100)
				.to({ source: "newguide_quan_2_png" })
				.wait(100)
				.to({ source: "newguide_quan_3_png" })
				.wait(100)
				.to({ source: "newguide_quan_4_png" })
				.wait(100)
				.to({ source: "" }, 50);
		}, this)
			.to({ scaleX: 0.8, scaleY: 0.8 }, 500);
	}

	private stopAnimation() {
		this.acGroup.visible = false;
		egret.Tween.removeTweens(this.imgFinger);
	}

	private eyesAnimation() {
		var tw1 = egret.Tween.get(this.rect_1);
		var endy1 = this.rect_1.y - 100;
		var tw2 = egret.Tween.get(this.rect_2);
		var endy2 = this.rect_2.y + 100;

		tw1.to({ y: 0}, 1000);

		tw2.to({y: 1136}, 1000)
			.call(function () {
				CustomEventMgr.dispatchEventWith("Talk Message", false, "糟了！睡过头了!\n得赶紧工作了~");
			}, this);
	}

	private updatePlayerGuideStep(num: number) {
		var request = HttpProtocolMgr.update_guide_905(num);
		HttpMgr.postRequest(request);
	}

	private result_of_905() {
		if (this.currentState == "guide_step_1_2") {
			CustomEventMgr.dispatchEventWith("Guide_Step_1_2", false);
		} else if (this.currentState == "guide_step_2_18") {
			// CustomEventMgr.dispatchEventWith("Guide_Step_2_18", false);
		} else if (this.currentState == "guide_step_6_1") {
			CustomEventMgr.dispatchEventWith("Guide_Step_6_1", false);
			this.closeGuidePanel();
		}
	}

	private result_of_174() {
		this.group.touchEnabled = true;
		NetLoading.removeLoading();

		var endx = this.group.width / 2 - 160;
		var endy = 90;

		var tw = egret.Tween.get(this.diamGroup);
		tw.to({ scaleX: 1.2, scaleY: 1.2 }, 500, egret.Ease.backOut).wait(300).to({ x: endx, y: endy, scaleX: 0.3, scaleY: 0.3 }, 1000).to({ alpha: 0 }, 200).call(function () {
			CustomEventMgr.dispatchEventWith("Update Player Info", false);
			// this.closeGuidePanel();
			this.currentState = "guide_step_6_16";
		}, this);
	}

	private closeGuidePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}