namespace ConstData {
    export const Conf = {
        // 通用遮罩宽度
        get MaskWidth(): number { return 852; },
        // 通用遮罩高度
        get MaskHeight(): number { return 1136; },
        // 剧情人物动作持续时长
        get StoryActorDuration(): number { return 600; },
        // 通用遮罩高度
        get StoryTextFlashInterval(): number { return 30; },  //100 ----> 30;

        //玩吧地址
        // get LoginAddr(): string { return "https://nixi-wanba-game.mzplay1.cn:9765/account";},

        get WanbaLoginAddr(): string { return "https://nixi-wanba-game.mzplay1.cn:9765/h5wanba/login"}, //玩吧登陆地址

        // get WanbaOrderAddr(): string {return "https://nixi-wanba-game.mzplay1.cn:9765/h5wanba/order"},  //玩吧订单请求地址

        get webSocketAdd() : string { return "wss://nixi-wanba-game.mzplay1.cn:20168/chator"},

        // get channel() : number { return 0;},   //白包

        //测试服地址
        get LoginAddr(): string { return "https://nixi-debug-game.mzplay1.cn:9765/account";},
        get WanbaOrderAddr(): string {return "https://nixi-debug-game.mzplay1.cn:9765/h5wanba/order"}, 

        get channel() : number { return 601;},   //逆袭玩吧

        get version() : string { return "version-20170322"; },      //版本     

        get whiteList() : string[] {return ["8A79B852", "8A79B69C", "8A79B656"]; },
    }

    // export const CustomEvtName = {
    //     StoryReturnChoose: "ASK_RETURN_TO_CHOOSE",
    //     StoryStart: "ON_START_STORY",
    //     StoryShowEnding: "ON_SHOW_ENDING",
    //     StoryFinish: "ON_STORY_FINISH",

    //     StoryActChoose: "ON_CHOOSED",
    //     StoryActHistory: "ON_HISTORY",
    // }

    export const enum StoryState {
        None = 0,
        ShowChapter,
        ShowAct,
        ShowEnding,
        Finished
    }

    export const enum StoryPlayMode {
        Normal = 1,
        AutoPlay,
        FastFarward
    }

    export const enum StoryPlayPhase {
        Playing = 1,
        Idle,
        End,
        ShowEnding,
    }
}

