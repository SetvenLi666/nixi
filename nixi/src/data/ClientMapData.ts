class ClientMapData {
	private static _pkGuide: number = null;
	private static _energyGuide: number = null;
	private static _taskGuide: number = null;

	public static updateClientMapData(obj: {}) {
		if(obj) {
			if(obj["pkGuide"] != null) {
				this._pkGuide = obj["pkGuide"];
			}

			if(obj["energyGuide"] != null) {
				this._energyGuide = obj["energyGuide"];
			}

			if(obj["taskGuide"] != null) {
				this._taskGuide = obj["taskGuide"];
			}
		}
	}

	public static get pkGuide(): number {
		return this._pkGuide;
	}

	public static get energyGuide(): number {
		return this._energyGuide;
	}

	public static get taskGuide(): number {
		return this._taskGuide;
	}
}