class WelfareData {
	private static _itemsObj: {} = null;
	private static _items: {}[] = [];
	private static _statis: {} = null;

	private static _isBtnReq: boolean = false;

	public static updateWelfareData(obj: {}) {
		if(obj != null) {
			var items: {} = obj["items"];
			this._itemsObj = obj["items"];
			this._statis = obj["statis"];

			this._items = [];
			for(var i in items) {
				this._items.push(items[i]);
			}
		}
	}

	public static get items(): {}[] {
		return this._items;
	}

	public static get statis(): {} {
		return this._statis;
	}

	public static get itemsObj(): {} {
		return this._itemsObj;
	}

	public static get isBtnReq(): boolean {
		return this._isBtnReq;
	}

	public static set isBtnReq(value: boolean) {
		this._isBtnReq = value;
	}
}