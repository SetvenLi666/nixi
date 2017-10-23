class DropTipPanel extends eui.Component{
	private group: eui.Group;
	private dropComp: DropComp;
	private id: string;
	public isOver: boolean = false;

	public constructor(clothesId: string) {
		super();

		this.id = clothesId;
		this.skinName = "DropPanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.group.width = DisplayMgr.stageW;
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		this.dropComp.icon.source = "icon" + this.id + "_png";
		this.dropComp.clothes_name.text = ClothesData.clothesTemplateData(parseInt(parseInt(this.id) / 10000 + "").toString(), this.id)["name"];
	}

	private onExit() {

	}

	private onTouch(evt: egret.TouchEvent) {
		if(this.isOver) {
			this.closePanel();
		}
	}

	private closePanel() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}