class ClothesData {
    // Export --------------------------------------------------
    // 给Shower显示时使用
    public static clothePartNames: {} = {
        "1": "toufa", "2": "waitao", "3": "shangyi", "4": "kuzi",
        "5": "texiao", "6": "xiezi", "7": "shipin", "8": "bao", "9": "zhuangrong"
    };
    public static clotheSubPartNames: {} = {
        "11": "maozi", "12": "yanjing", "13": "erhuan", "14": "xianglian",
        "15": "shouhuan", "16": "yaodai", "17": "tuihuan", "18": "jiaolian", "19": "xiongzhen"
    };

    public static clothesParts: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    public static clothesSub_parts: string[] = ["11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

    // 是否初始化过用户数据
    public static hasFetchedUserClohtes(): boolean {
        return this._userData !== null;
    }

    // 换装用临时数据
    public static ondressCache: {} = {};
    public static ornamentsCache: {} = {};
    public static setClothesCache(dresses: Object, ornaments: Object) {
        ClothesData.ondressCache = CommonFunc.simpleCloneObj(dresses);
        ClothesData.ornamentsCache = CommonFunc.simpleCloneObj(ornaments);
    }

    // 换装显示用衣服模版数据
    public static displayClothesTemplatesOfPart(part: string): {}[] {
        var rtn: {}[] = [];
        var temp: {}[] = this.clothesTemplatesOfPart(part);
        // 排除 类型为10且不被玩家拥有的衣服
        var count: number = temp.length;
        var item: {} = null;
        for (var i = 0; i < count; i++) {
            item = temp[i];
            // if (item["sale"] === "0") {
            //     if (this.hasOwnedClohtes(parseInt(item["id"], 10))) {
            //         rtn.push(item);
            //     }
            // }
            // else {
            //     rtn.push(item);
            // }
            rtn.push(item);
        }

        return rtn;
    }

    //某部位所有未拥有的衣服
    public static displayNotOwnTemplatesOfPart(part: string): {}[] {
        var rtn: {}[] = [];
        var temp: {}[] = this.clothesTemplatesOfPart(part);
        var count: number = temp.length;
        var item: {} = null;
        for (var i = 0; i < count; i++) {
            item = temp[i];
            if (!this.hasOwnedClohtes(parseInt(item["id"]))) {
                rtn.push(item);
            }
        }

        rtn.sort(function(a, b) {
            return a["index"] - b["index"];
        });
        return rtn;
    }

    //某部位所有未拥有的某类型(金币，钻石，稀有)衣服
    public static notOwnTypeClothesOfPart(part: string, type?: string): {}[] {
        var rtn: {}[] = [];
        var temp: {}[] = this.clothesTemplatesOfPart(part);

        var count: number = temp.length;
        var item: {} = null;
        for (var i = 0; i < count; i++) {
            item = temp[i];
            if (type) {
                if (item["type"] == type && !this.hasOwnedClohtes(parseInt(item["id"]))) {
                    rtn.push(item);
                }
            } else {
                if (!this.hasOwnedClohtes(parseInt(item["id"]))) {
                    rtn.push(item);
                }
            }
        }

        if (part == "7") {
            var temp2 = this.clothesTemplatesOfPart("8");
            var item2: {} = null;
            var count2: number = temp2.length;
            for (var j = 0; j < count2; j++) {
                item2 = temp2[j];
                if (type) {
                    if (item2["type"] == type && !this.hasOwnedClohtes(parseInt(item2["id"]))) {
                        rtn.push(item2);
                    }
                } else {
                    if (!this.hasOwnedClohtes(parseInt(item2["id"]))) {
                        rtn.push(item2);
                    }
                }
            }
        }

        rtn.sort(function(a, b) {
            return a["index"] - b["index"];
        });
        return rtn;
    }

    // 某部分的所有衣服ID的数组
    public static clothesIdsOfPart(part: string): string[] {
        return this._allClothesId[part];
    }
    // 某部分的所有衣服模版数的据数组
    public static clothesTemplatesOfPart(part: string): {}[] {
        return this._template[part];
    }
    // 某衣服ID对应模版数据的下标
    public static clothesId2Index(clothesId: string): number {
        return this._clothesIdMap[clothesId];
    }
    // 返回某件衣服的模版数据
    public static clothesTemplateData(part: string, clothesId: string): {} {
        // console.log("part = " + part + ", clothesId = " + clothesId);
        var intClothesId: number = parseInt(clothesId, 10);
        if (0 === intClothesId % 10000) {
            return null;
        }

        var self = this;
        var idx: number = self.clothesId2Index(clothesId);
        var intPart: number = parseInt(part, 10);
        var partClothes: {}[] = null;
        if (intPart < 11) {
            partClothes = self.clothesTemplatesOfPart(part);
        }
        else {
            partClothes = self.clothesTemplatesOfPart("7");
        }

        return partClothes[idx];
    }

    //返回某部位符合标签的所有服装
    public static allClothesByLabel(part: string, label: string, label2?: string, label3?: string): {}[] {
        var rtn: {}[] = [];
        var partClothes = this.displayClothesTemplatesOfPart(part);
        var length = partClothes.length;
        for (var i = 0; i < length; i++) {
            var tag1: string = partClothes[i]["tag1"];
            var tag2: string = partClothes[i]["tag2"];
            var tag3: string = partClothes[i]["tag3"];
            var tag4: string = partClothes[i]["tag4"];
            if (label == tag1 || label == tag2 || label == tag3 || label == tag4) {
                rtn.push(partClothes[i]);
            } else if (label2 != "0" && (label2 == tag1 || label2 == tag2 || label2 == tag3 || label2 == tag4)) {
                rtn.push(partClothes[i]);
            } else if (label3 != "0" && (label3 == tag1 || label3 == tag2 || label == tag3 || label3 == tag4)) {
                rtn.push(partClothes[i]);
            }
        }

        rtn.sort(function(a, b) {
            return a["index"] - b["index"];
        });
        return rtn;
    }

    //从玩家拥有衣服中筛选符合标签的所有衣服
    public static allOwnClothesByLabel(part: string, label: string, label2?: string, label3?: string): {}[] {
        var rtn: {}[] = [];
        // var ids: number[] = this._userData[part];
        var partClothes: {}[] = ClothesData.ownedClothesTemplatesOfPart(part);
        var length = partClothes.length;
        for (var i = 0; i < length; i++) {
            var tag1: string = partClothes[i]["tag1"];
            var tag2: string = partClothes[i]["tag2"];
            var tag3: string = partClothes[i]["tag3"];
            var tag4: string = partClothes[i]["tag4"];
            if (label == tag1 || label == tag2 || label == tag3 || label == tag4) {
                rtn.push(partClothes[i]);
            } else if (label2 != "0" && (label2 == tag1 || label2 == tag2 || label2 == tag3 || label2 == tag4)) {
                rtn.push(partClothes[i]);
            } else if (label3 != "0" && (label3 == tag1 || label3 == tag2 || label == tag3 || label3 == tag4)) {
                rtn.push(partClothes[i]);
            }
        }

        rtn.sort(function(a, b) {
            return a["index"] - b["index"];
        });
        return rtn;
    }

    //从未拥有的衣服中找出所有符合标签的衣服
    public static allNotOwnClothesByLabel(part: string, label: string, label2?: string, label3?: string):{}[] {
        var rtn: {}[] = [];
        // var ids: number[] = this._userData[part];
        var partClothes: {}[] = ClothesData.displayNotOwnTemplatesOfPart(part);
        var length = partClothes.length;
        for (var i = 0; i < length; i++) {
            var tag1: string = partClothes[i]["tag1"];
            var tag2: string = partClothes[i]["tag2"];
            var tag3: string = partClothes[i]["tag3"];
            var tag4: string = partClothes[i]["tag4"];
            if (label == tag1 || label == tag2 || label == tag3 || label == tag4) {
                rtn.push(partClothes[i]);
            } else if (label2 != "0" && (label2 == tag1 || label2 == tag2 || label2 == tag3 || label2 == tag4)) {
                rtn.push(partClothes[i]);
            } else if (label3 != "0" && (label3 == tag1 || label3 == tag2 || label == tag3 || label3 == tag4)) {
                rtn.push(partClothes[i]);
            }
        }

        rtn.sort(function(a, b) {
            return a["index"] - b["index"];
        });
        return rtn;
    }

    //所有符合标签的未拥有某部位某类型（金币，钻石，稀有）衣服
    public static allNotOwnTypeClothesByLabel(part: string, type: string, label: string, label2?: string, label3?: string):{}[] {
        var rtn: {}[] = [];
        // var ids: number[] = this._userData[part];
        var partClothes: {}[] = ClothesData.notOwnTypeClothesOfPart(part, type);
        var length = partClothes.length;
        for (var i = 0; i < length; i++) {
            var tag1: string = partClothes[i]["tag1"];
            var tag2: string = partClothes[i]["tag2"];
            var tag3: string = partClothes[i]["tag3"];
            var tag4: string = partClothes[i]["tag4"];
            if (label == tag1 || label == tag2 || label == tag3 || label == tag4) {
                rtn.push(partClothes[i]);
            } else if (label2 != "0" && (label2 == tag1 || label2 == tag2 || label2 == tag3 || label2 == tag4)) {
                rtn.push(partClothes[i]);
            } else if (label3 != "0" && (label3 == tag1 || label3 == tag2 || label == tag3 || label3 == tag4)) {
                rtn.push(partClothes[i]);
            }
        }

        rtn.sort(function(a, b) {
            return a["index"] - b["index"];
        });
        return rtn;
    }

    // 玩家是否拥有某件ID的衣服
    public static hasOwnedClohtes(clothesId: number) {
        var part: string = "" + Math.floor(clothesId / 10000);
        var ownedPart: number[] = this._userData[part];
        if (ownedPart === undefined) {
            return false;
        }
        else {
            return (-1 !== ownedPart.indexOf(clothesId));
        }
    }

    //玩家所拥有衣服中某部位的所有衣服
    public static ownedClothesTemplatesOfPart(part: string): {}[] {
        var rtn: {}[] = [];
        var arr: number[] = this._userData[part];
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            rtn.push(this.clothesTemplateData(part, arr[i].toString()));
        }

        if(part == "7") {
            var arr2: number[] = this._userData["8"];
            var len2 = arr2.length;
            for(var j = 0; j < len2; j++) {
                rtn.push(this.clothesTemplateData("8", arr2[j].toString()))
            }
        }

        rtn.sort(function(a, b) {
            return a["index"] - b["index"];
        });
        return rtn;
    }


    // Event & Callback ---------------------------------------
    public static initTemplate(data: {}[]) {
        console.log("ClothesData::initTemplate() ...");
        var self = this;
        var template: {} = {};
        var ids: {} = {};
        var idMap: {} = {};
        var coinClothes: {}[] = [];
        var diamClothes: {}[] = [];
        var xiyouClothes: {}[] = [];
        var parts = self.clothePartNames;
        var part = null;
        for (part in parts) {
            template[part] = [];
            ids[part] = [];
        }

        var allClothesData: {}[] = [];
        var len = data.length;
        var item = null;

        var clothesId = null;
        for (var i = 0; i < len; i++) {
            item = data[i];

            //排除sale==0的衣服
            if (item["sale"] == "0") {
                continue;
            }

            allClothesData.push(item);


            clothesId = item["id"];
            part = item["part"];

            template[part].push(item);
            ids[part].push(clothesId);
            idMap[clothesId] = template[part].length - 1;
        }

        self._template = template;
        self._allClothesId = ids;
        self._clothesIdMap = idMap;
        self._allClothesArray = allClothesData;
    }

    public static updateUserClohtes(data: {}) {
        if (data) {
            this._userData = data;
        }
    }

    public static updateOwnClothes(data: number[]) {//购买衣服成功后的新衣服数组
        if (data && data.length != 0) {
            var len = data.length;
            for (var i = 0; i < len; i++) {
                for (var part in this._userData) {
                    if (Math.floor(data[i] / 10000).toString() == part) {
                        var ownedPart: number[] = this._userData[part];
                        ownedPart.push(data[i]);
                    }
                }
            }
        }
    }

    public static addDropClothes(id: string) {
        if (id == "") {
            return;
        }

        var id_num = parseInt(id);
        for (var part in this._userData) {
            if (Math.floor(id_num / 10000).toString() == part) {
                var ownedPart: number[] = this._userData[part];
                ownedPart.push(id_num);
            }
        }
    }

    public static allClothesArray() {
        return this._allClothesArray;
    }

    //所有金币衣服
    public static allCoinClothesArray() {
        return this._coinClothesArray;
    }

    //所有钻石衣服
    public static allDiamClothesArray() {
        return this._diamClothesArray;
    }

    //所有稀有衣服
    public static allXiyouClothesArray() {
        return this._xiyouClothesArray;
    }

    //所有未拥有金币衣服
    public static allNotOwnCoinClothes() {
        var rtn: {}[] = [];
        var len = this._coinClothesArray.length;
        for (var i = 0; i < len; i++) {
            var item = this._coinClothesArray[i];
            if (!this.hasOwnedClohtes(parseInt(item["id"]))) {
                rtn.push(item);
            }
        }

        return rtn;
    }

    //所有未拥有的钻石衣服
    public static allNotOwnDiamClothes() {
        var rtn: {}[] = [];
        var len = this._diamClothesArray.length;
        for (var i = 0; i < len; i++) {
            var item = this._diamClothesArray[i];
            if (!this.hasOwnedClohtes(parseInt(item["id"]))) {
                rtn.push(item);
            }
        }

        return rtn;
    }

    //所有为拥有的稀有衣服
    public static allNotOwnRareClothes() {
        var rtn: {}[] = [];
        var len = this._xiyouClothesArray.length;
        for (var i = 0; i < len; i++) {
            var item = this._xiyouClothesArray[i];
            if (!this.hasOwnedClohtes(parseInt(item["id"]))) {
                rtn.push(item);
            }
        }

        return rtn;
    }

    //所有未拥有的衣服
    public static allNotOwnClothesArray() {
        var rtn: {}[] = [];
        var len = this._allClothesArray.length;
        for (var i = 0; i < len; i++) {
            var item = this._allClothesArray[i];
            if (!this.hasOwnedClohtes(parseInt(item["id"]))) {
                rtn.push(item);
            }
        }

        return rtn;
    }

    // Inner --------------------------------------------------
    private static _template: {} = null;        // 按部位保存的衣服模版数据
    private static _allClothesId: {} = null;    // 按部位保存的所有衣服ID，用于衣服列表显示
    private static _clothesIdMap: {} = null;    // 所有衣服ID的大字典，ID为键，ID对应于衣服模版数据中的下标为值，用于通过ID快速定位模版数据

    private static _allClothesArray: {}[] = []; //所有衣服数组(排除sale==0)
    private static _coinClothesArray: {}[] = [];//所有金币衣服
    private static _diamClothesArray: {}[] = [];//所有钻石衣服
    private static _xiyouClothesArray: {}[] = [];//所有稀有衣服
    private static _userData: {} = null;        // 玩家拥有衣服的ID，分部分保存
}