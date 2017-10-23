class TaskData {
    // Export --------------------------------------------------
    public static hasInitUserData(): Boolean {
        return null !== this._userData;
    }
    
    public static prepareDialog(phase: number, taskId: string): {}[] {
        if (! this._dialogs.hasOwnProperty(taskId)) {
            this._dialogs[taskId] = this.fetchDialog(phase, taskId);
        }

        return this._dialogs[taskId];
    }

    public static userData(): {} {
        return this._userData;
    }
    
    public static updateUserData(obj: Object) {
        console.log("TaskData::updateUserData()");
        this._userData = obj;
    }

    public static get gameTask() : boolean {
        return this.isGameTask;
    }

    public static set gameTask(bool: boolean) {
        this.isGameTask = bool;
    }

    public static get taskTempID() : number {
        return this.tempID;
    }

    public static set taskTempID(id: number) {
        this.tempID = id;
    }

    public static get taskFlag4() : number {
        return this.specialTaskFlag4;
    }

    public static set taskFlag4(flag: number) {
        this.specialTaskFlag4 = flag;
    }

    public static get taskFlag6() : number {
        return this.specialTaskFlag6;
    }

    public static set taskFlag6(flag: number) {
        this.specialTaskFlag6 = flag;
    } 

    //获取当前公司等级的任务数据
    public static curMissionofPhase(phase: number):{}[] {
        phase = phase > 2 ? 2 : phase; //开放任务等级限制
        if(this["_mdata_" + phase].length == 0) {
            this["_mdata_" + phase] = RES.getRes("mission_" + phase + "_json");
            this["_datalen_" + phase] = this["_mdata_" + phase].length;
        }
        return this["_mdata_" + phase];
    }

    public static curCountsofMission(phase: number): number {
        phase = phase > 2 ? 2 : phase; //任务等级限制
        if(this["_datalen_" + phase].length == 0) {
            this["_mdata_" + phase] = RES.getRes("mission_" + phase + "_json");
            this["_datalen_" + phase] = this["_mdata_" + phase].length;
        }
        return this["_datalen_" + phase];
    }

    //公司任务总表
    public static totalMissionData() {
        if(this._totalData.length == 0) {
            this._totalData = RES.getRes("mission_json");
        }
        return this._totalData;
    }

    // Event & Callback ---------------------------------------------

    // Inner --------------------------------------------------
    private static _dialogs: Object = {}; // 格式化后的
    private static _userData: Object = null;

    private static isGameTask: boolean = false;
    private static tempID: number;
    private static specialTaskFlag4: number = 0;
    private static specialTaskFlag6: number = 0;

    public static curTaskID: number = 1;

    private static _totalData: {}[] = [];
    private static _mdata_1: {}[] = [];
    private static _mdata_2: {}[] = [];
    private static _mdata_3: {}[] = [];
    private static _mdata_4: {}[] = [];
    private static _mdata_5: {}[] = [];
    private static _datalen_1: number = 0;
    private static _datalen_2: number = 0;
    private static _datalen_3: number = 0;
    private static _datalen_4: number = 0;
    private static _datalen_5: number = 0;

    private static fetchDialog(phase: number, taskId: string): {}[] {
        var rtn: {}[] = [];
        var phaseDialog: {}[] = RES.getRes(`mission_dialog_${phase}_json`); // 在SceneMgr中事先load过
        var len: number = phaseDialog.length;
        var item = null;
        for (var i = 0; i < len; i++) {
            item = phaseDialog[i];
            // if (taskId === item["taskID"]) {
            //     rtn.push(item);
            // }
            if(phase == 5) {
                if(parseInt(taskId) - (phase - 1) * 20 - 5 - 6 === parseInt(item["taskID"])) {
                    rtn.push(item);
                }
            }else if(phase == 4) {
                if(parseInt(taskId) - (phase - 1) * 20 - 5 === parseInt(item["taskID"])) {
                    rtn.push(item);
                }
            }else {
                if(parseInt(taskId) - (phase - 1) * 20 === parseInt(item["taskID"])) {
                    rtn.push(item);
                }
            }
            
        }
        console.log("Fetch dialog of phase: " + phase + " , taskId: " + taskId + " , count: " + rtn.length);
        return rtn;
    }
}