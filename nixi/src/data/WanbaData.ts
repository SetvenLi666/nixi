class WanbaData {
	private static _package_data: string[] = [];
	private static _libao_1: {} = {};
	private static _libao_2: {} = {};
	private static _libao_3: {} = {};

	public static updatePackageData(data: string[]) {
		if(data) {
			this._package_data = data;
		}
	}

	public static initPackageData(data: {}) {
		if(data) {
			this._libao_1 = data["libao_1"];
			this._libao_2 = data["libao_2"];
			this._libao_3 = data["libao_3"];
		}
	}

	public static get packageData(): string[] {
		return this._package_data;
	}

	public static get libao_1(): {} {
		return this._libao_1;
	}

	public static get libao_2(): {} {
		return this._libao_2;
	}
	
	public static get libao_3(): {} {
		return this._libao_3;
	}
}