class ShopLayer extends eui.Component {
    private taskid: string = null;
    private tag1: string = null;
    private tag2: string = null;
    private tag3: string = null;

    public group1: eui.Group;
    public group2: eui.Group;

    public btn_back: eui.Image;
    public btn_yichu: eui.Image;

    public tag_1: eui.Image;
    public tag_2: eui.Image;
    public tag_3: eui.Image;
    public clothes_des: eui.Label;
    public btn_shangyi: eui.Button;
    public btn_kuzi: eui.Button;
    public btn_waitao: eui.Button;
    public btn_xiezi: eui.Button;
    public btn_texiao: eui.Button;
    public btn_toufa: eui.Button;
    public btn_shipin: eui.Button;
    public btn_zhuangrong: eui.Button;

    public btn_all: eui.Button;
    public btn_coin: eui.Button;
    public btn_diam: eui.Button;
    public btn_xiyou: eui.Button;
    public btn_buy: eui.Image;

    public scroller: eui.Scroller;
    public iconList: eui.List;
    public arrColl: eui.ArrayCollection;

    public nameComp: eui.Component;
    public buyGroup: eui.Group;
    public imgRare: eui.Image;
    public img_tip: eui.Image;

    public curIcon: eui.Image;

    public curPrice: eui.Label;
    public curPriceType: eui.Image;

    private curShowId: number;

    private icon_def: eui.Button;
    private icon_def2: eui.Button;

    private curPart: string;
    private curIndex: number = -1;
    private curItem: {} = null;

    private tipComp: TaskTipComp;
    private isFilter: boolean = false;


    public constructor(taskid: string, tag1: string, tag2: string, tag3: string) {
        super();

        this.skinName = "ShopLayerSkin";
        this.taskid = taskid;
        this.tag1 = tag1;
        this.tag2 = tag2;
        this.tag3 = tag3;

        this.icon_def = this.btn_shangyi;
        this.icon_def2 = this.btn_all;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
    }

    private addStage() {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addStage, this);

        this.group1.width = DisplayMgr.stageW;
        this.group2.width = Math.min(DisplayMgr.stageW, 852);


        this.icon_def.currentState = "disabled";
        this.icon_def.enabled = false;
        this.icon_def2.currentState = "disabled";
        this.icon_def2.enabled = false;

        var text_all = <eui.Label>this.btn_all.labelDisplay;
        text_all.size = 24;
        text_all.textColor = 0x623544;

        this.curPart = "3";
        var clothesData = ClothesData.displayNotOwnTemplatesOfPart(this.curPart);
        this.arrColl = new eui.ArrayCollection(clothesData);
        // this.iconList.dataProvider = new eui.ArrayCollection(clothesData);
        this.iconList.dataProvider = this.arrColl;
        this.iconList.itemRenderer = ShopItemRenderer;
        this.iconList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelected, this);
        this.iconList.selectedIndex = 0;
        this.curIndex = this.iconList.selectedIndex;
        this.curItem = clothesData[0];
        this.updateItemInfo(clothesData[0]);

        if (this.taskid) {
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

        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBack, this);
        this.btn_yichu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onYichu, this);

        this.btn_toufa.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.btn_waitao.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.btn_shangyi.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.btn_kuzi.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.btn_xiezi.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.btn_texiao.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.btn_shipin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.btn_zhuangrong.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);

        this.btn_all.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle2, this);
        this.btn_coin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle2, this);
        this.btn_diam.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle2, this);
        this.btn_xiyou.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle2, this);

        this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);

        CustomEventMgr.addEventListener("403", this.after_save_dress_403, this);
        CustomEventMgr.addEventListener("405", this.after_save_dress_403, this);

        if(PlayerData.guide == 3) {
            CustomEventMgr.addEventListener("Guide_Step_2_7", this.onFilter, this);
            CustomEventMgr.addEventListener("Guide_Step_2_9", this.onBuy, this);
            CustomEventMgr.addEventListener("Guide_Step_2_10", this.guide_step_2_10, this);
            CustomEventMgr.addEventListener("Guide_Step_2_25", this.guide_step_2_25, this);
            CustomEventMgr.addEventListener("Guide_Step_2_13", this.onBack, this);
        }
    }

    private onExit() {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
        CustomEventMgr.removeEventListener("403", this.after_save_dress_403, this);
        CustomEventMgr.removeEventListener("405", this.after_save_dress_403, this);

        if(PlayerData.guide == 3) {
            CustomEventMgr.removeEventListener("Guide_Step_2_7", this.onFilter, this);
            CustomEventMgr.removeEventListener("Guide_Step_2_9", this.onBuy, this);
            CustomEventMgr.removeEventListener("Guide_Step_2_10", this.guide_step_2_10, this);
            CustomEventMgr.removeEventListener("Guide_Step_2_25", this.guide_step_2_25, this);
            CustomEventMgr.removeEventListener("Guide_Step_2_13", this.onBack, this);
        }

        this.iconList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelected, this);

        this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBack, this);
        this.btn_yichu.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onYichu, this);

        this.btn_toufa.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.btn_waitao.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.btn_shangyi.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.btn_kuzi.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.btn_xiezi.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.btn_texiao.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.btn_shipin.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);
        this.btn_zhuangrong.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle, this);

        this.btn_all.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle2, this);
        this.btn_coin.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle2, this);
        this.btn_diam.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle2, this);
        this.btn_xiyou.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandle2, this);

        this.btn_buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.tipComp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onFilter, this);
    }

    private onFilter() {
        if (!this.isFilter) {
            this.isFilter = true;
            this.tipComp.filterImage.visible = false;
            this.tipComp.filteredImage.visible = true;
            if (this.curPart == "1" || this.curPart == "9") {
                this.arrColl.source = ClothesData.notOwnTypeClothesOfPart(this.curPart);
                this.arrColl.refresh();
                // this.iconList.dataProvider = new eui.ArrayCollection(ClothesData.notOwnTypeClothesOfPart(this.curPart));
            } else {
                this.arrColl.source = ClothesData.allNotOwnClothesByLabel(this.curPart, this.tag1, this.tag2, this.tag3);
                this.arrColl.refresh();
                // this.iconList.dataProvider = new eui.ArrayCollection(ClothesData.allNotOwnClothesByLabel(this.curPart, this.tag1, this.tag2, this.tag3));
            }

        } else {
            this.isFilter = false;
            this.tipComp.filterImage.visible = true;
            this.tipComp.filteredImage.visible = false;
            this.arrColl.source = ClothesData.notOwnTypeClothesOfPart(this.curPart);
            this.arrColl.refresh();
            // this.iconList.dataProvider = new eui.ArrayCollection(ClothesData.notOwnTypeClothesOfPart(this.curPart));
            // this.iconList.dataProviderRefreshed();
        }
        // this.iconList.selectedIndices = this.currentListSelectedIndex(this.curPart);
        // this.updateItemInfo(this.iconList.dataProvider["source"][0]);
        this.iconList.selectedIndex = 0;
        this.curItem = this.iconList.selectedItem;
        this.updateItemInfo(this.curItem);
    }

    private onSelected(e: eui.ItemTapEvent) {
        console.log(e.item.index);
        console.log(e.item.id);
        this.curItem = e.item;
        this.updateItemInfo(e.item);
    }

    private updateItemInfo(item: {}) {
        if (item == null) {
            return;
        }

        this.curIcon.source = "show" + item["id"] + "_png";
        if (item["part"] == "2" || item["part"] == "3" || item["part"] == 4) {
            this.curIcon.horizontalCenter = 0;
        } else if(item["part"] == "6"){
            this.curIcon.horizontalCenter = 35;
        }else {
            this.curIcon.horizontalCenter = -100;
        }

        //衣服星级名称
        this.nameComp["clothes_name"].text = item["name"];
        this.nameComp.currentState = "state_" + item["phase"];

        this.clothes_des.text = item["label"];
        if (item["tag1"] == "0" || item["tag1"] == "") {
            this.tag_1.source = "";
        } else {
            this.tag_1.source = "clothes_tags_b_json.tag_b_" + item["tag1"];
        }
        if (item["tag2"] == "0" || item["tag1"] == "") {
            this.tag_2.source = "";
        } else {
            this.tag_2.source = "clothes_tags_b_json.tag_b_" + item["tag2"];
        }
        if (item["tag3"] == "0" || item["tag3"] == "") {
            this.tag_3.source = "";
        } else {
            this.tag_3.source = "clothes_tags_b_json.tag_b_" + item["tag3"];
        }

        this.curPrice.text = item["cost"];

        this.buyGroup.visible = true;
        this.imgRare.visible = false;
        this.img_tip.visible = false;

        if(parseInt(item["phase"]) > PlayerData.phase) {
            this.buyGroup.visible = false;
            this.img_tip.visible = true;
        }else {
            this.img_tip.visible = false;
        }

        if (item["type"] == "1") {
            this.curPriceType.source = "shopUI_json.shop_ui_coin1";
        } else if (item["type"] == "2") {
            this.curPriceType.source = "shopUI_json.shop_ui_diam1";
        } else if (item["type"] == "10") {
            if(parseInt(item["phase"]) > PlayerData.phase) {
                this.buyGroup.visible = false;
                this.img_tip.visible = true;
            }else {
                this.buyGroup.visible = false;
                this.imgRare.visible = true;
            }
        }
    }

    private onBuy() {
        var self = this;
        DisplayMgr.buttonScale(this.btn_buy, function () {
            if (!self.curItem) {
                return;
            }

            if(PlayerData.phase < parseInt(self.curItem["phase"])) {
                Prompt.showPrompt(self.stage, "等级不足，无法购买!");
                return;
            }

            if(ClothesData.clothesParts.indexOf(self.curItem["part"]) == -1) {
                Prompt.showPrompt(self.stage, "部位异常，无法购买!");
                return;
            }else if(self.curItem["part"] == "7" && ClothesData.clothesSub_parts.indexOf(self.curItem["sub_part"]) == -1) {
                Prompt.showPrompt(self.stage, "部位异常，无法购买!");
                return;
            }

            var id = self.curItem["id"];
            var ondress = CommonFunc.simpleCloneObj(ClothesData.ondressCache);
            var ornaments = CommonFunc.simpleCloneObj(ClothesData.ornamentsCache);
            if(self.curItem["part"] != "7") {
                ondress[self.curItem["part"]] = parseInt(id);
            }else {
                ornaments[self.curItem["sub_part"]] = parseInt(id);
            }   

            NetLoading.showLoading();
            var request: egret.URLRequest;
            request = HttpProtocolMgr.new_save_dressed_403(ondress, ornaments);

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

    private after_save_dress_403() {
        NetLoading.removeLoading();

        CustomEventMgr.dispatchEventWith("Update Player Info", false);

        this.arrColl.source.splice(this.iconList.selectedIndex, 1);
        this.arrColl.refresh();
        this.iconList.selectedIndex = 0;
        this.curItem = this.iconList.selectedItem;
        this.updateItemInfo(this.iconList.selectedItem);

        if(PlayerData.guide == 2) {
            PlayerData.guide = 3;
        }

        Prompt.showPrompt(this.stage, "购买成功~!");
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

        // this.total_coin.text = totalCoin.toString();
        // this.total_gold.text = totalGold.toString();
        // this.total_debris.text = totalDebris.toString();
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

    private touchHandle(evt: egret.TouchEvent) {
        this.icon_def.currentState = "up";
        this.icon_def.enabled = true;
        var target: eui.Button = evt.target;

        if(target == this.btn_zhuangrong) {
            Prompt.showPrompt(this.stage, "暂未开启");
            return;
        }
        
        target.currentState = "disabled";
        target.enabled = false;

        if (this.icon_def2 != this.btn_all) {
            this.icon_def2.currentState = "up";
            this.icon_def2.enabled = true;
            this.btn_all.currentState = "disabled";
            this.btn_all.enabled = false;

            this.icon_def2 = this.btn_all;
        }

        this.scroller.stopAnimation();

        var clothesData: {}[] = null;

        this.icon_def = target;

        switch (evt.target) {
            case this.btn_toufa:
                this.curPart = "1";
                break;
            case this.btn_waitao:
                this.curPart = "2";
                break;
            case this.btn_shangyi:
                this.curPart = "3";
                break;
            case this.btn_kuzi:
                this.curPart = "4";
                break;
            case this.btn_texiao:
                this.curPart = "5";
                break;
            case this.btn_xiezi:
                this.curPart = "6";
                break;
            case this.btn_shipin:
                this.curPart = "7";
                break;
            case this.btn_zhuangrong:
                this.curPart = "9";
                break;
        }

        if (this.taskid && this.isFilter) {
            if (this.curPart == "1" || this.curPart == "9") {
                clothesData = ClothesData.notOwnTypeClothesOfPart(this.curPart);
            } else {
                clothesData = ClothesData.allNotOwnClothesByLabel(this.curPart, this.tag1, this.tag2, this.tag3);
            }
        } else {
            clothesData = ClothesData.notOwnTypeClothesOfPart(this.curPart);
        }

        this.arrColl.source = clothesData;
        this.arrColl.refresh();

        // this.iconList.dataProvider = new eui.ArrayCollection(clothesData);
        // this.iconList.dataProviderRefreshed();
        this.iconList.selectedIndex = 0;
        this.curItem = this.iconList.selectedItem;
        this.updateItemInfo(this.curItem);
    }

    private touchHandle2(evt: egret.TouchEvent) {
        this.icon_def2.currentState = "up";
        this.icon_def2.enabled = true;
        var target: eui.Button = evt.target;
        target.currentState = "disabled";
        target.enabled = false;
        this.scroller.stopAnimation();

        var clothesData: {}[] = null;

        this.icon_def2 = target;
        var type: string = null;
        switch (target) {
            case this.btn_all:
                if (this.taskid && this.isFilter) {
                    if (this.curPart == "1" || this.curPart == "9") {
                        clothesData = ClothesData.notOwnTypeClothesOfPart(this.curPart);
                    } else {
                        clothesData = ClothesData.allNotOwnClothesByLabel(this.curPart, this.tag1, this.tag2, this.tag3);
                    }
                }else {
                    clothesData = ClothesData.notOwnTypeClothesOfPart(this.curPart);
                }
                
                this.arrColl.source = clothesData;
                this.arrColl.refresh();

                // this.iconList.dataProvider = new eui.ArrayCollection(clothesData);
                // this.iconList.dataProviderRefreshed();
                this.iconList.selectedIndex = 0;
                this.curItem = this.iconList.selectedItem;
                this.updateItemInfo(this.curItem);
                return;
            case this.btn_coin:
                type = "1";
                // clothesData = ClothesData.notOwnTypeClothesOfPart(this.curPart, "1");
                break;
            case this.btn_diam:
                type = "2";
                // clothesData = ClothesData.notOwnTypeClothesOfPart(this.curPart, "2");
                break;
            case this.btn_xiyou:
                type = "10";
                // clothesData = ClothesData.notOwnTypeClothesOfPart(this.curPart, "10");
                break;
        }

        if (this.taskid && this.isFilter) {
            if (this.curPart == "1" || this.curPart == "9") {
                clothesData = ClothesData.notOwnTypeClothesOfPart(this.curPart);
            } else {
                clothesData = ClothesData.allNotOwnTypeClothesByLabel(this.curPart, type, this.tag1, this.tag2, this.tag3);
            }
        } else {
            clothesData = ClothesData.notOwnTypeClothesOfPart(this.curPart, type);
        }

        this.arrColl.source = clothesData;
        this.arrColl.refresh();

        // this.iconList.dataProvider = new eui.ArrayCollection(clothesData);
        // this.iconList.dataProviderRefreshed();
        this.iconList.selectedIndex = 0;
        this.curItem = this.iconList.selectedItem;
        this.updateItemInfo(this.curItem);
    }

    private onBack() {
        var self = this;
        DisplayMgr.buttonScale(this.btn_back, function () {
            if (self.taskid) {
                SceneMgr.gotoDressScene(self.taskid, self.tag1, self.tag2, self.tag3);
            } else {
                SceneMgr.gotoMainScene();
            }
        });
    }

    private onYichu() {
        var self = this;
        DisplayMgr.buttonScale(this.btn_yichu, function () {
            if (self.taskid) {
                SceneMgr.gotoDressScene(self.taskid, self.tag1, self.tag2, self.tag3);
            } else {
                SceneMgr.gotoDressScene(null, null, null, null);
            }
        });
    }

    private guide_step_2_8() {
        var event = new eui.ItemTapEvent(eui.ItemTapEvent.ITEM_TAP, false, false, null);
        event.item = this.iconList.dataProvider["source"][0];
        event.itemIndex = 0;
        this.onSelected(event);
        this.iconList.selectedIndex = 0;
    }

    private guide_step_2_10() {
        this.icon_def.currentState = "up";
        this.icon_def.enabled = true;
        var target: eui.Button = this.btn_xiezi;
        target.currentState = "disabled";
        target.enabled = false;

        this.scroller.stopAnimation();

        var clothesData: {}[] = null;

        this.icon_def = target;
        this.curPart = "6";

        clothesData = ClothesData.allNotOwnClothesByLabel(this.curPart, this.tag1, this.tag2, this.tag3);

        this.arrColl.source = clothesData;
        this.arrColl.refresh();
        // this.iconList.dataProvider = new eui.ArrayCollection(clothesData);
        // this.iconList.dataProviderRefreshed();
        this.iconList.selectedIndex = 0;
        this.curItem = this.iconList.selectedItem;
        this.updateItemInfo(this.curItem);
    }

    private guide_step_2_25() {
        this.icon_def.currentState = "up";
        this.icon_def.enabled = true;
        var target: eui.Button = this.btn_shipin;
        target.currentState = "disabled";
        target.enabled = false;

        this.scroller.stopAnimation();

        var clothesData: {}[] = null;

        this.icon_def = target;
        this.curPart = "7";

        clothesData = ClothesData.allNotOwnClothesByLabel(this.curPart, this.tag1, this.tag2, this.tag3);

        this.arrColl.source = clothesData;
        this.arrColl.refresh();
        // this.iconList.dataProvider = new eui.ArrayCollection(clothesData);
        // this.iconList.dataProviderRefreshed();
        this.iconList.selectedIndex = 0;
        this.curItem = this.iconList.selectedItem;
        this.updateItemInfo(this.curItem);
    }
}


class ShopItemRenderer extends eui.ItemRenderer {
    public item_bg: eui.Image;
    public item_icon: eui.Image;
    public item_selected: eui.Image;

    public price_type: eui.Image;
    public price_lab: eui.Label;
    public cost_bg: eui.Image;
    public item_lock: eui.Image;

    public constructor() {
        super();

        this.skinName = "ShopItemRendererSkin";
    }

    protected createChildren() {
        super.createChildren();
    }

    protected dataChanged() {
        this.item_bg.source = "shopUI_json.shop_item_bg_" + Math.floor(parseInt(this.data.id) / 10000);
        this.item_icon.source = "icon" + this.data.id + "_png";

        this.price_lab.text = this.data["cost"];
        if (this.data["type"] == "1") {
            this.price_type.source = "shopUI_json.shop_ui_coin2";
            this.price_type.visible = true;
            this.price_lab.visible = true;
            this.cost_bg.visible = true;
        } else if (this.data["type"] == "2") {
            this.price_type.source = "shopUI_json.shop_ui_diam2";
            this.price_type.visible = true;
            this.price_lab.visible = true;
            this.cost_bg.visible = true;
        } else if (this.data["type"] == "10") {
            this.price_type.visible = false;
            this.price_lab.visible = false;
            this.cost_bg.visible = false;
        }

        if(parseInt(this.data["phase"]) > PlayerData.phase) {
            this.item_lock.visible = true;
        }else {
            this.item_lock.visible = false;
        }
    }
}