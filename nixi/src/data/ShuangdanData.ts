class ShuangdanData {
	private static _template: {}[] = null;
	private static _info: {} = null;

	public static updateTemplate(obj) {
		if(obj) {
			this._template  = obj["template"];
			this._info = obj["info"];
		}
	}

	public static updateInfo(obj) {
		if(obj) {
			this._info = obj;
		}
	}

	public static get template(): {}[] {
		return this._template;
	}

	public static get info(): {} {
		return this._info;
	}
}