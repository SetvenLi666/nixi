class NewSignData {
	// private static signTemplateArray: {}[] = [];
	private static templateData: {} = null;
	private static signInfo: {};

	public static initTemplate(obj: {}) {
		// for(var i in obj) {
		// 	this.signTemplateArray.push(obj[i]);
		// }
		if(obj) {
			this.templateData = obj;
		}
	}

	public static updateSignInfo(obj: {}) {
		this.signInfo = obj;
	}

	public static has_init_signin7_template() :boolean {
		if(this.templateData == null) {
			return false;
		}else {
			return true;
		}
		// if(this.signTemplateArray.length != 0) {
		// 	return true;
		// }
		// return false;
	}

	public static get tempObj() :{} {
		// return this.signTemplateArray;
		return this.templateData;
	}

	public static get signInfoObj() :{} {
		return this.signInfo;
	}
}