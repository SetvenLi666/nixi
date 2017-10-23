class Shower extends eui.Component implements eui.UIComponent {
	// Export --------------------------------------------------
	public dressItem(sub_part: string, clothesId: number) {
		var strClothesId = clothesId.toString();
		var part = Math.floor(clothesId / 10000);
		var strPart = part.toString();
		var clothesItem = ClothesData.clothesTemplateData(strPart, strClothesId);
		var partName: string;
		if (7 === part) {
			partName = ClothesData.clotheSubPartNames[sub_part];
		}
		else {
			partName = ClothesData.clothePartNames[sub_part];
		}

		if (0 === clothesId % 10000 || null === clothesItem) {
			this.dresson[partName] = part + "0000_png";
			if ("1" === strPart) {
				this.dresson[partName + "2"] = "10009_png";
			}
			else {
				this.dresson[partName + "2"] = null;
			}
			this.dresson[partName + "3"] = null;
        }
		else {
			this.dresson[partName] = clothesId + "_png";

			var layer2 = clothesItem["layer2"];
			this.dresson[partName + "2"] = layer2.length > 0 ? layer2 + "_png" : null;

			var layer3 = clothesItem["layer3"];
			this.dresson[partName + "3"] = layer3.length > 0 ? layer3 + "_png" : null;

			if ("4" === strPart) {
				var part3Name:string = ClothesData.clothePartNames["3"];
				var oldPart3:string = this.dresson[part3Name];
				var oldClothesId3 = oldPart3.split("_")[0];
				var oldClothesItem3 = ClothesData.clothesTemplateData("3", oldClothesId3);
				if (null !== oldClothesItem3 && "1" === oldClothesItem3["sub_part"]) {
					this.dresson[part3Name] = "30000_png";
					this.dresson[part3Name + "2"] = null;
					this.dresson[part3Name + "3"] = null;

					//----------1月16修改
					if(this.getChildIndex(<eui.Image>this["shangyi"]) < this.getChildIndex(<eui.Image>this["kuzi"])) {
						// console.log("ccccccccc");
					}else {
						this.swapChildren(<eui.Image>this["shangyi"], <eui.Image>this["kuzi"]);
					}
					//----------
				}
				//----------1月16修改
				else if (oldClothesItem3 !== null && parseInt(oldClothesItem3["z_order1"]) < parseInt(clothesItem["z_order1"])) {
					if(this.getChildIndex(<eui.Image>this["shangyi"]) < this.getChildIndex(<eui.Image>this["kuzi"])) {
						// console.log("ccccccccc");
					}else {
						this.swapChildren(<eui.Image>this["shangyi"], <eui.Image>this["kuzi"]);
					}
				}else if(oldClothesItem3 !== null) {
					if(this.getChildIndex(<eui.Image>this["shangyi"]) > this.getChildIndex(<eui.Image>this["kuzi"])) {
						// console.log("dddddddddd");
					}else {
						this.swapChildren(<eui.Image>this["shangyi"], <eui.Image>this["kuzi"]);
					}
				}
				//-----------
			}
			/*1月16修改之前的
			else if ("3" === strPart && "1" === clothesItem["sub_part"]) {
				var part4Name:string = ClothesData.clothePartNames["4"];
				this.dresson[part4Name] = "40000_png";
				this.dresson[part4Name + "2"] = null;
				this.dresson[part4Name + "3"] = null;
			}
			*/
			//------------1月16修改
			else if ("3" === strPart) {
				var part4Name:string = ClothesData.clothePartNames["4"];
				var oldPart4:string = this.dresson[part4Name];
				var oldClothesId4 = oldPart4.split("_")[0];
				var oldClothesItem4 = ClothesData.clothesTemplateData("4", oldClothesId4);
				if(oldClothesId4 !== null && "1" === clothesItem["sub_part"]) {
					this.dresson[part4Name] = "40000_png";
					this.dresson[part4Name + "2"] = null;
					this.dresson[part4Name + "3"] = null;

					if(this.getChildIndex(<eui.Image>this["kuzi"]) < this.getChildIndex(<eui.Image>this["shangyi"])) {
						// console.log("eeeeeeeeee");
					}else {
						this.swapChildren(<eui.Image>this["shangyi"], <eui.Image>this["kuzi"]);
					}
				}
				else if (oldClothesItem4 !== null && parseInt(oldClothesItem4["z_order1"]) < parseInt(clothesItem["z_order1"])) {
					if(this.getChildIndex(<eui.Image>this["kuzi"]) < this.getChildIndex(<eui.Image>this["shangyi"])) {
						// console.log("aaaaaaaaaa");
					}else {
						this.swapChildren(<eui.Image>this["shangyi"], <eui.Image>this["kuzi"]);
					}
				}else if(oldClothesItem4 !== null) {
					if(this.getChildIndex(<eui.Image>this["kuzi"]) > this.getChildIndex(<eui.Image>this["shangyi"])) {
						// console.log("bbbbbbbbbbb");
					}else {
						this.swapChildren(<eui.Image>this["shangyi"], <eui.Image>this["kuzi"]);
					}
				}
			}
			//-----------
		}
	}

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
		};
		this.dress(dresses, ornaments);
	}

	public blink() {
		var tw = egret.Tween.get(this.shower_blink);
		tw.to({source: "shower_blink_2_png"}, 30)
			.to({source: "shower_blink_3_png"}, 30)
			.to({source: "shower_blink_4_png"}, 30)
			.to({source: "shower_blink_3_png"}, 30)
			.to({source: "shower_blink_2_png"}, 30)
			.to({source: "shower_blink_1_png"}, 30);
	}

	// Event & Callback --------------------------------------------------
	private timer: egret.Timer;

	public constructor() {
		super();

		this.skinName = "resource/skins/common/ShowerSkin.exml";
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();

		//点击可穿透(重要)
		this.touchEnabled = false;
		this.touchChildren = false;

		this.timer = new egret.Timer(3000, 0);
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.blink, this);
		this.timer.start();
	}

	// Inner --------------------------------------------------
	private dresson: {} = {
		"toufa": "10000_png",
		"toufa2": "10009_png",
		"shangyi": "30000_png",
		"kuzi": "40000_png",
		"zhuangrong": "90000_png"
	};

	private shower_blink: eui.Image;
}