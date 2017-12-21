class ShuangdanSignPanel extends eui.Component {
	public group: eui.Group;
	public bg: eui.Image;
	public item_6: ShuangdanItem;
	public item_7: ShuangdanItem;
	public item_5: ShuangdanItem;
	public item_3: ShuangdanItem;
	public item_4: ShuangdanItem;
	public item_2: ShuangdanItem;
	public item_0: ShuangdanItem;
	public item_1: ShuangdanItem;

	public btnShare: eui.Image;

	public model: Model;

	private targetItem: ShuangdanItem = null;
	private itemsData: {}[];

	public constructor() {
		super();

		this.skinName = "ShuangdanSignPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);

		this.itemsData = ShuangdanData.template;
		this.initView();

		this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);

		CustomEventMgr.addEventListener("341", this.result_of_341, this);
	}

	private onExit() {
		CustomEventMgr.removeEventListener("341", this.result_of_341, this);
	}

	private initView() {
		var len = this.itemsData.length;
		for (var i = 0; i < len; i++) {
			var id: number = parseInt(this.itemsData[i]["uri"]);
			var part: string = Math.floor(id / 10000) + "";
			var sub_part: string;
			var tempData = ClothesData.clothesTemplateData(part, id + "");
			if (part == "7") {
				sub_part = tempData["sub_part"];
			} else {
				sub_part = tempData["part"];
			}

			this.model.dressItem(sub_part, id);
			this.model.dressItemOfSuit(sub_part, id);

			var item = <ShuangdanItem>this["item_" + i];
			item.icon.source = "icon" + id + "_png";
			item.clothes_name.text = tempData["name"];
			item.id = this.itemsData[i]["id"];

			var state: number = ShuangdanData.info[this.itemsData[i]["id"]];
			if(state == 0) {
				item.currentState = "unuse";
			}else if(state == 1) {
				item.currentState = "canuse";
			}else if(state == 2) {
				item.currentState = "used";
			}else if(state == 3) {
				item.currentState = "timeout";
			}

			item.btn_rev.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onItemTouched, this);
		}
	}

	private onItemTouched(evt: egret.TouchEvent) {
		SoundManager.instance().buttonSound();
		NetLoading.showLoading();
		console.log(evt.currentTarget.parent.id);
		this.targetItem = <ShuangdanItem>(evt.currentTarget.parent);
		var request: egret.URLRequest = HttpProtocolMgr.take_shuangdan_reward_341(evt.currentTarget.parent.id);
		HttpMgr.postRequest(request);
	}

	private onShare() {
		DisplayMgr.buttonScale(this.btnShare, function() {
			ShareData.share("shuangdan");
		});
	}

	private result_of_341() {
		NetLoading.removeLoading();
		this.targetItem.currentState = "used";
		Prompt.showPrompt(this.stage, "领取成功");
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
}


class ShuangdanItem extends eui.Component {
	public icon: eui.Image;
	public clothes_name: eui.Label;
	public btn_rev: eui.Image;
	public id: string = "0";

	public constructor() {
		super();

		this.skinName = "ShuangdanItemSkin";
	}
}