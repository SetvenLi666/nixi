class AcComp extends eui.Component {
	public group: eui.Group;
	public scroller: eui.Scroller;
	public list: eui.List;
	public dot: eui.Group;

	private checkDistance: number = 100;
	private pageWidth: number = 300;
	private pageCount: number = 4;
	private curPageIndex: number = 0;
	private startX: number = 0;
	private movedX: number = 0;

	private dataSource: string[];

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
			"ac_page_cj_png",
			"ac_page_qd_png",
			"ac_page_tl_png",
			"ac_page_sc_png"
		]
		this.pageCount = this.dataSource.length;
		this.list.dataProvider = new eui.ArrayCollection(this.dataSource);
		this.list.itemRenderer = AcListItemRenderer;
		this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelected, this);

		this.scroller.viewport = this.list;
		this.scroller.throwSpeed = 0;
		this.startX = this.curPageIndex * this.pageWidth;
		this["index_img_" + this.curPageIndex].source = "newmain_ui_json.main_selected_ac";

		this.scroller.addEventListener(eui.UIEvent.CHANGE_START, this.onChangeStart, this);
		this.scroller.addEventListener(eui.UIEvent.CHANGE_END, this.onChangeEnd, this);

		this.timer = new egret.Timer(3500, 0);
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimerCallback, this);

		CustomEventMgr.addEventListener("302", this.result_of_302, this);

		this.timer.start();
	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		CustomEventMgr.removeEventListener("302", this.result_of_302, this);

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
				var request: egret.URLRequest;
				if (GashaponData.has_init_gashapon_template()) {
					request = HttpProtocolMgr.gashapon_info_306(false);
				} else {
					request = HttpProtocolMgr.gashapon_info_306(true);
				}
				HttpMgr.postRequest(request);
				break;
			case 1:
				NetLoading.showLoading();
				var request: egret.URLRequest;
				if (SigninData.has_init_signin7_template()) {
					request = HttpProtocolMgr.signin7_info_302(false);
				} else {
					request = HttpProtocolMgr.signin7_info_302(true);
				}
				HttpMgr.postRequest(request);
				break;
			case 2:
				// var onePanel = new OnePanel();
				// DisplayMgr.set2Center(onePanel);
				// egret.MainContext.instance.stage.addChild(onePanel);
				var panel = new EnergyPanel();
				DisplayMgr.set2Center(panel);
				egret.MainContext.instance.stage.addChild(panel);
				break;
			case 3:
				// var sixPanel = new SixPanel();
				// DisplayMgr.set2Center(sixPanel);
				// egret.MainContext.instance.stage.addChild(sixPanel);
				NetLoading.showLoading();
				var request = HttpProtocolMgr.all_products_100();
				HttpMgr.postRequest(request);
				break;
			case 4:
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
					// this.startX = this.curPageIndex * (this.pageWidth);
					// egret.Tween.get(this.scroller.viewport).to({ scrollH: this.curPageIndex * this.pageWidth }, 300).call(function () {
					// 	this["index_img_" + (this.curPageIndex - 1)].source = "main_normal_ac_png";
					// 	this["index_img_" + this.curPageIndex].source = "main_selected_ac_png";
					// }, this);
				}
			}
			else {
				if (this.curPageIndex > 0) {
					this.curPageIndex--;
					tp = -1;
					this.onMove(tp);
					// this.startX = this.curPageIndex * (this.pageWidth);
					// egret.Tween.get(this.scroller.viewport).to({ scrollH: this.curPageIndex * this.pageWidth }, 300).call(function () {
					// 	this["index_img_" + (this.curPageIndex + 1)].source = "main_normal_ac_png";
					// 	this["index_img_" + this.curPageIndex].source = "main_selected_ac_png";
					// }, this);
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
		this.scroller.enabled = false;
		this.startX = this.curPageIndex * (this.pageWidth);
		egret.Tween.get(this.scroller.viewport).to({ scrollH: this.curPageIndex * this.pageWidth }, 300).call(function () {
			this["index_img_" + (this.curPageIndex - tp)].source = "newmain_ui_json.main_normal_ac";
			this["index_img_" + this.curPageIndex].source = "newmain_ui_json.main_selected_ac";
			this.scroller.enabled = true;
			this.timer.start();
		}, this);
	}

	private result_of_302(evt: egret.Event) {
		NetLoading.removeLoading();
		var panel = new SigninPanel();
		DisplayMgr.set2Center(panel);
		this.stage.addChild(panel);
	}

	private result_of_306(evt: egret.Event) {
	}
}


class AcListItemRenderer extends eui.ItemRenderer {
	public icon: eui.Image;

	public constructor() {
		super();

		this.skinName = "AcListItemRendererSkin";
	}

	protected createChildren() {
		super.createChildren();
	}

	protected dataChanged() {
		this.icon.source = this.data;
	}
}