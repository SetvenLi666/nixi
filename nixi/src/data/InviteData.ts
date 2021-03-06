class InviteItem {
	public icon: string = "";
	public state: string = "0";   //项状态 0表示空白，1表示可领取，2表示已领取
	public rank: number = -1;
}

class InviteData {
	private static _curTimes: number = 0;
	private static _curLeftShareTime: number = 0;
	private static _reward_state: number = 1;    //衣服可领取状态：1.人数不足；2.可以领取；3.已经领取
	private static _inviteCount: number = 0;
	private static _reward3_state: number = 1;
	private static _reward10_state: number = 1;

	public static isShowInvite: boolean = true;

	private static _inviteList: InviteItem[] = (function(){
		var list: InviteItem[] = [];
		for(var i = 0; i < 45; i++) {
			list.push(new InviteItem());
		}
		return list;
	})();

	public static updateInviteData(obj: {}) {
		if(obj) {
			this._curTimes = obj["share_times"];
			this._curLeftShareTime = obj["next_share"];
			this._reward_state = obj["reward_state"];

			if(obj["reward3_state"]) {
				this._reward3_state = obj["reward3_state"];
			}
			if(obj["reward10_state"]) {
				this._reward10_state = obj["reward10_state"];
			}

			// this._inviteList = obj["invite_list"];
			var listdata: {}[] = obj["invite_list"];
			
			var len = Math.min(listdata.length, 45);
			this._inviteCount = len;
			for(var i = 0; i < len; i++) {
				this._inviteList[i].icon = listdata[i]["figureurl"];
				this._inviteList[i].state = listdata[i]["draw"];
				this._inviteList[i].rank = listdata[i]["rank"];
			}
		}
	}

	public static get curTimes(): number {
		return this._curTimes;
	}

	public static get curLeftShareTime(): number {
		return this._curLeftShareTime;
	}

	public static get inviteList(): {}[] {
		return this._inviteList;
	}

	public static get reward_state(): number {
		return this._reward_state;
	}

	public static get reward3_state(): number {
		return this._reward3_state;
	}

	public static get reward10_state(): number {
		return this._reward10_state;
	}

	public static get inviteCount(): number {
		return this._inviteCount;
	}
}

