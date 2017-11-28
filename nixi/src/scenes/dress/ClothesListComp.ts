/**
 *
 * @author 
 *
 */
class ClothesListComp extends eui.Component {
    private isTaskIn: boolean;
    private taskID: string;

    private group: eui.Group;
    private group_2: eui.Group;

    // private shower: Shower;
    private model: Model;

    private icon_toufa: eui.Button;
    private icon_waitao: eui.Button;
    private icon_shangyi: eui.Button;
    private icon_kuzi: eui.Button;
    private icon_xiezi: eui.Button;
    private icon_shipin: eui.Button;
    private icon_texiao: eui.Button;
    private icon_zhuangrong: eui.Button;
    private icon_def: eui.Button;

    private iconList: eui.List;
    private scroller: eui.Scroller;
    private listTip: eui.Image;

    private selectedIndex: number = -1;

    private curPart: string;
    private curIndex: number = -1;

    private back_img: eui.Image;
    private btn_buy: eui.Image;
    private btn_save: eui.Image;
    private btn_shop: eui.Image;

    private tipComp: TaskTipComp;
    private tag1: string = null;
    private tag2: string = null;
    private tag3: string = null;
    private isFilter: boolean = false;
    private taskFlag: number = 0;
    private btn_takeoff: eui.Image;

    public constructor(taskID: string, tag1: string, tag2: string, tag3: string) {
        super();

        this.skinName = "ClothesListSkin";
        this.taskID = taskID;
        this.isTaskIn = !(taskID == null);
        this.tag1 = tag1;
        this.tag2 = tag2;
        this.tag3 = tag3;
        this.icon_def = this.icon_shangyi;
        this.curPart = "3";
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
    }

    private addStage() {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);

        this.group.width = DisplayMgr.stageW;
        this.group_2.width = Math.min(DisplayMgr.stageW, 852);

        this.icon_toufa.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.icon_waitao.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.icon_shangyi.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.icon_kuzi.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.icon_xiezi.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.icon_texiao.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.icon_shipin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.icon_zhuangrong.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);

        this.model.x = (this.group_2.width - 230 - this.model.width * this.model.scaleX) / 2;
        this.model.dress(ClothesData.ondressCache, ClothesData.ornamentsCache);

        this.icon_def.currentState = "disabled";
        this.icon_def.enabled = false;

        this.back_img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goBack, this);
        this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.btn_save.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSave, this);
        this.btn_shop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShop, this);

        var clothesData = ClothesData.ownedClothesTemplatesOfPart(this.curPart);
        // var clothesData = ClothesData.displayClothesTemplatesOfPart(this.curPart);
        if (clothesData.length == 0) {
            this.listTip.visible = true;
        }
        this.iconList.dataProvider = new eui.ArrayCollection(clothesData);
        this.iconList.itemRenderer = ClothesIconItemSkin;
        this.iconList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelected, this);
        this.iconList.selectedIndices = this.currentListSelectedIndex("3");
        this.curIndex = this.iconList.selectedIndex;

        if (this.isTaskIn) {
            if (this.taskID == "pk") {
                this.btn_save.source = "dressUI_json.dress_btn_save";
            } else {
                this.btn_save.source = "dressUI_json.dress_btn_start";
            }
            this.tipComp.visible = true;
            this.tipComp.tag_1.source = "clothes_tags_json.tag_" + this.tag1;
            if (this.tag2) {
                this.tipComp.tag_2.source = "clothes_tags_json.tag_" + this.tag2;
            }
            if (this.tag3) {
                this.tipComp.tag_3.source = "clothes_tags_json.tag_" + this.tag3;
            }

            this.tipComp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFilter, this);
        }

        this.btn_takeoff.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTakeoff, this);

        CustomEventMgr.addEventListener("403", this.after_save_dress_403, this);
        CustomEventMgr.addEventListener("405", this.after_save_dress_403, this);
        CustomEventMgr.addEventListener("605", this.afterData_605, this);

        CustomEventMgr.addEventListener("Update Clothes Status", this.dressDown, this);

        if (PlayerData.guide != 0) {
            CustomEventMgr.addEventListener("Guide_Step_2_6", this.onShop, this);
            CustomEventMgr.addEventListener("Guide_Step_2_14", this.onTakeoff, this);
            CustomEventMgr.addEventListener("Guide_Step_2_15", this.guide_step_2_15, this);
            CustomEventMgr.addEventListener("Guide_Step_2_16", this.guide_step_2_16, this);
            CustomEventMgr.addEventListener("Guide_Step_2_17", this.guide_step_2_15, this);
            CustomEventMgr.addEventListener("Guide_Step_2_19", this.guide_step_2_19, this);
            CustomEventMgr.addEventListener("Guide_Step_2_20", this.guide_step_2_20, this);
            CustomEventMgr.addEventListener("Guide_Step_2_21", this.guide_step_2_21, this);
            CustomEventMgr.addEventListener("Guide_Step_2_22", this.guide_step_2_22, this);
            CustomEventMgr.addEventListener("Guide_Step_2_18", this.onSave, this);
        }

        CustomEventMgr.addEventListener("172", this.after_clientdata_172, this);
    }

    private onExit() {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);

        this.back_img.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goBack, this);
        this.btn_buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.btn_save.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSave, this);
        this.btn_shop.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShop, this);

        this.iconList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelected, this);

        this.icon_toufa.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.icon_waitao.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.icon_shangyi.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.icon_kuzi.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.icon_xiezi.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.icon_texiao.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.icon_shipin.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.icon_zhuangrong.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);  

        this.btn_takeoff.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTakeoff, this);
        this.tipComp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onFilter, this);

        CustomEventMgr.removeEventListener("403", this.after_save_dress_403, this);
        CustomEventMgr.removeEventListener("405", this.after_save_dress_403, this);
        CustomEventMgr.removeEventListener("605", this.afterData_605, this);
        CustomEventMgr.removeEventListener("Update Clothes Status", this.dressDown, this);

        CustomEventMgr.removeEventListener("172", this.after_clientdata_172, this);

        if (PlayerData.guide != 0) {
            CustomEventMgr.removeEventListener("Guide_Step_2_6", this.onShop, this);
            CustomEventMgr.removeEventListener("Guide_Step_2_14", this.onTakeoff, this);
            CustomEventMgr.removeEventListener("Guide_Step_2_15", this.guide_step_2_15, this);
            CustomEventMgr.removeEventListener("Guide_Step_2_16", this.guide_step_2_16, this);
            CustomEventMgr.removeEventListener("Guide_Step_2_17", this.guide_step_2_15, this);
            CustomEventMgr.removeEventListener("Guide_Step_2_19", this.guide_step_2_19, this);
            CustomEventMgr.removeEventListener("Guide_Step_2_20", this.guide_step_2_20, this);
            CustomEventMgr.removeEventListener("Guide_Step_2_21", this.guide_step_2_21, this);
            CustomEventMgr.removeEventListener("Guide_Step_2_22", this.guide_step_2_22, this);
            CustomEventMgr.removeEventListener("Guide_Step_2_18", this.onSave, this);
        }
    }

    private onTakeoff() {
        var self = this;
        DisplayMgr.buttonScale(this.btn_takeoff, function () {
            SoundManager.instance().buttonSound();
            self.model.takeOffAllClothes();
            ClothesData.ondressCache = { "1": 10000, "2": 20000, "3": 30000, "4": 40000, "5": 50000, "6": 60000, "8": 80000, "9": 90000, "10": 100000 };
            ClothesData.ornamentsCache = {
                "11": 70000, "12": 70000, "13": 70000, "14": 70000, "15": 70000, "16": 70000, "17": 70000, "18": 70000, "19": 70000, "20": 70000, "21": 70000, "22": 70000, "23": 70000
            };
            self.iconList.selectedIndices = [];
        });
    }

    private dressDown() {
        this.iconList.selectedIndices = [];
        // this.updateFlagState();
        this.updateTotalPrice();
    }

    private onFilter() {
        SoundManager.instance().buttonSound();
        if (!this.isFilter) {
            this.isFilter = true;
            this.tipComp.filterImage.visible = false;
            this.tipComp.filteredImage.visible = true;
            if (this.curPart == "1" || this.curPart == "9") {
                this.iconList.dataProvider = new eui.ArrayCollection(ClothesData.ownedClothesTemplatesOfPart(this.curPart));
            } else {
                this.iconList.dataProvider = new eui.ArrayCollection(ClothesData.allOwnClothesByLabel(this.curPart, this.tag1, this.tag2, this.tag3));
            }

            this.iconList.dataProviderRefreshed();
        } else {
            this.isFilter = false;
            this.tipComp.filterImage.visible = true;
            this.tipComp.filteredImage.visible = false;
            this.iconList.dataProvider = new eui.ArrayCollection(ClothesData.ownedClothesTemplatesOfPart(this.curPart));
            this.iconList.dataProviderRefreshed();
        }
        if (this.iconList.dataProvider.length == 0) {
            this.listTip.visible = true;
        } else {
            this.listTip.visible = false;
        }
        this.iconList.selectedIndices = this.currentListSelectedIndex(this.curPart);
    }

    private onSelected(e: eui.ItemTapEvent) {
        console.log(e.item.id);
        SoundManager.instance().buttonSound();
        var data: {} = {};

        var part = Math.floor(parseInt(e.item.id) / 10000).toString();
        //this.curPart---->part
        if (part == "7") {
            data["sub_part"] = e.item.sub_part;
            data["id"] = parseInt(e.item.id);
            for (var i in ClothesData.ornamentsCache) {
                if (e.item.id == ClothesData.ornamentsCache[i]) {
                    data["id"] = 70000;
                    break;
                }
            }
            var len = this.iconList.selectedIndices.length;
            for (var j = len - 1; j >= 0; j--) {
                if (e.item.sub_part == this.iconList.dataProvider["source"][this.iconList.selectedIndices[j]]["sub_part"] && e.itemIndex != this.iconList.selectedIndices[j]) {
                    this.iconList.selectedIndices.splice(j, 1);
                }
            }

            ClothesData.ornamentsCache[e.item.sub_part] = data["id"];
        } else {
            console.log(this.iconList.selectedIndices);
            var flagIndex = this.iconList.selectedIndices.indexOf(e.itemIndex);
            console.log(flagIndex);
            if (part == "8") {
                if (ClothesData.ondressCache["8"] == 80000) {
                    flagIndex = -1;
                } else {
                    if(e.item.id == ClothesData.ondressCache["8"]) {
                        flagIndex = e.itemIndex;
                    }else {
                        flagIndex = -1;
                    }
                }
            }
            console.log(flagIndex);
            if (flagIndex != -1) {
                // 脱
                this.iconList.selectedIndices.splice(flagIndex, 1);
                this.iconList.selectedIndex = -1;

                if (e.item.part == "7") {
                    data["sub_part"] = e.item.sub_part;
                    data["id"] = parseInt(e.item.id);
                    for (var i in ClothesData.ornamentsCache) {
                        if (e.item.id == ClothesData.ornamentsCache[i]) {
                            data["id"] = 70000;
                            break;
                        }
                    }
                    ClothesData.ornamentsCache[e.item.sub_part] = data["id"];
                } else {
                    ClothesData.ondressCache[e.item.part] = parseInt(e.item.part + "0000");
                    data["sub_part"] = e.item.part;
                    data["id"] = ClothesData.ondressCache[e.item.part];
                }

            } else {
                // 穿
                if(part == "8" && e.item.id != ClothesData.ondressCache["8"]) {
                    var index_len = this.iconList.selectedIndices.length;
                    for(var z = index_len - 1; z >= 0; z--) {
                        var clothesitem = this.iconList.dataProvider["source"][this.iconList.selectedIndices[z]];
                        if(clothesitem["id"] == ClothesData.ondressCache["8"]) {
                            this.iconList.selectedIndices.splice(z, 1);
                        }
                    }
                }else {
                    this.iconList.selectedIndices.push(e.itemIndex);
                }

                // this.iconList.selectedIndices.push(e.itemIndex);
                if (e.item.part == "7") {
                    data["id"] = parseInt(e.item.id);
                    data["sub_part"] = e.item.sub_part;
                    for (var i in ClothesData.ornamentsCache) {
                        if (parseInt(e.item.id) == ClothesData.ornamentsCache[i]) {
                            data["id"] = 70000;
                            break;
                        }
                    }
                    ClothesData.ornamentsCache[e.item.sub_part] = data["id"];
                } else {
                    data["id"] = parseInt(e.item.id);
                    data["sub_part"] = e.item.part;

                    ClothesData.ondressCache[e.item.part] = parseInt(e.item.id);
                }
            }
        }


        this.model.dressItem(data["sub_part"], data["id"]);
    }

    private updateTotalPrice() {
        var totalCoin: number = 0;
        var totalGold: number = 0;
        var totalDebris: number = 0;
        for (var i in ClothesData.ondressCache) {
            if (ClothesData.ondressCache[i] % 10000 != 0) {
                if (!ClothesData.hasOwnedClohtes(ClothesData.ondressCache[i])) {
                    if (ClothesData.clothesTemplateData(i, ClothesData.ondressCache[i].toString())["type"] == "1") {
                        totalCoin += parseInt(ClothesData.clothesTemplateData(i, ClothesData.ondressCache[i].toString())["cost"]);
                    } else if (ClothesData.clothesTemplateData(i, ClothesData.ondressCache[i].toString())["type"] == "2") {
                        totalGold += parseInt(ClothesData.clothesTemplateData(i, ClothesData.ondressCache[i].toString())["cost"]);
                    } else if (ClothesData.clothesTemplateData(i, ClothesData.ondressCache[i].toString())["type"] == "3") {
                        totalDebris += parseInt(ClothesData.clothesTemplateData(i, ClothesData.ondressCache[i].toString())["cost"]);
                    }
                }
            }
        }

        for (var j in ClothesData.ornamentsCache) {
            if (ClothesData.ornamentsCache[j] % 10000 != 0) {
                if (!ClothesData.hasOwnedClohtes(ClothesData.ornamentsCache[j])) {
                    if (ClothesData.clothesTemplateData(j, ClothesData.ornamentsCache[j].toString())["type"] == "1") {
                        totalCoin += parseInt(ClothesData.clothesTemplateData(j, ClothesData.ornamentsCache[j].toString())["cost"]);
                    } else if (ClothesData.clothesTemplateData(j, ClothesData.ornamentsCache[j].toString())["type"] == "2") {
                        totalGold += parseInt(ClothesData.clothesTemplateData(j, ClothesData.ornamentsCache[j].toString())["cost"]);
                    } else if (ClothesData.clothesTemplateData(j, ClothesData.ornamentsCache[j].toString())["type"] == "3") {
                        totalDebris += parseInt(ClothesData.clothesTemplateData(j, ClothesData.ornamentsCache[j].toString())["cost"]);
                    }
                }

            }
        }
    }

    private touchHandle(evt: egret.TouchEvent) {
        SoundManager.instance().buttonSound();
        this.icon_def.currentState = "up";
        this.icon_def.enabled = true;
        var target: eui.Button = evt.target;
        target.currentState = "disabled";
        target.enabled = false;
        this.scroller.stopAnimation();

        var clothesData: {}[];

        this.icon_def = target;

        switch (evt.target) {
            case this.icon_toufa:
                this.curPart = "1";
                break;
            case this.icon_waitao:
                this.curPart = "2";
                break;
            case this.icon_shangyi:
                this.curPart = "3";
                break;
            case this.icon_kuzi:
                this.curPart = "4";
                break;
            case this.icon_texiao:
                this.curPart = "5";
                break;
            case this.icon_xiezi:
                this.curPart = "6";
                break;
            case this.icon_shipin:
                this.curPart = "7";
                break;
            case this.icon_zhuangrong:
                this.curPart = "9";
                break;
        }
        if (this.isTaskIn && this.isFilter) {
            if (this.curPart == "1" || this.curPart == "9") {
                clothesData = ClothesData.ownedClothesTemplatesOfPart(this.curPart);
            } else {
                clothesData = ClothesData.allOwnClothesByLabel(this.curPart, this.tag1, this.tag2, this.tag3);
            }
        } else {
            clothesData = ClothesData.ownedClothesTemplatesOfPart(this.curPart);
            // var clothesData = ClothesData.displayClothesTemplatesOfPart(this.curPart);
        }
        if (clothesData.length == 0) {
            this.listTip.visible = true;
        } else {
            this.listTip.visible = false;
        }
        this.iconList.dataProvider = new eui.ArrayCollection(clothesData);
        this.iconList.dataProviderRefreshed();
        this.iconList.selectedIndices = this.currentListSelectedIndex(this.curPart);
    }

    private currentListSelectedIndex(part: string): number[] {
        this.iconList.selectedIndices = [];
        this.iconList.allowMultipleSelection = false;
        var clothes_id: number;
        if (part == "7") {
            this.iconList.allowMultipleSelection = true;
            var len = this.iconList.dataProvider.length;
            for (var p in ClothesData.ornamentsCache) {
                if (ClothesData.ornamentsCache[p] % 10000) {
                    for (var j = 0; j < len; j++) {
                        if (ClothesData.ornamentsCache[p] == this.iconList.dataProvider["source"][j]["id"]) {
                            this.iconList.selectedIndices.push(j);
                            break;
                        }
                    }
                }
            }
        } else {
            clothes_id = ClothesData.ondressCache[part];
            var len = this.iconList.dataProvider.length;
            for (var i = 0; i < len; i++) {
                if (clothes_id == parseInt(this.iconList.dataProvider["source"][i]["id"])) {
                    this.iconList.selectedIndices.push(i);
                    break;
                }
            }
        }
        return this.iconList.selectedIndices;
    }

    private goBack() {
        var self = this;
        DisplayMgr.buttonScale(this.back_img, function () {
            SoundManager.instance().buttonSound();
            ClothesData.setClothesCache(ShowData.dresses, ShowData.ornaments);
            if (TaskData.gameTask) {
                NetLoading.showLoading();
                var request = HttpProtocolMgr.commit_extra_mission_605(TaskData.taskTempID, 6, TaskData.taskFlag6);
                HttpMgr.postRequest(request);
            } else if (self.taskID == "pk") {
                SceneMgr.gotoPK();
            } else if (self.taskID != null && self.taskID != "pk") {
                SceneMgr.gotoTaskScene(PlayerData.phase, PlayerData.mission);
            } else {
                SceneMgr.gotoMainScene();
            }
        });
    }

    private after_clientdata_172() {
        var request: egret.URLRequest = HttpProtocolMgr.commit_mission_603(this.taskID);
        HttpMgr.postRequest(request);
    }

    private afterData_605() {
        NetLoading.removeLoading();
        SceneMgr.gotoTaskScene(PlayerData.phase, PlayerData.mission);
    }

    private onBuy() {
        var self = this;
        DisplayMgr.buttonScale(this.btn_buy, function () {
            // if (self.hasHuodongClothes().length != 0) {
            //     Prompt.showPrompt(self.stage, "所选衣饰中包含非卖品!");
            //     //送回非卖品
            //     var arr = self.hasHuodongClothes();
            //     var len = arr.length;
            //     for (var i = 0; i < len; i++) {
            //         var id = arr[i];
            //         var data = {};
            //         if (Math.floor(id / 10000) != 7) {
            //             data = {
            //                 "id": parseInt(Math.floor(id / 10000) + "0000"),
            //                 "sub_part": Math.floor(id / 10000).toString()
            //             };
            //             ClothesData.ondressCache[data["sub_part"]] = data["id"];
            //             EventMgr.inst.dispatchEventWith(CustomEvents.ChangeClothes, false, data);
            //         } else {
            //             data = {
            //                 "id": 70000,
            //                 "sub_part": ClothesData.clothesTemplateData("7", id.toString())["sub_part"]
            //             };
            //             ClothesData.ornamentsCache[data["sub_part"]] = data["id"];
            //             EventMgr.inst.dispatchEventWith(CustomEvents.ChangeClothes, false, data);
            //         }

            //         var selectedArr = self.iconList.selectedIndices;
            //         var len2 = selectedArr.length;
            //         for (var j = len2 - 1; j >= 0; j--) {
            //             if (self.iconList.dataProvider["source"][selectedArr[j]]["id"] == id.toString()) {
            //                 selectedArr.splice(j, 1);
            //                 self.iconList.selectedIndices = selectedArr;
            //             }
            //         }
            //     }

            //     return;
            // }
            SoundManager.instance().buttonSound();
            NetLoading.showLoading();
            var request: egret.URLRequest;
            if (true === self.isTaskIn && self.taskID == "pk") {
                request = HttpProtocolMgr.save_competition_dress_405(ClothesData.ondressCache, ClothesData.ornamentsCache);
            } else {
                request = HttpProtocolMgr.new_save_dressed_403(ClothesData.ondressCache, ClothesData.ornamentsCache);
            }

            HttpMgr.postRequest(request);
        });
    }

    private onSave() {
        var self = this;
        DisplayMgr.buttonScale(this.btn_save, function () {
            // if (self.hasHuodongClothes().length != 0) {
            //     Prompt.showPrompt(self.stage, "所选衣饰中包含非卖品!");
            //     //送回非卖品
            //     var arr = self.hasHuodongClothes();
            //     var len = arr.length;
            //     for (var i = 0; i < len; i++) {
            //         var id = arr[i];
            //         var data = {};
            //         if (Math.floor(id / 10000) != 7) {
            //             data = {
            //                 "id": parseInt(Math.floor(id / 10000) + "0000"),
            //                 "sub_part": Math.floor(id / 10000).toString()
            //             };
            //             ClothesData.ondressCache[data["sub_part"]] = data["id"];
            //             EventMgr.inst.dispatchEventWith(CustomEvents.ChangeClothes, false, data);
            //         } else {
            //             data = {
            //                 "id": 70000,
            //                 "sub_part": ClothesData.clothesTemplateData("7", id.toString())["sub_part"]
            //             };
            //             ClothesData.ornamentsCache[data["sub_part"]] = data["id"];
            //             EventMgr.inst.dispatchEventWith(CustomEvents.ChangeClothes, false, data);
            //         }

            //         var selectedArr = self.iconList.selectedIndices;
            //         var len2 = selectedArr.length;
            //         for (var j = len2 - 1; j >= 0; j--) {
            //             if (self.iconList.dataProvider["source"][selectedArr[j]]["id"] == id.toString()) {
            //                 selectedArr.splice(j, 1);
            //                 self.iconList.selectedIndices = selectedArr;
            //             }
            //         }
            //     }

            //     return;
            // }
            SoundManager.instance().buttonSound();
            NetLoading.showLoading();
            var request: egret.URLRequest;
            if (true === self.isTaskIn && self.taskID == "pk") {
                request = HttpProtocolMgr.save_competition_dress_405(ClothesData.ondressCache, ClothesData.ornamentsCache);
            } else {
                request = HttpProtocolMgr.new_save_dressed_403(ClothesData.ondressCache, ClothesData.ornamentsCache);
            }

            HttpMgr.postRequest(request);
        });
    }

    private hasHuodongClothes(): number[] {
        var result: number[] = [];
        for (var i in ClothesData.ondressCache) {
            if (ClothesData.ondressCache[i] % 10000 != 0) {
                if (!ClothesData.hasOwnedClohtes(ClothesData.ondressCache[i])) {
                    if (ClothesData.clothesTemplateData(i, ClothesData.ondressCache[i].toString())["type"] == 10) {
                        result.push(ClothesData.ondressCache[i]);
                        // return true;
                    }
                }
            }
        }

        for (var j in ClothesData.ornamentsCache) {
            if (ClothesData.ornamentsCache[j] % 10000 != 0) {
                if (!ClothesData.hasOwnedClohtes(ClothesData.ornamentsCache[j])) {
                    if (ClothesData.clothesTemplateData(j, ClothesData.ornamentsCache[j].toString())["type"] == 10) {
                        result.push(ClothesData.ornamentsCache[j]);
                        // return true;
                    }
                }

            }
        }

        return result;
    }

    private isPhaseRight() {
        for (var i in ClothesData.ondressCache) {
            if (ClothesData.ondressCache[i] % 10000 != 0) {
                if (ClothesData.clothesTemplateData(i, ClothesData.ondressCache[i].toString())["phase"] > PlayerData.phase) {
                    return false;
                }
            }
        }

        for (var j in ClothesData.ornamentsCache) {
            if (ClothesData.ornamentsCache[j] % 10000 != 0) {
                if (ClothesData.clothesTemplateData(j, ClothesData.ornamentsCache[j].toString())["phase"] > PlayerData.phase) {
                    return false;
                }
            }
        }

        return true;
    }

    private onShop() {
        var self = this;
        DisplayMgr.buttonScale(this.btn_shop, function () {
            SoundManager.instance().buttonSound();
            if (self.isTaskIn) {
                SceneMgr.gotoShopScene(self.taskID, self.tag1, self.tag2, self.tag3);
            } else {
                SceneMgr.gotoShopScene();
            }
        });
    }

    private after_save_dress_403() {
        if (true === this.isTaskIn && this.taskID != "pk") {

            if (ClothesData.ondressCache["6"] == 60000) {
                NetLoading.removeLoading();
                CustomEventMgr.dispatchEventWith("Update Player Info", false);
                Prompt.showPrompt(this.stage, "鞋子都不穿,就不怕扎脚么....");
            } else if (ClothesData.ondressCache["3"] == 30000) {
                NetLoading.removeLoading();
                CustomEventMgr.dispatchEventWith("Update Player Info", false);
                Prompt.showPrompt(this.stage, "好像忘记穿上衣了吧.老大");
            } else if (ClothesData.clothesTemplateData("3", ClothesData.ondressCache["3"].toString())["sub_part"] != "1" && ClothesData.ondressCache["4"] == 40000) {
                NetLoading.removeLoading();
                CustomEventMgr.dispatchEventWith("Update Player Info", false);
                Prompt.showPrompt(this.stage, "喂喂喂~!你是不是忘记穿裤子了");
            } else {
                if(this.taskID == "1" && ClientMapData.taskGuide && TaskData.userData()["1"] == null) {
                    var request = HttpProtocolMgr.update_clientmap_172("set", "taskGuide", 2);
                    HttpMgr.postRequest(request);
                }else if(this.taskID == "2" && ClientMapData.taskGuide && TaskData.userData()["2"] == null) {
                    var request = HttpProtocolMgr.update_clientmap_172("set", "taskGuide", 3);
                    HttpMgr.postRequest(request);
                }else if(this.taskID == "3" && ClientMapData.taskGuide && TaskData.userData()["3"] == null) {
                    var request = HttpProtocolMgr.update_clientmap_172("set", "taskGuide", 4);
                    HttpMgr.postRequest(request);
                }else if(this.taskID == "4" && ClientMapData.taskGuide && TaskData.userData()["4"] == null) {
                    var request = HttpProtocolMgr.update_clientmap_172("set", "taskGuide", 0);
                    HttpMgr.postRequest(request);
                }else {
                    var request: egret.URLRequest = HttpProtocolMgr.commit_mission_603(this.taskID);
                    HttpMgr.postRequest(request);
                }
            }
        }
        else {
            NetLoading.removeLoading();

            CustomEventMgr.dispatchEventWith("Update Player Info", false);
            Prompt.showPrompt(this.stage, "操作成功~!");

            if (true === this.isTaskIn && this.taskID == "pk") {
                SceneMgr.gotoPK();
            }

            // this.taskFlag += parseInt(this.total_gold.text);

            if (TaskData.gameTask) {
                if (this.taskFlag == 0) {
                    TaskData.taskFlag6 = 0;
                } else if (this.taskFlag > 0 && this.taskFlag < 50) {
                    TaskData.taskFlag6 = 1;
                } else if (this.taskFlag >= 50 && this.taskFlag < 100) {
                    TaskData.taskFlag6 = 2;
                } else if (this.taskFlag >= 100 && this.taskFlag < 150) {
                    TaskData.taskFlag6 = 3;
                } else if (this.taskFlag >= 150 && this.taskFlag < 200) {
                    TaskData.taskFlag6 = 4;
                } else if (this.taskFlag >= 300) {
                    TaskData.taskFlag6 = 5;
                }

                NetLoading.showLoading();
                var request = HttpProtocolMgr.commit_extra_mission_605(TaskData.taskTempID, 3, TaskData.taskFlag6);
                HttpMgr.postRequest(request);
            }
        }
    }

    private updateItemView() {
        var len = this.iconList.selectedIndices.length;
        for (var i = 0; i < len; i++) {
            var item = this.iconList.getElementAt(this.iconList.selectedIndices[i]);
            if (item) {
                item["cost_bg"].visible = false;
                item["costImage"].visible = false;
                item["label_cost"].visible = false;
            }
        }
    }

    private guide_step_2_15() {
        var event = new eui.ItemTapEvent(eui.ItemTapEvent.ITEM_TAP, false, false, null);
        event.item = this.iconList.dataProvider["source"][0];
        event.itemIndex = 0;
        this.onSelected(event);
        this.selectedIndex = 0;
    }

    private guide_step_2_16() {
        this.icon_def.currentState = "up";
        this.icon_def.enabled = true;
        var target: eui.Button = this.icon_xiezi;
        target.currentState = "disabled";
        target.enabled = false;

        var clothesData: {}[];

        this.icon_def = target;

        this.curPart = "6";

        clothesData = ClothesData.ownedClothesTemplatesOfPart(this.curPart);

        this.iconList.dataProvider = new eui.ArrayCollection(clothesData);
        this.iconList.dataProviderRefreshed();
        this.iconList.selectedIndices = [];
    }

    private guide_step_2_19() {
        this.icon_def.currentState = "up";
        this.icon_def.enabled = true;
        var target: eui.Button = this.icon_shipin;
        target.currentState = "disabled";
        target.enabled = false;

        var clothesData: {}[];

        this.icon_def = target;

        this.curPart = "7";

        clothesData = ClothesData.ownedClothesTemplatesOfPart(this.curPart);

        this.iconList.dataProvider = new eui.ArrayCollection(clothesData);
        this.iconList.dataProviderRefreshed();
        this.iconList.selectedIndices = [];
    }

    private guide_step_2_20() {
        var event = new eui.ItemTapEvent(eui.ItemTapEvent.ITEM_TAP, false, false, null);
        event.item = this.iconList.dataProvider["source"][0];
        // event.itemIndex = 1;
        this.onSelected(event);
        this.iconList.selectedIndices.push(0);
    }

    private guide_step_2_21() {
        var event = new eui.ItemTapEvent(eui.ItemTapEvent.ITEM_TAP, false, false, null);
        event.item = this.iconList.dataProvider["source"][1];
        // event.itemIndex = 1;
        this.onSelected(event);
        this.iconList.selectedIndices.push(1);
    }

    private guide_step_2_22() {
        var event = new eui.ItemTapEvent(eui.ItemTapEvent.ITEM_TAP, false, false, null);
        event.item = this.iconList.dataProvider["source"][2];
        // event.itemIndex = 1;
        this.onSelected(event);
        this.iconList.selectedIndices.push(2);
    }
}

class ClothesIconItemSkin extends eui.ItemRenderer {
    private iconBg: eui.Image;
    private iconImage: eui.Image;
    private label_1: eui.Image;
    private label_2: eui.Image;
    private label_3: eui.Image;
    private label_4: eui.Image;
    public cost_bg: eui.Image;
    private costImage: eui.Image;
    private label_cost: eui.Label;
    private label_name: eui.Label;
    public flagImage: eui.Image;
    private lockImage: eui.Image;
    private label_tip: eui.Label;

    public constructor() {
        super();

        this.skinName = "ClothesItemRendererSkin";
    }

    protected createChildren(): void {
        super.createChildren();
        this.touchEnabled = true;
    }

    protected dataChanged() {
        // this.flagImage.visible = false;

        this.iconBg.source = "shopUI_json.shop_item_bg_" + this.data.part;

        this.iconImage.source = "icon" + this.data.id + "_png";
        if (this.data.tag1 == "0" || this.data.tag1 == "") {
            this.label_1.source = "";
        } else {
            this.label_1.source = "tag_" + this.data.tag1;
        }
        if (this.data.tag2 == "0" || this.data.tag2 == "") {
            this.label_2.source = "";
        } else {
            this.label_2.source = "tag_" + this.data.tag2;
        }
        if (this.data.tag3 == "0" || this.data.tag3 == "") {
            this.label_3.source = "";
        } else {
            this.label_3.source = "tag_" + this.data.tag3;
        }
        if (this.data.tag4 == "0" || this.data.tag4 == "") {
            this.label_4.source = "";
        } else {
            this.label_4.source = "tag_" + this.data.tag4;
        }
    }
}
