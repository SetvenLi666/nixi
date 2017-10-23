class LoginData {
    // Export --------------------------------------------------
    public static get uuid(): string { return this._uuid; }
    public static get gameAddr(): string { return this._gameAddr; }
    public static get sid(): string { return this._sid; }
    public static get skey(): string { return this._skey; }

    // Event & Callback --------------------------------------------------
    public static init() {
        // var uuid = egret.localStorage.getItem("UUID");
        var uuid = egret.localStorage.getItem("UUID");
        console.log("UUID1: " + uuid);
        if (null === uuid) {
            uuid = CommonFunc.Guid();
        }

        this._uuid = uuid;
        console.log("UUID2: " + uuid);
    }

    public static configEgretUUID(uuid: string) {
        this._uuid = uuid;
    }

    public static config_UUID() {
        this.init();
    }

    public static configWanbaUUID(data: {}) {
        this._uuid = data["uid"];
    }

    public static update(obj: Object) {
        console.log("LoginData::update()");
        // {"skey":"e09dd0a43d15b9b3e8fbf248cb3462fb","sid":"8A79B644",
        // "main":{"recommend":1,"guide":1,"formal":1},"addr":"http://115.28.179.17:9123/game"}
        this._gameAddr = obj["addr"];
        this._sid = obj["sid"];
        this._skey = obj["skey"];

        egret.localStorage.setItem("UUID", this._uuid);
    }

    // Inner --------------------------------------------------
    private static _uuid: string = "";
    private static _gameAddr: string = "";
    private static _sid: string = "";
    private static _skey: string = "";
}