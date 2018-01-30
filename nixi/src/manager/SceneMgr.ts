/**
 *
 * @author 
 *
 */
class SceneMgr {
    // Export --------------------------------------------------
    public static replaceScene(scene: egret.DisplayObject) {
        var stage: egret.Stage = egret.MainContext.instance.stage;
        stage.removeChildren();
        stage.addChild(scene);
    }

    public static addLayer(layer: egret.DisplayObject) {
        var stage: egret.Stage = egret.MainContext.instance.stage;
        if (stage.contains(layer) === false) {
            stage.addChild(layer);
        }
        else {
            console.log("[WARNING] SceneMgr::addLayer() - scene allready in stage!");
        }
    }

    public static gotoLogin() {
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onLogin, this, []);
        resLoading.load(["login"], call);
    }

    private static isDcLoad: boolean = false;

    public static gotoMainScene() {
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onMain, this, []);
        var resArr: string[];
        if (!this.isDcLoad) {
            var dcArr: string[] = [];
            for (var i in ClothesData.ondressCache) {
                if (ClothesData.ondressCache[i] % 10000 != 0) {
                    var item = ClothesData.clothesTemplateData(i, ClothesData.ondressCache[i].toString());
                    if (item["layer1"] != "") {
                        dcArr.push(item["layer1"] + "_png");
                    }
                    if (item["layer2"] != "") {
                        dcArr.push(item["layer2"] + "_png");
                    }
                    if (item["layer3"] != "") {
                        dcArr.push(item["layer3"] + "_png");
                    }
                    if (item["layer4"] != "") {
                        dcArr.push(item["layer4"] + "_png");
                    }
                }
            }
            for (var j in ClothesData.ornamentsCache) {
                if (ClothesData.ornamentsCache[j] % 10000 != 0) {
                    var item = ClothesData.clothesTemplateData(j, ClothesData.ornamentsCache[j].toString());
                    if (item["layer1"] != "") {
                        dcArr.push(item["layer1"] + "_png");
                    }
                    if (item["layer2"] != "") {
                        dcArr.push(item["layer2"] + "_png");
                    }
                    if (item["layer3"] != "") {
                        dcArr.push(item["layer3"] + "_png");
                    }
                    if (item["layer4"] != "") {
                        dcArr.push(item["layer4"] + "_png");
                    }
                }
            }
            if (RES.createGroup("dc", dcArr)) {
                this.isDcLoad = true;
            }
        }

        if (PlayerData.guide == 0) {
            resArr = ["base", "main", "dc"];
        } else {
            resArr = ["base", "main", "dc", "guide"];
        }
        resLoading.mergeLoad(resArr, call);
    }

    public static gotoStoryChapterScene(index?: number) {
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onStoryChapter, this, [index]);
        resLoading.load(["story_chapter"], call);
    }

    public static gotoNewStoryScene(index?: number) {
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onStory, this, [index]);
        resLoading.load(["new_story"], call);
    }

    public static gotoNewStorySelectScene(index?: number) {
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onSelectScene, this, [index]);
        resLoading.load(["story_select"], call);
    }

    public static gotoStoryScene(strIndex: string, chapterFileName: string) {
        var self = this;
        var resLoading: ResLoading = ResLoading.showLoading();
        console.log("start story: - " + chapterFileName);
        var filename: string = `${chapterFileName}_json`;
        RES.getResAsync(filename, function (evt) {
            var call = new CallBackFunc().handler(SceneMgr.onStoryScene, self, [strIndex, evt]);
            var merge = ["story_act"];
            merge.push("story_roles_" + strIndex);
            resLoading.mergeLoad(merge, call);
            // resLoading.load(["story_act"], call);
        }, self);
    }

    public static gotoBranchMainScene(id: number) {
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onBranchStory, this, [id]);
        var merge = ["new_story"];
        merge.push("story_branch_" + id + "_json");
        resLoading.load(merge, call);
    }

    public static gotoBranchStoryScene(strIndex: string, filename: string) {
        var self = this;
        var resLoading: ResLoading = ResLoading.showLoading();
        console.log("start story: - " + filename);
        var filename: string = `${filename}_json`;
        RES.getResAsync(filename, function (evt) {
            var call = new CallBackFunc().handler(SceneMgr.onBranchStoryScene, self, [strIndex, evt]);
            var merge = ["story_act"];
            merge.push("story_roles_" + strIndex);
            resLoading.mergeLoad(merge, call);
        }, self);
    }

    public static gotoDressScene(taskId: string, tag1: string, tag2: string, tag3: string) {
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onDress, this, [taskId, tag1, tag2, tag3]);
        resLoading.load(["dress"], call);
    }

    public static gotoShopScene(taskid?: string, tag1?: string, tag2?: string, tag3?: string) {
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onShop, this, [taskid, tag1, tag2, tag3]);
        resLoading.load(["shop"], call);
    }

    public static gotoTaskScene(phase: number, index: number) {
        console.log("SceneMgr::gotoTaskScene() - phase = " + phase);
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onTask, this, [phase, index]);
        var merge = ["task"];
        merge.push(`mission_${phase}_json`);
        resLoading.mergeLoad(merge, call);
    }

    public static gotoTaskRatingScene(result: {}) {
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onTaskRating, this, [result]);
        resLoading.load(["newTask_rating"], call);
    }

    public static gotoMainFriend() {
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onMainFriend, this, []);
        resLoading.load(["friend"], call);
    }

    public static gotoFriend() {
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onFriend, this, []);
        resLoading.load(["friend_common"], call);
    }

    public static gotoRank() {
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onRank, this, []);
        // resLoading.load(["friend_common"], call);
        resLoading.mergeLoad(["friend_common", "new_rank"], call);
    }

    public static gotoPK() {
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onPK, this, []);
        resLoading.load(["pk"], call);
    }

    public static gotoPkAnimScene() {
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onPkAnimScene, this, []);
        resLoading.load([], call);
    }

    public static gotoStranger() {
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onStranger, this, []);
        resLoading.load(["friend_common"], call);
    }

    public static gotoMessage() {
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onMessage, this, []);
        resLoading.load(["message"], call);
    }

    public static gotoNote() {
        var resLoading: ResLoading = ResLoading.showLoading();
        var call = new CallBackFunc().handler(SceneMgr.onNote, this, []);
        resLoading.load(["message"], call);
    }

    // Inner --------------------------------------------------
    private static onLogin() {
        IllegalWords.illegalWrods(RES.getRes("learn2_json"));
        IllegalWords.illegalWrods_Nonblank(RES.getRes("blanked_json"));

        var scene = new LoginScene();
        SceneMgr.replaceScene(scene);
    }

    private static onMain() {
        var scene = new MainScene();
        SceneMgr.replaceScene(scene);
    }

    private static onStoryChapter(index?: number) {
        var storyTemplate = RES.getRes("story_json");
        var scene = new StoryChapterPageView(storyTemplate, StoryData.completedStory, PlayerData.phase, PlayerData.totalRatings(), index);
        SceneMgr.replaceScene(scene);
    }

    private static onStory(index?: number) {
        if (index) {
            if (index == 1) {
                //支线1--段总裁
                var storyTemplate = RES.getRes("story_role_1_json");
            } else if (index == 2) {

            } else if (index == 3) {

            }
        } else {
            //星途闪耀
            var storyTemplate = RES.getRes("story_json");
        }
        // var storyTemplate = RES.getRes("story_json");
        var scene = new NewStoryScene(storyTemplate, index);
        SceneMgr.replaceScene(scene);
    }

    private static onBranchStory(id: number) {
        var storyTemplate = RES.getRes("story_branch_" + id + "_json");
        var scene = new BranchStoryMainScene(storyTemplate, id);
        SceneMgr.replaceScene(scene);
    }

    private static onSelectScene(index?: number) {
        var scene = new NewStorySelectScene();
        SceneMgr.replaceScene(scene);
    }

    private static onStoryScene(strIndex: string, data) {
        var scene = new StoryScene(strIndex, data);
        SceneMgr.replaceScene(scene);
    }

    private static onBranchStoryScene(strIndex: string, data) {
        var scene = new BranchStoryScene(strIndex, data);
        SceneMgr.replaceScene(scene);
    }

    private static onDress(taskId: string, tag1: string, tag2: string, tag3: string) {
        var scene = new DressScene(taskId, tag1, tag2, tag3);
        SceneMgr.replaceScene(scene);
    }

    private static onShop(taskid?: string, tag1?: string, tag2?: string, tag3?: string) {
        console.log("on shop");
        var scene = new ShopScene(taskid, tag1, tag2, tag3);
        SceneMgr.replaceScene(scene);
    }

    private static onTask(phase: number, index: number) {
        // var scene = new TaskScene(phase);
        // var scene = new NewTaskScene(phase, PlayerData.mission);
        var scene = new NewTaskScene(phase, index);
        SceneMgr.replaceScene(scene);
    }

    private static onTaskRating(result: {}) {
        var scene = new TaskRating(result);
        SceneMgr.replaceScene(scene);
    }

    private static onMainFriend() {
        var scene = new FriendMainScene();
        SceneMgr.replaceScene(scene);
    }

    private static onFriend() {
        var scene = new FriendScene();
        SceneMgr.replaceScene(scene);
    }

    private static onRank() {
        var scene = new RankScene();
        SceneMgr.replaceScene(scene);
    }

    private static onPK() {
        var scene = new PkScene();
        SceneMgr.replaceScene(scene);
    }

    private static onPkAnimScene() {
        var scene = new PkAnimScene();
        SceneMgr.replaceScene(scene);
    }

    private static onStranger() {
        var scene = new StrangerScene();
        SceneMgr.replaceScene(scene);
    }

    private static onMessage() {
        var scene = new MessageScene();
        SceneMgr.replaceScene(scene);
    }

    private static onNote() {
        var scene = new NoteScene();
        SceneMgr.replaceScene(scene);
    }
}
