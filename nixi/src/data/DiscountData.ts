class DiscountData {
	private static _id: number;                             // ID，暂时用不上
	private static _phase: number;                          // 套装公司等级要求
	private static _type: number;                           // 购买类型，1-金币；2-钻石
    private static _deadline: number;                       // 截止剩余时间，单位秒
    private static _oldPrice: number;                       // 原总价
    private static _discount: number;                       // 折扣比，小数
    private static _nowPrice: number;                       // 折扣后的价格
    private static _clothes: number[];                          // 包含的衣服，Interge数组

	public static isOk: boolean = false;

	public static config(obj: {}) {
		if(obj) {
			this._id = obj["id"];
			this._phase = obj["phase"];
			this._type = obj["type"];
			this._deadline = obj["deadline"];
			this._oldPrice = obj["old_price"];
			this._discount = obj["discount"];
			this._nowPrice = obj["now_price"];

			this._clothes = obj["clothes"];
		}
	}

	public static get id() {
		return this._id;
	}

	public static get phase() {
		return this._phase;
	}

	public static get type() {
		return this._type;
	}

	public static get deadline() {
		return this._deadline;
	}

	public static get oldPrice() {
		return this._oldPrice;
	}

	public static get discount() {
		return this._discount;
	}

	public static get nowPrice() {
		return this._nowPrice;
	}

	public static get clothes() {
		return this._clothes;
	}
}