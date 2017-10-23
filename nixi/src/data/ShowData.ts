class ShowData {
    // Export --------------------------------------------------
    public static get nickname(): string { return this._nickname; }
    public static get id(): number { return this._id; }
    public static get collected(): number { return this._collected; }
    public static get ranking(): number { return this._ranking; }
    public static get reset(): number { return this._reset; }
    public static get dresses(): Object { return this._dresses; }
    public static get ornaments(): Object { return this._ornaments; }


    // Event & Callback --------------------------------------------------
    public static update(obj: Object) {
        if(obj == null) {
            return;
        }
        

        this._nickname = obj["nickname"];
        this._id = obj["id"];
        this._collected = obj["collected"];
        this._ranking = obj["ranking"];
        this._reset = obj["reset"];
        this._dresses = obj["ondress"];
        this._ornaments = obj["ornaments"];
    }

    // Inner --------------------------------------------------
    private static _nickname: string = null;
    private static _id: number = 0;
    private static _collected: number = 0;
    private static _ranking: number = 0;
    private static _reset: number = 0;
    private static _dresses: Object = null;
    private static _ornaments: Object = null;
}