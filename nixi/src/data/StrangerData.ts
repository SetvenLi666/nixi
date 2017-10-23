 class StrangerData {
	private static strangerArray: string[] = [];
	private static strangerData: {} = {};

	public static initStrangerData(obj: Object) {
		this.strangerData = obj;
		this.strangerArray = [];
		for(var p in obj) {
			this.strangerArray.push(p);
		}
	}

	public static get strangerList() : string[] {
		return this.strangerArray;
	}

	public static get strangerObj() :{} {
		return this.strangerData;
	}
}