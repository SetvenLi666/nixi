class EventData {
	private static _mystery: {} = null;
	private static _mysteryKey: string[] = [];
	private static _precon: {} = null;
	private static _template: {}[] = [];

	public static isEventReq: boolean = false;

	public static init_precondition(obj: {}) {
		if(obj) {
			this._precon = obj;
		}
	}

	public static init_template(arr: {}[]) {
		if( arr && arr.length) {
			this._template = arr;
		}
	}

	public static update_user_data(obj: {}) {
		if(obj) {
			this._mystery = obj;
			this._mysteryKey = [];
			for(var i in obj) {
				this._mysteryKey.push(i);
			}
		}
	}

	public static get mystery():{} {
		return this._mystery;
	}

	public static get mysteryKey(): string[] {
		return this._mysteryKey;
	}

	public static get precon(): {} {
		return this._precon;
	}

	public static get template(): {}[] {
		return this._template;
	}
}