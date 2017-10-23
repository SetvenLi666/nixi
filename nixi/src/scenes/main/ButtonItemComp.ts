class ButtonItemComp extends eui.Component {
	public type: string = "";

	public item_bg: eui.Image;
	public item_lab: eui.Image;

	public tween: eui.Image;

	public imgStr_1: string = "";
	public imgStr_2: string = "";
	public imgStr_3: string = "";


	public constructor() {
		super();

		this.skinName = "ButtonItemCompSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		switch (this.type) {
			case "sj":
				this.item_bg.source = "";
				this.item_lab.source = "";
				this.imgStr_1 = "";
				this.imgStr_2 = "";
				this.imgStr_3 = "";
				break;
			case "xt":
				this.item_bg.source = "";
				this.item_lab.source = "";
				this.imgStr_1 = "";
				this.imgStr_2 = "";
				this.imgStr_3 = "";
				break;
			case "yl":
				this.item_bg.source = "";
				this.item_lab.source = "";
				this.imgStr_1 = "";
				this.imgStr_2 = "";
				this.imgStr_3 = "";
				break;
			case "sd":
				this.item_bg.source = "";
				this.item_lab.source = "";
				this.imgStr_1 = "";
				this.imgStr_2 = "";
				this.imgStr_3 = "";
				break;
			case "jj":
				this.item_bg.source = "";
				this.item_lab.source = "";
				this.imgStr_1 = "";
				this.imgStr_2 = "";
				this.imgStr_3 = "";
				break;
		}
	}

	private onExit() {

	}
}