class CofferData {
    // Export --------------------------------------------------
    public static hasInitTemplateData(): Boolean {
        return null !== this._templateData;
    }
    
    public static get templateData(): {}[] {
        return this._templateData;
    }

    public static get userData(): string[] {
        return this._userData;
    }

    public static initTemplateData(obj: Object) {
        console.log("CofferData::initTemplateData()");
        if (null == obj) {
            return;
        }
        
        this._templateData = [];
        var key: string;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                 this._templateData.push(obj[key]);
            }
        }
    }
    
    public static updateUserData(obj: Object) {
        console.log("CofferData::updateUserData()");
        if (null == obj) {
            return;
        }
        
        this.profit = obj["profit"];
        this.topLimmit = obj["top"];
        this._userData = obj["record"];
    }

    public static phase_goals(phase: number): any[] {
        var rtn: any[] = [];
        var len = this.templateData.length;
        for(var i = 0; i < len; i++) {
            var item = this.templateData[i];
            var itemPhase = item["phase"];
            if(itemPhase == phase) {
                rtn.push(item);
            }
        }

        return rtn;
    }

    public static has_taken_reward(itemid: string) {
        if(this._userData.indexOf(itemid) > -1) {
            return true;
        }

        return false;
    }

    // Event & Callback --------------------------------------------------

    // Inner --------------------------------------------------
    private static _templateData: {}[] = null;
    private static _userData: string[] = [];
    public static profit: number = 0;           // 同步时的可领取收入
    public static topLimmit: number = 0;        // 当前阶段的金库上限

    private static fetchDialog(phase: number, taskId: string): {}[] {
        var rtn: {}[] = [];
        var phaseDialog: {}[] = RES.getRes(`mission_dialog_${phase}_json`); // 在SceneMgr中事先load过
        var len: number = phaseDialog.length;
        var item = null;
        for (var i = 0; i < len; i++) {
            item = phaseDialog[i];
            if (taskId === item["taskID"]) {
                rtn.push(item);
            }
        }
        console.log("Fetch dialog of phase: " + phase + " , taskId: " + taskId + " , count: " + rtn.length);
        return rtn;
    }
}