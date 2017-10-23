class GashaponData {
	private static templateObj: {};
	private static costObj: {};
	private static gashaponObj: {};
	private static extraData: number;
	private static ownArray: number[];
	public static init_gashapon_template(obj: {}) {
		this.templateObj = obj;
	}

	public static init_cost(obj: {}) {
		this.costObj = obj;
	}

	public static init_extra(data: any) {
		this.extraData = data;
	}

	public static replace_gashapon_user(obj: {}) {
		if(obj) {
			this.gashaponObj = obj;
		}
	}

	public static has_init_gashapon_template() :boolean {
		return false;
	}

	public static get template() :{} {
		return this.templateObj;
	}

	public static get cost() :{} {
		return this.costObj;
	}

	public static get gashapon() :{} {
		return this.gashaponObj;
	}

	public static get extra() :any {
		return this.extraData;
	}

	public static get own() : number[] {
		return this.gashapon["owned"];
	}

	private static exchange_id: string;

	public static set setExchange_id(clothes_id: string) {
		this.exchange_id = clothes_id;
	}

	public static get getExchange_id() :string {
		return this.exchange_id;
	}
}