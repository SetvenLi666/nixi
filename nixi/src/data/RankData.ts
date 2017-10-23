class RankData {
	private static rankArray: {}[] = [];

	private static _enterType: string = "main";        // 1=主界面， 2=好友主界面

	public static update(obj: Object) {
		this.rankArray = obj["ranking"];
	}
	
	public static get rankData() : {}[]{
		return this.rankArray;
	}

	public static get enterType(): string {
		return this._enterType;
	}

	public static set enterType(type: string) {
		this._enterType = type;
	}
}