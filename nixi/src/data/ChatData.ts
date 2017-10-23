class ChatData {
	private static msgArray: eui.ArrayCollection = new eui.ArrayCollection([]);
	private static _notice: string = "";
	private static num: number = 0;
	private static newMsgCount: number = 0;
	private static curDisplayIndex: number = 0;
	public static isOpen: boolean = false;

	//防刷屏规则: 10秒内发言超过3次禁言10秒
	public static deltaTime: number = 0;        //时间间隔
	public static lastChatTime: number = 0;    //上一次发言时间
	public static chatCount: number = 0;       //最近发言次数
	public static timer: egret.Timer = new egret.Timer(1000, 10);          //禁言倒计时
	public static isChatOk: boolean = true;

	public static updateMsgArray(obj: {}) {
		if (!obj["reply"]) {
			this.msgArray.addItem(obj);
			this.num ++;
			this.newMsgCount ++;

			if (this.num > 200) {
				this.curDisplayIndex = this.curDisplayIndex < 100 ? 0 : this.curDisplayIndex - 100;
				for (var i = 0; i < 100; i++) {
					this.msgArray.removeItemAt(0);
				}
				this.num -= 100;
			}
			CustomEventMgr.dispatchEventWith("UPDATE_SCROLLER_VIEW", false, obj);
		}
	}

	public static get msg(): eui.ArrayCollection {
		return this.msgArray;
	}

	public static get len(): number {
		return this.num;
	}

	public static set newChatCount(num: number) {
		this.newMsgCount = num;
	} 

	public static get newChatCount() : number {
		return this.newMsgCount;
	}

	public static get curIndex() : number {
		return this.curDisplayIndex;
	}

	public static set curIndex(num: number) {
		this.curDisplayIndex = num;
	}

	public static get notice() :string {
		return this._notice;
	}

	public static set notice(text: string) {
		this._notice = text;
	}
}