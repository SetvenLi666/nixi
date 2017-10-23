class RechargeData {

	private static templateObj: {};
	private static achievementObj: {};

	public static init_purchase_achievement_template(obj: {}) {
		this.templateObj = obj;
	}

	public static replace_purchase_achievement(obj: {}) {
		this.achievementObj = obj;
	}

	public static has_init_purchase_template() :boolean {
		return false;
	}

	public static get template() :{} {
		return this.templateObj;
	}

	public static get achievement() :{} {
		return this.achievementObj;
	}
}