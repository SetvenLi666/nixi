class EnergyCD {
	private static timer: egret.Timer;
	private static countDown: number;

	public static init() {
		this.countDown = PlayerData.left;
		this.timer = new egret.Timer(1000, 0);
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimerCallback, this);
	}

	public static updateEnergyCD() {
		if(PlayerData.energy < 100) {
			CustomEventMgr.dispatchEventWith("COUNTDOWN_UNHIDE", false);
			this.timer.start();
		}else {
			CustomEventMgr.dispatchEventWith("COUNTDOWN_HIDE", false);
			this.timer.stop();
		}	
	}

	private static onTimerCallback() {
		PlayerData.left--;
		this.countDown--;
		if (this.countDown <= 0) {
			PlayerData.energy += 1;
			console.log("palyerdata.energy = " + PlayerData.energy);
			if (PlayerData.energy >= 100) {
				this.timer.stop();
				CustomEventMgr.dispatchEventWith("COUNTDOWN_HIDE", false);
			} else {
				PlayerData.left = 360;
				this.countDown = PlayerData.left;
			}
			CustomEventMgr.dispatchEventWith("Update Player Info", false);
		}
		CustomEventMgr.dispatchEventWith("Update CountDown", false);
	}
}