class ExchangeComp extends eui.Component {
	public title: eui.Label;
	public tip: eui.Label;
	public btn_cancel: eui.Image;
	public btn_confirm: eui.Image;

	public constructor() {
		super();

		this.skinName = "ExchangeCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.btn_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel, this);
		this.btn_confirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirm, this);
	}

	private onCancel() {
		
	}

	private onConfirm() {

	}
}