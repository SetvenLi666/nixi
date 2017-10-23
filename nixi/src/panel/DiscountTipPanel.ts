class DiscountTipPanel extends eui.Component {
	public group: eui.Group;
	public btn_yes: eui.Image;
	public btn_no: eui.Image;

	public constructor() {
		super();

		this.skinName = "DiscountTipPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);
		this.btn_yes.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonYes, this);
		this.btn_no.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonNo, this);
	}

	private onButtonYes() {
		NetLoading.showLoading();
		var request = HttpProtocolMgr.flash_sale_buying_161();
		HttpMgr.postRequest(request);

		if(this.parent) {
			this.parent.removeChild(this);
		}
	}

	private onButtonNo() {
		if(this.parent) {
			this.parent.removeChild(this);
		}
	}
}