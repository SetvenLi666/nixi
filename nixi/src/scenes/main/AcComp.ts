class AcComp extends eui.Component {
	public group: eui.Group;
	public scroller: eui.Scroller;
	public list: eui.List;
	public ptGroup: eui.Group;

	private checkDistance: number = 100;
	private pageWidth: number = 300;
	private pageCount: number = 4;
	private curPageIndex: number = 0;
	private startX: number = 0;
	private movedX: number = 0;

	private dataSource: {}[];

	private timer: egret.Timer;
	private tp: number = 1;

	public constructor() {
		super();

		this.skinName = "AcCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);

		this.dataSource = [
			{
				img: "newmain_ui_json.main_ui_ac_invit",
				isShow: true
			},
			{
				img: "newmain_ui_json.main_ui_ac_mc",
				isShow: true
			}
		]
		this.pageCount = this.dataSource.length;
		this.list.dataProvider = new eui.ArrayCollection(this.dataSource);
		this.list.itemRenderer = AcListItemRenderer;
		this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelected, this);

		this.scroller.viewport = this.list;
		this.scroller.throwSpeed = 0;
		this.startX = this.curPageIndex * this.pageWidth;

		// this["index_img_" + this.curPageIndex].source = "newmain_ui_json.main_selected_ac";
		for(var i = 0; i < this.pageCount; i++) {
			var ptImg = new eui.Image("newmain_ui_json.main_normal_ac");
			this.ptGroup.addChild(ptImg);
		}

		(<eui.Image>(this.ptGroup.getChildAt(0))).source = "newmain_ui_json.main_selected_ac";

		this.scroller.addEventListener(eui.UIEvent.CHANGE_START, this.onChangeStart, this);
		this.scroller.addEventListener(eui.UIEvent.CHANGE_END, this.onChangeEnd, this);

		this.timer = new egret.Timer(3500, 0);
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimerCallback, this);


		this.timer.start();
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);

		this.list.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelected, this);
		this.scroller.removeEventListener(eui.UIEvent.CHANGE_START, this.onChangeStart, this);
		this.scroller.removeEventListener(eui.UIEvent.CHANGE_END, this.onChangeEnd, this);
		this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimerCallback, this);
		this.timer.stop();
		this.timer.reset();
	}

	private onTimerCallback() {
		if (this.tp == 1) {
			if (this.curPageIndex >= this.dataSource.length - 1) {
				this.curPageIndex--;
				this.tp = -1;
			} else {
				this.curPageIndex++;
			}
		} else {
			if (this.curPageIndex <= 0) {
				this.curPageIndex++;
				this.tp = 1;
			} else {
				this.curPageIndex--;
			}
		}

		this.onMove(this.tp);
	}

	private onSelected(evt: eui.ItemTapEvent) {
		switch (evt.itemIndex) {
			case 0:
				NetLoading.showLoading();
				// var request: egret.URLRequest = HttpProtocolMgr.all_products_100();
				var request = HttpProtocolMgr.take_invite_info_165();
				HttpMgr.postRequest(request);
				break;
			case 1:
				var panel = new MonthCardPanel();
				DisplayMgr.set2Center(panel);
				this.stage.addChild(panel);
				break;
		}
	}

	private onChangeStart(evt: eui.UIEvent) {
		this.timer.stop();
		this.startX = this.scroller.viewport.scrollH;
	}

	private onChangeEnd(evt: eui.UIEvent) {
		var distance = this.scroller.viewport.scrollH - this.startX;
		if (Math.abs(distance) > this.checkDistance) {
			var tp: number = 1;
			if (distance > 0) {
				if (this.curPageIndex < this.pageCount - 1) {
					this.curPageIndex++;
					tp = 1;
					this.onMove(tp);
				}
			}
			else {
				if (this.curPageIndex > 0) {
					this.curPageIndex--;
					tp = -1;
					this.onMove(tp);
				}
			}
		}
		else {
			egret.Tween.get(this.scroller.viewport).to({ scrollH: this.curPageIndex * this.pageWidth }, 200).call(function () {
				this.timer.start();
			}, this);
		}
	}

	private onMove(tp: number) {
		var self = this;
		this.scroller.enabled = false;
		this.startX = this.curPageIndex * (this.pageWidth);
		egret.Tween.get(this.scroller.viewport).to({ scrollH: this.curPageIndex * this.pageWidth }, 300).call(function () {
			// this["index_img_" + (this.curPageIndex - tp)].source = "newmain_ui_json.main_normal_ac";
			// this["index_img_" + this.curPageIndex].source = "newmain_ui_json.main_selected_ac";
			(<eui.Image>(self.ptGroup.getChildAt(self.curPageIndex - tp))).source = "newmain_ui_json.main_normal_ac";
			(<eui.Image>(self.ptGroup.getChildAt(self.curPageIndex))).source = "newmain_ui_json.main_selected_ac";
			this.scroller.enabled = true;
			this.timer.start();
		}, this);
	}
}


class AcListItemRenderer extends eui.ItemRenderer {
	public icon: eui.Image;
	public flag: eui.Image;

	public constructor() {
		super();

		this.skinName = "AcListItemRendererSkin";
	}

	protected createChildren() {
		super.createChildren();
	}

	protected dataChanged() {
		this.icon.source = this.data.img;
		this.flag.visible = this.data.isShow;
	}
}