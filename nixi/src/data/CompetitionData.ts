class CompetitionData {
	private static _selfRank: number = null;                   // 保存自己的排名，未上榜-1
	private static _ranklist: {}[] = null;                     // 排行
	private static _theme: CompetitionThemeInfo = null;        // 主题信息
	private static _self: CompetitionItem = null;			   // 自己
	private static _opponent: CompetitionItem = null;          // 对手信息
	public static isPrepare: boolean = false;                  //是否已经准备

	public static hasInitRankInfo(): boolean {
		return this._ranklist != null;
	}

	public static createThemeInfo(data: {}) {
		if (data == null) {
			return;
		}
		var theme = new CompetitionThemeInfo();
		theme.config(data);
		this._theme = theme;
	}

	public static createSelfInfo(data: {}) {
		if (data == null) {
			return;
		}
		var info = new CompetitionItem();
		info.config(data);
		this._self = info;
	}

	public static createRanklist(data: {}[]) {
		if (data == null) {
			return;
		}

		this._ranklist = [];
		var mySid = LoginData.sid;
		this._selfRank = -1;
		var len = data.length;
		for(var i = 0; i < len; i++) {
			var obj = data[i];
			if(obj) {
				var item = new CompetitionItem();
				item.config(obj);
				this._ranklist.push(item);
				if(item.id == mySid) {
					this._selfRank = i + 1;
				}
			}
		}
	}

	public static createOpponentInfo(data: {}) {
		if (data == null) {
			return;
		}
		var info = new CompetitionItem();
		info.config(data);
		this._opponent = info;
	}

	public static get self() {
		return this._self;
	}

	public static get selfRank() {
		return this._selfRank;
	}

	public static get ranklist() {
		return this._ranklist;
	}

	public static get theme() {
		return this._theme;
	}

	public static get opponent() {
		return this._opponent;
	}
}

class CompetitionThemeInfo {
	public themeName: string = null;
	public tags: string[] = [];
	public rule: string[] = [];
	public searchFreeCount: number;             // 免费搜索对手次数的最大值
	public startFreeCount: number;              // 免费开始次数的最大值
	public startLimit: number;                  // 每日最大PK次数

	public day: number;
	public hour: number;
	public minu: number;
	public secd: number;

	public config(data: {}) {
		if (data) {
			this.themeName = data["name"];
			this.tags = data["tags"];
			this.rule = data["rule"];
			this.searchFreeCount = data["search_free_count"];
			this.startFreeCount = data["start_free_count"];
			this.startLimit = data["start_limit"];

			this.day = data["D"];
			this.hour = data["H"];
			this.minu = data["M"];
			this.secd = data["S"];
		}
	}
}


class CompetitionItem {
	public id: string;                 // 玩家Sid
	public nickname: string;           // 昵称
	public collected: number;          // 衣服收集
	public lastRank: number;           // 上期名次
	public ondress: {};                // 同show的衣着
	public ornaments: {};

	public searchTimes: number;        // 今日主动搜索次数(没有上线)(从0开始计算，>=最大值花钻石)
	public startTimes: number;         // 今日主动挑战次数(从0开始计算，>=最大值花钻石)
	public curOpponent: string;        // 当前对手sid
	public dailyOpponents: {}[];       // 今日挑战过的对手

	public searchCost: number;         // 查找对手钻石花费 5         
	public startCost: number;          // 开始钻石花费 20
	public score: number;              // 当前累计得分

	public match: number;              // 搭配分
	public puplar: number;             // 人气分
	public charm: number;              // 魅力分
	public luck: number;               // 运气分

	public buffId: number;             // 祝福Buff，玩家自己的, 0表示无
	public buffDesc: string;           // 玩家自己的祝福描述, _buffId=0时为空串
	public buffedId: number;           // 本对象表示对手信息时，为对手的祝福效果ID，0表示无
	public buffedDesc: string;         // 对手的祝福描述, _buffedId=0时为空串
	public added: boolean;             // 客户端使用临时判断是否添加了好友

	public config(data: {}) {
		if(data == null) {
			return;
		}

		this.id = data["id"];
		this.nickname = data["nickname"];
		this.collected = data["collected"];
		this.lastRank = data["last_rank"];
		this.ondress = data["ondress"];
		this.ornaments = data["ornaments"];
		// this._ondress["7"] = data["ornaments"];

		this.searchTimes = data["daily_search"];
		this.startTimes = data["daily_start"];
		this.curOpponent = data["cur_opponent"];
		this.dailyOpponents = data["daily_opponents"];

		this.searchCost = data["search_cost"];
		this.startCost = data["start_cost"];
		this.score = data["score"];

		this.match = data["s_match"];
		this.puplar = data["s_popular"];
		this.charm = data["s_charm"];
		this.luck = data["s_luck"];

		this.buffId = data["buff"];
		this.buffDesc = data["buff_desc"];
		this.buffedId = data["buffed"];
		this.buffedDesc = data["buffed_desc"];

		this.added = false;
	}
}