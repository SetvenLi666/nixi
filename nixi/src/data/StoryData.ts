class StoryData {
    // Export --------------------------------------------------
    public static get completedStory(): {} { return this._completedStory; }
    public static get completedVipStory(): {} { return this._completedVipStory;}

    public static formatCheckedVipTemplate(templateData: any[]): any[] {
        var count = 12;

        var rtn = [];
        for (var i = 0; i < count; i++) {
            rtn.push(templateData[i]);
        }
        return rtn;
    }
    
    public static vipStoryState(storyId: string): string {
        // "story2":{ "0":1, "1":1, "2":1 }
        var data = this._completedVipStory[storyId];
        if (data === undefined) { // 未解锁，需要购买
            return "locked";
        }
        else if (data == 1 || data == -1) {
            return "unlocked"
        }
        else {
            return "locked"
        }
    }

    // Event & Callback --------------------------------------------------
    public static updateCompletedStory(obj: {}) {
        console.log("StoryData::updateCompletedStory()");
        console.log(obj);

        if (obj !== null) {
            this._completedStory = obj;
        }
    }

    public static updateCompletedVipStory(obj: {}) {
        console.log("StoryData::updateCompletedVipStory()");
        if (obj !== null) {
            this._completedVipStory = obj;
        }
    }

    public static has_init_story() {
        return !(this._completedStory == null);
    }

    public static getHanziText(num: number): string {
		var text: string = "";
		if(num <= 10) {
			text = this.textArr[num];
		}else if(num > 10 && num < 20) {
			text = "十" + this.textArr[num % 10];
		}else if(num >= 20) {
			text = this.textArr[Math.floor(num / 10)] + "十" + (num % 10 == 0 ? "" : this.textArr[num % 10]);
		}
		return text;
	}

    // Inner --------------------------------------------------
    private static _completedStory: {} = null;
    private static _completedVipStory: {} = null;
    private static textArr: string[] = ["0", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    // private static _completedVipStory: {} = {
    //     0: 1,
    //     1: 1,

    // }
    private static _selectedTag: number = null;
    private static _selectedBg: string | egret.Texture = null;

    public static set selectedTag (value: number) {
        this._selectedTag = value;
    }

    public static get selectedTag () {
        return this._selectedTag;
    }

    public static set selectedBg (value: string | egret.Texture) {
        this._selectedBg = value;
    }
    public static get selectedBg () {
        return this._selectedBg;
    }
}