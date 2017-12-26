class TujianData {
	private static _suitArr: string[] = [];

	public static update(obj: {}) {
		if(obj) {
			this._suitArr = obj["draw_list"];
		}
	}

	public static get suitArr(): string[] {
		return this._suitArr;
	}
}