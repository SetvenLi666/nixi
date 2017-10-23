class NewsData {
    // Export --------------------------------------------------
    public static get otherday(): number { return this._otherday; }
    public static get coin(): number { return this._coin; }
    public static get energy1(): number { return this._energy1; }
    public static get energy2(): number { return this._energy2; }
    public static get mail(): number { return this._mail; }
    public static get message(): number { return this._message; }
    public static get paper(): number { return this._paper; }
    public static get purchaseAchievement(): number { return this._purchaseAchievement; }
    public static get signin7(): number { return this._signin7; }
    public static get signin30(): number { return this._signin30; }
    public static get dailyShareCount(): number { return this._dailyShareCount; }
    public static get dailySignin(): number {return this._dailySignin; }

    // Event & Callback --------------------------------------------------
    public static update(obj: Object) {
        console.log("NewsData::update()");
        this._otherday = obj["O"];
        this._coin = obj["C"];
        this._energy1 = obj["EL1"];
        this._energy2 = obj["EL2"];
        this._mail = obj["I"];
        this._message = obj["M"];
        this._paper = obj["P"];
        this._purchaseAchievement = obj["PA"];
        this._signin7 = obj["S7"];
        this._signin30 = obj["S30"];
        this._dailyShareCount = obj["SC"];
        this._dailySignin = obj["DS"];
    }

    // Inner --------------------------------------------------
    private static _otherday: number = 0;
    private static _coin: number = 0;
    private static _energy1: number = 0;
    private static _energy2: number = 0;
    private static _mail: number = 0;
    private static _message: number = 0;
    private static _paper: number = 0;
    private static _purchaseAchievement: number = 0;
    private static _signin7: number = 0;
    private static _signin30: number = 0;
    private static _dailyShareCount: number = 0;
    private static _dailySignin: number = 0;
}