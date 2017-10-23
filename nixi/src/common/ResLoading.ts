/**
 *
 * @author 
 *
 */
class ResLoading extends eui.Component{
	// Export --------------------------------------------------
	public static isLoading: boolean = false;

	public load(groups: string[], callback?: CallBackFunc) {
	    this.index = 0;
	    this.loadGroups = groups;
	    this.callback = callback;
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onProgress, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onError, this);
        RES.loadGroup(this.loadGroups[this.index]);
	}

	public mergeLoad(groups: string[], callback?: CallBackFunc) {
		var newGroups:string[] = null;
		if (groups.length > 1) {
			var name = "merge_" + (new Date()).getTime();
			if (RES.createGroup(name, groups)) {
				newGroups = [name];
			}
			else {
				console.log("Error: create RES load group faild~!");
			}
		}
		else if (groups.length === 1) {
			newGroups = groups
		}
		else {
			console.log("Error: RES load empty groups~!");
		}

		this.load(newGroups, callback);
	}

	public static showLoading(): ResLoading {
		if (false === ResLoading.isLoading) {
			var stage: egret.Stage = egret.MainContext.instance.stage;
			var rtn: ResLoading = new ResLoading();
			stage.addChild(rtn);
			return rtn;
		}
		else {
			console.log("[WARNING] ResLoading::showLoading() - already loading!");
			return null;
		}
	}

	// Event & Callback --------------------------------------------------
	public constructor() {
		super();
		
		this.skinName = "ResLoadingSkin";
		var mask = DisplayMgr.createSceneMask();
		this.addChild(mask);
        this.mask = mask;
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
	}
	
	// Inner --------------------------------------------------
	private star: eui.Image;
    private textLabel: eui.Label;
	public group: eui.Group;
    
    private loadGroups: string[] = [];//需要加载的组
    private index: number;//当前加载的组序列
    private callback: CallBackFunc;//加载完成后的回调
	
	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.group.width = DisplayMgr.stageW;
		this.star.scaleX = 1.5;
		this.star.scaleY = 1.5;
	    this.addEventListener(egret.Event.ENTER_FRAME, this.updateFrame, this);
	}
	
	private updateFrame() {
		this.star.rotation += 5;
		if(this.star.scaleX > 1) {
			this.star.scaleX -= 0.03;
		}

		if(this.star.scaleY > 1) {
			this.star.scaleY -= 0.03;
		}
	}
	
	private isAllLoaded(): Boolean{
	    var rtn = true;
	    var len = this.loadGroups.length;
	    for(var i = 0; i < len; i++){
	        rtn = rtn && RES.isGroupLoaded(this.loadGroups[i]);
	    }
	    
	    return rtn;
	}
	
	private loadFinish(){
	    RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onProgress,this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onError,this);
		this.removeEventListener(egret.Event.ENTER_FRAME, this.updateFrame, this);
        
        if(this.parent) {
            this.parent.removeChild(this);
        }
        
        if(this.callback) {
            this.callback.exec();
        }
	}
	
	private onComplete(evt: RES.ResourceEvent) {
    	    egret.log("ResLoading: load group [" + evt.groupName + "] completed~!");
    	
	    if(this.isAllLoaded()) {
	        this.loadFinish();
	    }else{
	        this.index++;
	        RES.loadGroup(this.loadGroups[this.index]);
	    }
	}
	
	private onProgress(evt: RES.ResourceEvent) {
	    this.textLabel.text = evt.itemsLoaded + "/" + evt.itemsTotal;
	}
	
	private onError(evt: RES.ResourceEvent) {
	    egret.log("ResLoading: Group " + evt.groupName + " has failed to load");
	    this.onComplete(evt);
	}
}
