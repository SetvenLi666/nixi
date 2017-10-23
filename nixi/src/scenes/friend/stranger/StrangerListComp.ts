class StrangerListComp extends eui.Component {
	public group: eui.Group;
	public btn_back: eui.Image;
	public btn_refresh: eui.Image;
	public btn_find: eui.Image;
	public btn_note: eui.Image;
	public scroller: eui.Scroller;
	public list: eui.List;
	public selfComp: eui.Image;
	// public shower: Shower;
	public model: Model;
	private curSelected: number;

	public constructor() {
		super();

		this.skinName = "StrangerComp";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.model.x = ((this.group.width - 218) - this.model.width * this.model.scaleX) / 2;

		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goBack, this);
		this.btn_refresh.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRefresh, this);
		this.btn_find.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFind, this);
		this.btn_note.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNote, this);

		this.list.dataProvider = new eui.ArrayCollection(StrangerData.strangerList);
		this.list.itemRenderer = StrangerListRenderer;
		this.list.selectedIndex = 0;
		this.curSelected = this.list.selectedIndex;
		this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelected, this);

		if (StrangerData.strangerList.length == 0) {
			this.model.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);
		} else {
			this.model.dressClothesOfSuit(StrangerData.strangerObj[StrangerData.strangerList[0]]["ondress"], StrangerData.strangerObj[StrangerData.strangerList[0]]["ornaments"]);
		}

		CustomEventMgr.addEventListener("802", this.afterFetchStrangerData_802, this);
		CustomEventMgr.addEventListener("803", this.afterSendMessage_803, this);
		CustomEventMgr.addEventListener("605", this.afterData_605, this);
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("803", this.afterSendMessage_803, this);
		CustomEventMgr.removeEventListener("802", this.afterFetchStrangerData_802, this);
		CustomEventMgr.removeEventListener("605", this.afterData_605, this);

		this.list.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelected, this);

		this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goBack, this);
		this.btn_refresh.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRefresh, this);
		this.btn_find.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onFind, this);
		this.btn_note.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onNote, this);

		egret.Tween.removeAllTweens();
	}

	private onSelected(evt: eui.ItemTapEvent) {
		egret.log("on selected");
		if (this.curSelected != evt.itemIndex) {
			this.curSelected = evt.itemIndex;
			this.model.x = -this.group.width;
			this.model.dressClothesOfSuit(StrangerData.strangerObj[evt.item]["ondress"], StrangerData.strangerObj[evt.item]["ornaments"]);
			
			this.playAnimation();
		}
	}

	private playAnimation() {
		var self = this;
		self.model.x = -self.model.width * self.model.scaleX - 200;
		var tw = egret.Tween.get(self.model);
		tw.to({x: ((this.group.width - 218) - self.model.width * self.model.scaleX) / 2}, 500);
	}

	private onRefresh() {
		NetLoading.showLoading();
		DisplayMgr.buttonScale(this.btn_refresh, function () {
			var request: egret.URLRequest = HttpProtocolMgr.strangerListData_802();
			HttpMgr.postRequest(request);
		});
	}

	private onFind() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_find, function () {
			var findPanel = new FindPanelComp();
			self.addChild(findPanel);
		});
	}

	private onNote() {
		var self = this;
		DisplayMgr.buttonScale(this.btn_note, function () {
			var id: string = StrangerData.strangerList[self.list.selectedIndex];
			var nickname: string = StrangerData.strangerObj[id]["nickname"];
			var notePanel = new NotePanelComp(id, nickname);
			self.addChild(notePanel);
		});
	}

	private goBack() {
		DisplayMgr.buttonScale(this.btn_back, function () {
			if (TaskData.gameTask) {
				NetLoading.showLoading();
				var request = HttpProtocolMgr.commit_extra_mission_605(TaskData.taskTempID, 4, TaskData.taskFlag4);
				HttpMgr.postRequest(request);
			} else {
				SceneMgr.gotoMainFriend();
			}
		});
	}

	private afterFetchStrangerData_802() {
		NetLoading.removeLoading();

		var self = this;
		var beginX = this.scroller.x;
		var width = this.scroller.width;
		var tw = egret.Tween.get(this.scroller);
		tw.to({ x: this.group.width }, 300).call(function () {
			self.list.dataProvider = new eui.ArrayCollection(StrangerData.strangerList);
			self.list.dataProviderRefreshed();
			self.list.selectedIndex = 0;
			self.model.dressClothesOfSuit(StrangerData.strangerObj[StrangerData.strangerList[0]]["ondress"], StrangerData.strangerObj[StrangerData.strangerList[0]]["ornaments"])
		}).to({ x: this.group.width - width }, 300);
	}

	private afterSendMessage_803() {
		NetLoading.removeLoading();
		var flag = TaskData.taskFlag4;
		flag += 1;
		TaskData.taskFlag4 = Math.min(flag, 5);
		Prompt.showPrompt(egret.MainContext.instance.stage, "好友请求发送成功");
	}

	private afterData_605() {
		NetLoading.removeLoading();
		TaskData.gameTask = false;
		TaskData.taskFlag4 = 0;
		SceneMgr.gotoTaskScene(PlayerData.phase, PlayerData.mission);
	}
}


class StrangerListRenderer extends eui.ItemRenderer {
	public bg: eui.Image;
	public nickname: eui.Label;
	public clothes_count: eui.Label;
	public add_tog: eui.ToggleButton;

	public constructor() {
		super();

		this.skinName = "StrangerListRendererSkin";

	}

	protected createChildren() {
		super.createChildren();

		this.add_tog.addEventListener(eui.UIEvent.CHANGE, this.onChange, this);
	}

	protected dataChanged() {
		this.nickname.text = StrangerData.strangerObj[this.data]["nickname"];
		this.clothes_count.text = StrangerData.strangerObj[this.data]["collected"];
	}

	private onChange(evt: eui.UIEvent) {
		evt.target.currentState = "disabled";
		evt.target.touchEnabled = false;

		NetLoading.showLoading();
		var request: egret.URLRequest = HttpProtocolMgr.send_message_803(this.data, 1);
		HttpMgr.postRequest(request);
	}
}