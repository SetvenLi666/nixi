class DailyTargetPanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public pgComp: DailyTargetProgressComp;
	public list: eui.List;

	public constructor() {
		super();

		this.skinName = "DailyTargetPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.list.dataProvider = new eui.ArrayCollection(WelfareData.items);
		this.list.itemRenderer = DailyTargetItemRenderer;

		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);
		CustomEventMgr.addEventListener("631", this.result_of_631, this);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("631", this.result_of_631, this);
	}

	private result_of_631(evt: egret.Event) {
		NetLoading.removeLoading();
		CustomEventMgr.dispatchEventWith("Update Player Info", false);
		CustomEventMgr.dispatchEventWith("CheckOut DT Status", false);
		this.pgComp.updateView();
		this.list.dataProvider = new eui.ArrayCollection(WelfareData.items);
		
		var reward: {} = {
				type: WelfareData.itemsObj[evt.data]["type"],
				num: WelfareData.itemsObj[evt.data]["num"]
			};
		var rewArr: {}[] = [];
		rewArr.push(reward);
		var panel = new CommonRewardPanel(rewArr);
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}

	private touchTap(evt: egret.TouchEvent) {
		var rectAngle = this.bg.getTransformedBounds(this.stage);
		if (!rectAngle.contains(evt.stageX, evt.stageY)) {
			this.closePanel();
		}
	}

	private closePanel() {
		if(this.parent) {
			WelfareData.isBtnReq = false;
			this.parent.removeChild(this);
		}
	}
}



class DailyTargetItemRenderer extends eui.ItemRenderer {
	public bg: eui.Image;
	public taskText: eui.Label;
	public typeImg: eui.Image;
	public rewText: eui.Label;
	public btnGroup: eui.Group;
	public btnImg: eui.Image;
	public pgText: eui.Label;

	public constructor() {
		super();

		this.skinName = "DailyTargetItemRendererSkin";
	}

	protected createChildren() {
		super.createChildren();

		this.btnGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnGroup, this);
	}

	protected dataChanged() {
		if (this.itemIndex % 2) {
			this.bg.source = "panel_dt_itembg_1_png";
		} else {
			this.bg.source = "panel_dt_itembg_2_png";
		}

		this.taskText.text = this.data.name;
		this.typeImg.source = "panel_dt_bar_" + this.data.type + "_png";
		this.rewText.text = this.data.num;
		this.pgText.text = this.data.progress + "/" + this.data.goal;

		if (this.data.status == 0) {
			this.btnGroup.touchEnabled = false;
			this.btnImg.source = "panel_dt_btn_0_png";
			this.pgText.visible = true;
		} else if (this.data.status == 1) {
			this.btnGroup.touchEnabled = true;
			this.btnImg.source = "panel_dt_btn_1_png";
			this.pgText.visible = false;
		} else if (this.data.status == -1) {
			this.btnGroup.touchEnabled = false;
			this.btnImg.source = "panel_dt_btn_2_png"
			this.pgText.visible = false;
		}
	}

	private onBtnGroup() {
		var self = this;
		DisplayMgr.buttonScale(this.btnGroup, function () {
			SoundManager.instance().buttonSound();
			NetLoading.showLoading();
			var request = HttpProtocolMgr.take_welfare_reward_631(self.data.id);
			HttpMgr.postRequest(request);
		});
	}
}