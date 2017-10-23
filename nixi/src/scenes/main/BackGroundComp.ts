/**
 *
 * @author 
 *
 */
class BackGroundComp extends eui.Component{
	public constructor() {
    	    super();
    	    
    	    this.skinName = "BackGroundSkin";
    	    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}
	
	private addStage() {
	    
	}
}
