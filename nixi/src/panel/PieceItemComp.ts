class PieceItemComp extends eui.Component{
	public icon:eui.Image;
	public btnComp:eui.Component;
	public id: string;
	public price: number;
	
	public constructor(clothes_id: string, price: number) {
		super();
		
		this.skinName = "PieceItemSkin";
		this.id = clothes_id;
		this.price = price;
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.btnComp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButton, this);
		this.icon.source = "icon" + this.id + "_png";
		this.btnComp["label"].text = this.price + "碎片";
	}

	private onButton() {
		NetLoading.showLoading();
		GashaponData.setExchange_id = this.id;
		var request: egret.URLRequest = HttpProtocolMgr.exchange_clothes_311(this.id);
		HttpMgr.postRequest(request);
	}
}