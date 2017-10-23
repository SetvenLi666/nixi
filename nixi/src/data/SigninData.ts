class SigninData {
	private static signTemplateArray: {}[] = [];
	private static signInfo: {};

	public static initTemplate(obj: {}) {
		// var tempObj = {
		// 	"1": { uri: "21321", type: "clothes", retroactive_cost: 0, id: "1" },
		// 	"2": { uri: "31321", type: "clothes", retroactive_cost: 10, id: "2" },
		// 	"3": { uri: "51321", type: "clothes", retroactive_cost: 10, id: "3" },
		// 	"4": { uri: "61321", type: "clothes", retroactive_cost: 10, id: "4" },
		// 	"5": { uri: "71321", type: "clothes", retroactive_cost: 10, id: "5" },
		// 	"6": { uri: "71322", type: "clothes", retroactive_cost: 10, id: "6" },
		// 	"7": { uri: "15101", type: "clothes", retroactive_cost: 10, id: "7" }
		// }

		for (var i in obj) {
			this.signTemplateArray.push(obj[i]);
		}
	}

	public static updateSignInfo(obj: {}) {
		this.signInfo = obj;
	}

	public static has_init_signin7_template(): boolean {
		if (this.signTemplateArray.length != 0) {
			return true;
		}
		return false;
	}

	public static get tempArray(): {}[] {
		return this.signTemplateArray;
	}

	public static get signInfoObj(): {} {
		return this.signInfo;
	}

	public static getCurrentState(id: string): number {
		if (this.signInfoObj[id] == null) {
			return 0;
		}
		return this.signInfoObj[id];
	}
}