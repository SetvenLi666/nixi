class TLDiscountData {
	private static _type: number = 6;
	private static _leftTime: number = 0;
	private static _id: string = "";
	private static _money: number = 0;
	private static _timer: egret.Timer = null;
	private static _limitTime: number = 600;

	public static updateDiscountData(obj: {}) {
		if(obj) {
			this._type = obj["type"];
			this._id = obj["id"];
			this._money = obj["money"];
			this._leftTime = this._limitTime;
			if(!this._timer) {
				this._timer = new egret.Timer(1000, this._leftTime);
				this._timer.addEventListener(egret.TimerEvent.TIMER, this.onTimerCallback, this);
				this._timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
				this._timer.start();
			}else {
				this._timer.reset();
				this._timer.start();
			}
			
		}
	}

	private static onTimerCallback() {
		this._leftTime --;
		this._leftTime = Math.max(0, this._leftTime);
		CustomEventMgr.dispatchEventWith("Update TL View", false);
	}

	private static onTimerComplete() {
		this.resetDL();
	}

	public static resetDL() {
		this._leftTime = 0;
		CustomEventMgr.dispatchEventWith("Hide TL", false);
	}

	public static get id(): string {
		return this._id;
	}

	public static get money(): number {
		return this._money;
	}

	public static get type(): number {
		return this._type;
	}

	public static get leftTime(): number {
		return this._leftTime;
	}
}