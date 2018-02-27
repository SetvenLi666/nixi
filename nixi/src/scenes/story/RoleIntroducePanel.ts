class RoleIntroducePanel extends eui.Component{
	public group:eui.Group;
	public roleImg:eui.Image;

	private index: number = 1;

	public constructor() {
		super();

		this.skinName = "RoleIntroducePanelSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}

	private addStage() {
		this.group.width = Math.min(DisplayMgr.stageW, 852);

		this.roleImg.source = "role_introduce_" + this.index + "_png";
		this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGroupTouched, this);
	}

	private onGroupTouched(evt: egret.Event) {
		if(this.index == 3) {
			SceneMgr.gotoNewStorySelectScene();
			this.closePanel();
		}else {
			this.index ++;
			this.roleImg.source = "role_introduce_" + this.index + "_png";
		}
		
	}

	private closePanel() {
		if(this.parent) {
			this.parent.removeChild(this);
		}
	}
}