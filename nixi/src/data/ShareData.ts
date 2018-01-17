class ShareData {
	private static _shortcut_times: number = 0;
	private static _do_share_times: number = 0;
	private static _shortcut_reward: {} = null;
	private static _do_share_reward: {} = null;

	private static _yellow_fresh_times: number = 0;
	private static _yellow_daily_times: number = 0;
	private static _yellow_fresh_reward: {} = null;
	private static _yellow_daily_reward: {} = null;

	private static _is_dailypay: boolean = false;
	private static _dailypay_normal_times: number = 0;
	private static _dailypay_lottery_times: number = 0;

	private static _is_firstpay: boolean = false;
	private static _firstpay_normal_times: number = 0;
	private static _firstpay_lottery_times: number = 0;

	private static _isShowScPop: boolean = false;

	public static isShowNewShare: boolean = true;

	private static _can_take_gift: boolean = false; //玩吧每日礼包领取状态true可领取，false不可领取
	private static _can_take_once_gift: boolean = false; //玩吧新手礼包领取状态
	private static _can_take_zhuanshu_gift: boolean = false; //QQ空间专属礼包领取状态
	private static _isShowGift: boolean = true;     //是否弹出礼包
	private static _gift_reward_list: {} = {
		"1": { diam: 10 },
		"2": { diam: 10 },
		"3": { coin: 300 },
		"4": { coin: 300 },
		"5": { diam: 10, coin: 300 },
		"6": { diam: 10, tili: 60 },
		"7": { diam: 10, tili: 60 },
		"101": { diam: 100 },
		"201": { diam: 50 }
	};

	public static update(obj: {}) {
		if (obj == null) {
			console.log("sharedata is null !");
			return;
		}

		if (obj["buy_libao_list"]) {
			WanbaData.updatePackageData(obj["buy_libao_list"]);
		}

		this._shortcut_times = obj["shortcut_times"];
		this._do_share_times = obj["do_share_times"];
		this._shortcut_reward = obj["shortcut_reward"];
		this._do_share_reward = obj["do_share_reward"];

		this._yellow_fresh_times = obj["yellow_fresh_times"];
		this._yellow_daily_times = obj["yellow_daily_times"];
		this._yellow_fresh_reward = obj["yellow_fresh_reward"];
		this._yellow_daily_reward = obj["yellow_daily_reward"];

		//账号首冲、每日首冲
		this._is_dailypay = obj["is_dailypay"];
		this._dailypay_normal_times = obj["dailypay_normal_times"];
		this._dailypay_lottery_times = obj["dailypay_lottery_times"];

		this._is_firstpay = obj["is_firstpay"];
		this._firstpay_normal_times = obj["firstpay_normal_times"];
		this._firstpay_lottery_times = obj["firstpay_lottery_times"];

		this._can_take_gift = obj["can_take_gift"];
		this._can_take_once_gift = obj["can_take_once_gift"];
		this._can_take_zhuanshu_gift = obj["can_take_zhuanshu_gift"];
	}

	public static get shortcutTimes(): number {
		return this._shortcut_times;
	}

	public static get shareTimes(): number {
		return this._do_share_times;
	}

	public static get shortcutReward(): {} {
		return this._shortcut_reward;
	}

	public static get shareReward(): {} {
		return this._do_share_reward;
	}

	public static get freshTimes(): number {
		return this._yellow_fresh_times;
	}

	public static get freshReward(): {} {
		return this._yellow_fresh_reward;
	}

	public static get dailyTimes(): number {
		return this._yellow_daily_times;
	}

	public static get dailyReward(): {} {
		return this._yellow_daily_reward;
	}

	public static get isDailyPay(): boolean {
		return this._is_dailypay;
	}

	public static get isFirstPay(): boolean {
		return this._is_firstpay;
	}

	public static get dailypay_normal_times(): number {
		return this._dailypay_normal_times;
	}

	public static get dailypay_lottery_times(): number {
		return this._dailypay_lottery_times;
	}

	public static get firstpay_normal_times(): number {
		return this._firstpay_normal_times;
	}

	public static get firstpay_lottery_times(): number {
		return this._firstpay_lottery_times;
	}

	public static get can_take_gift(): boolean {
		return this._can_take_gift;
	}

	public static get can_take_once_gift(): boolean {
		return this._can_take_once_gift;
	}

	public static get can_take_zhuanshu_gift(): boolean {
		return this._can_take_zhuanshu_gift;
	}

	public static get isShowGift(): boolean {
		return this._isShowGift;
	}

	public static set isShowGift(value: boolean) {
		this._isShowGift = value;
	}

	public static get giftList(): {} {
		return this._gift_reward_list;
	}

	public static get isShowScPop(): boolean {
		return this._isShowScPop;
	}

	public static set isShowScPop(value: boolean) {
		this._isShowScPop = value;
	}

	public static get shareDesc(): string {
		var descList: string[] = [
			"“你最怕什么？”“那种突然而又不负责任的喜欢。”",
			"洗澡的时候有人突然闯进来……肿木办……",
			"世界之大，总有一款男神适合你",
			"细腰和翘臀哪个对男生更诱惑？",
			"惊！女生最喜欢的三类男神原来是这样",
			"一个她与三个他的故事，辣眼慎入",
			"当别人说你丑时，如何怒怼回去？",
			"“男神，你有什么技能？”……“有钱”",
			"只要这样打扮，一定有人来撩……",
			"明星成长记，请注意睡姿……",
			"你的衣服出卖了你自己，尤其是内衣",
			"有人@你，你的单身故事已被曝光啦！",
			"这一瞬间，我觉得他“们”超爱我！"
		];

		return descList[Math.floor(Math.random() * 13) + 1]
	}

	public static share(type: string) {
		var desc: string = "";
		switch (type) {
			case "task":
				desc = '这点小事难不倒我！';
				break;
			case "story":
				desc = '我的男神，我来了！';
				break;
			case "pk":
				desc = '你们这些凡人！在我的裙摆下臣服吧';
				break;
			case "shuangdan":
				desc = "这游戏疯了这么漂亮的衣服白送！";
				break;
		}

		var panel = new ShareGroupPanel();
		DisplayMgr.set2Center(panel);
		egret.MainContext.instance.stage.addChild(panel);
	}
}