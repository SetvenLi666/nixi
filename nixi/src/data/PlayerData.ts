class PlayerData {
    // Export --------------------------------------------------
    public static phaseRating(phase: number): number {
        var rtn: number = 0;
        var strPhase: string = phase.toString();
        if (this._ratings.hasOwnProperty(strPhase)) {
            rtn = this._ratings[strPhase];
        }
        return rtn;
    }
    public static totalRatings(): number {
        var rtn: number = 0;
        for (var key in this._ratings) {
            if (this._ratings.hasOwnProperty(key)) {
                rtn += this._ratings[key];
            }
        }
        return rtn;
    }
    public static get energy(): number { return this._energy; }
    public static get coin(): number { return this._coin; }
    public static get diam(): number { return this._diam; }
    public static get heart(): number { return this._heart; }
    public static get mission(): number { return this._mission; }
    public static get phase(): number { return this._phase; }
    public static get left(): number { return this._left; }
    public static get guide(): number { return this._guide; }

    public static get pkGuide(): number { return this._pkGuide; }


    public static set energy(num: number) {
        this._energy = num;
    }

    public static set left(left: number) {
        this._left = left;
    }

    public static set guide(guide: number) {
        this._guide = guide;
    }

    public static set pkGuide(value: number) {
        this._pkGuide = value;
    }


    // Event & Callback --------------------------------------------------
    public static update(obj: Object) {
        if (obj) {
            this._update = obj["update"];
            this._energy = obj["energy"];
            this._coin = obj["coin"];
            this._diam = obj["diam"];

            if(obj["heart"]) {
                this._heart = obj["heart"];
            }

            this._mission = obj["mission"] > 200 ? 200 : obj["mission"];
            this._phase = obj["phase"] > 5 ? 5 : obj["phase"];
            this._left = obj["left"];
            // this._guide = obj["guide"];
            this._guide = 0;
            this._ratings = obj["rating"];
        }
    }

    // Inner --------------------------------------------------
    private static _update: number = 0;
    private static _energy: number = 0;
    private static _coin: number = 0;
    private static _diam: number = 0;
    private static _heart: number = 0;
    private static _mission: number = 0;
    private static _phase: number = 0;
    private static _left: number = 0;
    private static _guide: number = 0;
    private static _ratings: {} = 0;

    private static _pkGuide: number = 0;      //pk引导  0=无引导1=引导中
}