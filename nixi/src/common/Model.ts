class Model extends eui.Component {
	public layer_10: eui.Image;
	public layer_30: eui.Image;
	public layer_39: eui.Image;
	public layer_40: eui.Image;
	public layer_41: eui.Image;
	public layer_50: eui.Image;
	public layer_60: eui.Image;
	public layer_69: eui.Image;
	public layer_70: eui.Image;
	public layer_71: eui.Image;
	public layer_72: eui.Image;
	public layer_73: eui.Image;
	public layer_79: eui.Image;
	public layer_80: eui.Image;
	public layer_81: eui.Image;
	public layer_82: eui.Image;
	public layer_100: eui.Image;
	public layer_129: eui.Image;
	public layer_130: eui.Image;
	public layer_132: eui.Image;
	public layer_139: eui.Image;
	public layer_140: eui.Image;
	public layer_200: eui.Image;
	public layer_201: eui.Image;
	public layer_300: eui.Image;
	public layer_305: eui.Image;
	public layer_310: eui.Image;
	public layer_311: eui.Image;
	public layer_312: eui.Image;
	public layer_335: eui.Image;
	public layer_336: eui.Image;
	public layer_340: eui.Image;
	public layer_350: eui.Image;
	public layer_351: eui.Image;
	public layer_352: eui.Image;
	public layer_359: eui.Image;
	public layer_360: eui.Image;
	public layer_369: eui.Image;
	public layer_370: eui.Image;
	public layer_378: eui.Image;
	public layer_379: eui.Image;
	public layer_380: eui.Image;
	public layer_385: eui.Image;
	public layer_390: eui.Image;
	public layer_400: eui.Image;
	public layer_401: eui.Image;
	public layer_403: eui.Image;
	public layer_404: eui.Image;
	public layer_405: eui.Image;
	public layer_406: eui.Image;
	public layer_410: eui.Image;
	public layer_411: eui.Image;
	public layer_412: eui.Image;
	public layer_413: eui.Image;
	public layer_4133: eui.Image;
	public layer_414: eui.Image;
	public layer_415: eui.Image;
	public layer_4166: eui.Image;
	public layer_416: eui.Image;
	public layer_417: eui.Image;
	public layer_418: eui.Image;
	public layer_419: eui.Image;
	public layer_420: eui.Image;
	public layer_421: eui.Image;
	public layer_422: eui.Image;
	public layer_423: eui.Image;
	public layer_424: eui.Image;
	public layer_425: eui.Image;
	public layer_430: eui.Image;
	public layer_439: eui.Image;
	public layer_440: eui.Image;
	public layer_441: eui.Image;
	public layer_449: eui.Image;
	public layer_450: eui.Image;
	public layer_451: eui.Image;
	public layer_460: eui.Image;
	public layer_499: eui.Image;
	public layer_500: eui.Image;
	public layer_510: eui.Image;

	private part_1: eui.Image[];
	private part_2: eui.Image[];
	private part_3: eui.Image[];
	private part_4: eui.Image[];
	private part_5: eui.Image[];
	private part_6: eui.Image[];
	private part_8: eui.Image[];
	private part_9: eui.Image[];
	private part_10: eui.Image[];
	private part_11: eui.Image[];
	private part_12: eui.Image[];
	private part_13: eui.Image[];
	private part_14: eui.Image[];
	private part_15: eui.Image[];
	private part_16: eui.Image[];
	private part_17: eui.Image[];
	private part_18: eui.Image[];
	private part_19: eui.Image[];
	private part_20: eui.Image[];
	private part_21: eui.Image[];
	private part_22: eui.Image[];
	private part_23: eui.Image[];

	private shower_blink: eui.Image;
	private timer: egret.Timer;

	public constructor() {
		super();

		this.skinName = "ModelSkin";

		this.part_1 = [this.layer_430, this.layer_50];
		this.part_2 = [this.layer_80, this.layer_130, this.layer_380, this.layer_400, this.layer_420, this.layer_425, this.layer_450, this.layer_414];
		this.part_3 = [this.layer_60, this.layer_79, this.layer_129, this.layer_140, this.layer_360, this.layer_370, this.layer_379, this.layer_390, this.layer_410, this.layer_418, this.layer_449, this.layer_4133];
		this.part_4 = [this.layer_100, this.layer_139, this.layer_359, this.layer_369, this.layer_378, this.layer_417];
		this.part_5 = [this.layer_10, this.layer_30, this.layer_132, this.layer_500, this.layer_510];
		this.part_6 = [this.layer_310];
		this.part_8 = [this.layer_70, this.layer_335, this.layer_406, this.layer_412, this.layer_423, this.layer_451];
		this.part_9 = [];
		this.part_10 = [];
		this.part_11 = [this.layer_40, this.layer_69, this.layer_440, this.layer_499];
		this.part_12 = [this.layer_439];
		this.part_13 = [this.layer_39, this.layer_350, this.layer_404, this.layer_416];
		this.part_14 = [this.layer_403];
		this.part_15 = [this.layer_82, this.layer_201, this.layer_340, this.layer_351, this.layer_4166];
		this.part_16 = [this.layer_81, this.layer_385, this.layer_401, this.layer_405];
		this.part_17 = [this.layer_311];
		this.part_18 = [this.layer_312];
		this.part_19 = [this.layer_421, this.layer_422];
		this.part_20 = [];
		this.part_21 = [this.layer_71, this.layer_411, this.layer_441];
		this.part_22 = [this.layer_72, this.layer_336, this.layer_413, this.layer_424];
		this.part_23 = [this.layer_41, this.layer_73, this.layer_300, this.layer_305, this.layer_352];

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
	}

	private addStage() {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
		//点击可穿透(重要)
		this.touchEnabled = false;
		this.touchChildren = false;

		var n = Math.floor(Math.random() * 3) + 3;
		this.timer = new egret.Timer(n * 1000, 0);
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.blink, this);
		this.timer.start();

		// var clothesArr = ClothesData.allClothesArray();
		// var parts0: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
		// var parts: string[] = ["11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

		// for(var i = 0; i < parts.length; i++) {
		// 	var arr: string[] = [];
		// 	for(var j = 0; j < clothesArr.length; j++) {
		// 		var item = clothesArr[j];
		// 		if(parts[i] == item["sub_part"]) {
		// 			if(item["z_order1"] != "" && arr.indexOf(item["z_order1"]) == -1) {
		// 				arr.push(item["z_order1"]);
		// 			}
		// 			if(item["z_order2"] != "" && arr.indexOf(item["z_order2"]) == -1) {
		// 				arr.push(item["z_order2"]);
		// 			}
		// 			if(item["z_order3"] != "" && arr.indexOf(item["z_order3"]) == -1) {
		// 				arr.push(item["z_order3"]);
		// 			}
		// 		}
		// 	}
		// 	console.log("current part: " + parts[i]);
		// 	console.log(arr);
		// }

	}

	private onExit() {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
		this.timer.removeEventListener(egret.TimerEvent.TIMER, this.blink, this);
		this.timer.stop();
		this.timer.reset();
	}


	//换单件衣服
	public dressItem(sub_part: string, clothesId: number) {
		var strClothesId = clothesId.toString();
		var part = Math.floor(clothesId / 10000);
		var strPart = part + "";
		var clothesItem = ClothesData.clothesTemplateData(strPart, strClothesId);
		var curArr: eui.Image[] = this["part_" + sub_part];
		var len = curArr.length;
		for (var i = 0; i < len; i++) {
			var layer: eui.Image = curArr[i];
			layer.source = null;
		}
		curArr = null;

		if (0 == clothesId % 10000 || null == clothesItem) {
			if (sub_part == "1") {
				this.layer_430.source = "10000_png";
				this.layer_50.source = "10009_png";
			}
			return;
		}

		if (sub_part == "3") {
			if (clothesItem["sub_part"] == "1") {
				this.takeOffKz();
				ClothesData.ondressCache["4"] = 40000;
			} else {
				var kzId = ClothesData.ondressCache["4"] + "";
				var kzItem = ClothesData.clothesTemplateData("4", kzId);
				if (kzItem && kzItem["sub_part"] == "1") {
					this.takeOffKz();
					ClothesData.ondressCache["4"] = 40000;
				}
			}
		}

		if (sub_part == "4") {
			if (clothesItem["sub_part"] == "1") {
				this.takeOffSy();
				ClothesData.ondressCache["3"] = 30000;
			} else {
				var syId = ClothesData.ondressCache["3"] + "";
				var syItem = ClothesData.clothesTemplateData("3", syId);
				if (syItem && syItem["sub_part"] == "1") {
					this.takeOffSy();
					ClothesData.ondressCache["3"] = 30000;
				}
			}
		}

		var z_order1 = clothesItem["z_order1"];
		var layer1 = clothesItem["layer1"] + "_png";
		var z_order2 = clothesItem["z_order2"];
		var layer2 = clothesItem["layer2"] + "_png";
		var z_order3 = clothesItem["z_order3"];
		var layer3 = clothesItem["layer3"] + "_png";
		this.checkAndDress(z_order1, layer1, sub_part);
		this.checkAndDress(z_order2, layer2, sub_part);
		this.checkAndDress(z_order3, layer3, sub_part);
	}

	public dressItemOfSuit(sub_part: string, clothesId: number, conflictId?: number) {
		var strClothesId = clothesId.toString();
		var part = Math.floor(clothesId / 10000);
		var strPart = part + "";
		var clothesItem = ClothesData.clothesTemplateData(strPart, strClothesId);
		var curArr: eui.Image[] = this["part_" + sub_part];
		var len = curArr.length;
		for (var i = 0; i < len; i++) {
			var layer: eui.Image = curArr[i];
			layer.source = null;
		}
		curArr = null;

		if (0 == clothesId % 10000 || null == clothesItem) {
			if (sub_part == "1") {
				this.layer_430.source = "10000_png";
				this.layer_50.source = "10009_png";
			}
			return;
		}

		if (sub_part == "3") {
			if (clothesItem["sub_part"] == "1") {
				this.takeOffKz();
			} else {
				// var kzId = ClothesData.ondressCache["4"] + "";
				var kzId = "40000";
				if (conflictId) {
					kzId = conflictId + "";
				}
				var kzItem = ClothesData.clothesTemplateData("4", kzId);
				if (kzItem && kzItem["sub_part"] == "1") {
					this.takeOffKz();
				}
			}
		}

		if (sub_part == "4") {
			if (clothesItem["sub_part"] == "1") {
				this.takeOffSy();
			} else {
				// var syId = ClothesData.ondressCache["3"] + "";
				var syId = "30000";
				if (conflictId) {
					syId = conflictId + "";
				}
				var syItem = ClothesData.clothesTemplateData("3", syId);
				if (syItem && syItem["sub_part"] == "1") {
					this.takeOffSy();
				}
			}
		}

		var z_order1 = clothesItem["z_order1"];
		var layer1 = clothesItem["layer1"] + "_png";
		var z_order2 = clothesItem["z_order2"];
		var layer2 = clothesItem["layer2"] + "_png";
		var z_order3 = clothesItem["z_order3"];
		var layer3 = clothesItem["layer3"] + "_png";
		this.checkAndDress(z_order1, layer1, sub_part);
		this.checkAndDress(z_order2, layer2, sub_part);
		this.checkAndDress(z_order3, layer3, sub_part);
	}

	//脱掉裤子
	private takeOffKz() {
		var kzArr = this.part_4;
		var kz_len = kzArr.length;
		for (var i = 0; i < kz_len; i++) {
			var layer_kz: eui.Image = kzArr[i];
			layer_kz.source = null;
		}
	}

	//拖掉上衣
	private takeOffSy() {
		var syArr = this.part_3;
		var sy_len = syArr.length;
		for (var i = 0; i < sy_len; i++) {
			var layer_sy: eui.Image = syArr[i];
			layer_sy.source = null;
		}
	}

	//穿多件衣服
	public dress(dresses: Object, ornaments: Object) {
		var part: string;
		for (part in dresses) {
			this.dressItem(part, dresses[part]);
		}

		var subPart: string;
		for (subPart in ornaments) {
			this.dressItem(subPart, ornaments[subPart]);
		}
	}

	public dressClothesOfSuit(dresses: Object, ornaments: Object) {
		var part: string;
		for (part in dresses) {
			if (part == "3") {
				this.dressItemOfSuit(part, dresses[part], dresses["4"]);
			} else if (part == "4") {
				this.dressItemOfSuit(part, dresses[part], dresses["3"]);
			} else {
				this.dressItemOfSuit(part, dresses[part]);
			}
		}

		var subPart: string;
		for (subPart in ornaments) {
			this.dressItem(subPart, ornaments[subPart]);
		}
	}

	public blink() {
		var tw = egret.Tween.get(this.shower_blink);
		tw.to({ source: "shower_blink_2_png" }, 30)
			.to({ source: "shower_blink_3_png" }, 30)
			.to({ source: "shower_blink_4_png" }, 30)
			.to({ source: "shower_blink_3_png" }, 30)
			.to({ source: "shower_blink_2_png" }, 30)
			.to({ source: "shower_blink_1_png" }, 30);
	}

	//脱掉所有衣服
	public takeOffAllClothes() {
		var dresses: {} = {
			"1": 10000,
			"2": 20000,
			"3": 30000,
			"4": 40000,
			"5": 50000,
			"6": 60000,
			"8": 80000,
			"9": 90000,
			"10": 100000
		};
		var ornaments: {} = {
			"11": 70000,
			"12": 70000,
			"13": 70000,
			"14": 70000,
			"15": 70000,
			"16": 70000,
			"17": 70000,
			"18": 70000,
			"19": 70000,
			"20": 70000,
			"21": 70000,
			"22": 70000,
			"23": 70000
		};
		this.dress(dresses, ornaments);
	}

	//脱掉所有衣服（展示衣服用）
	public takeOffAllClothes2() {
		var dresses: {} = {
			"1": 10000,
			"2": 20000,
			"3": 30000,
			"4": 40000,
			"5": 50000,
			"6": 60000,
			"8": 80000,
			"9": 90000,
			"10": 100000
		};
		var ornaments: {} = {
			"11": 70000,
			"12": 70000,
			"13": 70000,
			"14": 70000,
			"15": 70000,
			"16": 70000,
			"17": 70000,
			"18": 70000,
			"19": 70000,
			"20": 70000,
			"21": 70000,
			"22": 70000,
			"23": 70000
		};
		this.dressClothesOfSuit(dresses, ornaments);
	}

	private checkAndDress(z_order1: string, layer1: string, sub_part: string) {
		if (z_order1 != "" && z_order1 != "0") {
			if (z_order1 == "40" && sub_part == "23") {
				this.layer_41.source = layer1;
			} else if (z_order1 == "70" && sub_part == "11") {
				this.layer_69.source = layer1;
			} else if (z_order1 == "70" && sub_part == "21") {
				this.layer_71.source = layer1;
			} else if (z_order1 == "70" && sub_part == "22") {
				this.layer_72.source = layer1;
			} else if (z_order1 == "70" && sub_part == "23") {
				this.layer_73.source = layer1;
			} else if (z_order1 == "80" && sub_part == "3") {
				this.layer_79.source = layer1;
			} else if (z_order1 == "80" && sub_part == "16") {
				this.layer_81.source = layer1;
			} else if (z_order1 == "80" && sub_part == "15") {
				this.layer_82.source = layer1;
			} else if (z_order1 == "130" && sub_part == "3") {
				this.layer_129.source = layer1;
			} else if (z_order1 == "140" && sub_part == "4") {
				this.layer_139.source = layer1;
			} else if (z_order1 == "310" && sub_part == "17") {
				this.layer_311.source = layer1;
			} else if (z_order1 == "310" && sub_part == "18") {
				this.layer_312.source = layer1;
			} else if (z_order1 == "335" && sub_part == "22") {
				this.layer_336.source = layer1;
			} else if (z_order1 == "416" && sub_part == "15") {
				this.layer_4166.source = layer1;
			} else if (z_order1 == "350" && sub_part == "15") {
				this.layer_351.source = layer1;
			} else if (z_order1 == "350" && sub_part == "23") {
				this.layer_352.source = layer1;
			} else if (z_order1 == "360" && sub_part == "4") {
				this.layer_359.source = layer1;
			} else if (z_order1 == "370" && sub_part == "4") {
				this.layer_369.source = layer1;
			} else if (z_order1 == "380" && sub_part == "4") {
				this.layer_378.source = layer1;
			} else if (z_order1 == "380" && sub_part == "3") {
				this.layer_379.source = layer1;
			} else if (z_order1 == "400" && sub_part == "16") {
				this.layer_401.source = layer1;
			} else if (z_order1 == "405" && sub_part == "14") {
				this.layer_403.source = layer1;
			} else if (z_order1 == "405" && sub_part == "13") {
				this.layer_403.source = layer1;
			} else if (z_order1 == "405" && sub_part == "8") {
				this.layer_406.source = layer1;
			} else if (z_order1 == "410" && sub_part == "21") {
				this.layer_411.source = layer1;
			} else if (z_order1 == "410" && sub_part == "8") {
				this.layer_412.source = layer1;
			} else if (z_order1 == "410" && sub_part == "22") {
				this.layer_413.source = layer1;
			} else if (z_order1 == "420" && sub_part == "13") {
				this.layer_416.source = layer1;
			} else if (z_order1 == "420" && sub_part == "4") {
				this.layer_417.source = layer1;
			} else if (z_order1 == "420" && sub_part == "3") {
				this.layer_418.source = layer1;
			} else if (z_order1 == "420" && sub_part == "16") {
				this.layer_419.source = layer1;
			} else if (z_order1 == "420" && sub_part == "19") {
				this.layer_421.source = layer1;
			} else if (z_order1 == "421" && sub_part == "19") {
				this.layer_422.source = layer1;
			} else if (z_order1 == "420" && sub_part == "8") {
				this.layer_423.source = layer1;
			} else if (z_order1 == "420" && sub_part == "22") {
				this.layer_424.source = layer1;
			} else if (z_order1 == "440" && sub_part == "12") {
				this.layer_439.source = layer1;
			} else if (z_order1 == "440" && sub_part == "21") {
				this.layer_441.source = layer1;
			} else if (z_order1 == "450" && sub_part == "3") {
				this.layer_449.source = layer1;
			} else if (z_order1 == "450" && sub_part == "8") {
				this.layer_451.source = layer1;
			} else if (z_order1 == "500" && sub_part == "11") {
				this.layer_499.source = layer1;
			} else if (z_order1 == "413" && sub_part == "3") {
				this.layer_4133.source = layer1;
			} else {
				this["layer_" + z_order1].source = layer1;
			}
		}
	}
}