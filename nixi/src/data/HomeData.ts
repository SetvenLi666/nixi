class HomeData {
	private static curHouse: string;
	private static houseUser: string[] = [];
	private static topScore: Object = {};
	private static templateArray: {}[] = [];

	public static init_house_template(obj: Object) {
		this.templateArray = [];
		for(var i in obj) {
			this.templateArray.push(obj[i]);
		}
	}

	public static has_init_template() : boolean {
		return this.templateArray.length != 0;
	}

	public static replace_home_info(obj: Object) {
		this.curHouse = obj["cur_house"];
		this.houseUser = obj["houses"];
		this.topScore = obj["scores"];
	}

	public static get curHouseID() :string {
		return this.curHouse;
	}

	public static get houseOwnArray() :string[] {
		return this.houseUser;
	}

	public static get scores() :Object {
		return this.topScore;
	}

	public static get template() :{}[] {
		return this.templateArray;
	}

	public static getNameById(id: string) : string {
		var name: string = "";
		switch(id) {
			case "1":
			name = "欧式风情";
			break;
			case "2":
			name = "换装空间";
			break;
			case "3":
			name = "田园风光";
			break;
			case "4":
			name = "罗马假日";
			break;
			case "5":
			name = "欧式风情2";
			break;
			case "6":
			name = "粉红心情";
			break;
			case "7":
			name = "悠夜古堡";
			break;
			case "8":
			name = "小轩窗";
			break;
			case "9":
			name = "花园春色";
			break;
			case "10":
			name = "樱花公馆";
			break;
			case "11":
			name = "海天一色";
			break;
		}

		return name;
	}
}