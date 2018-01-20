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


    public static config_UUID() {
        this.init();
    }

    public static configKuaikanUUID() {
        this._uuid = window["UUID"];
    }

    public static configWanbaUUID(data: {}) {
        this._uuid = data["uid"];
        this._userip = data["userip"];
        this._friend_list = data["friend_list"];
        this._figureurl = data["figureurl"];
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

    public static get playerFigureurl(): string {
        return this._figureurl;
    }

    public static get friend_list(): string[] {
        return this._friend_list;
    }

    public static get userip(): string {
        return this._userip;
    }

    // Inner --------------------------------------------------
    private static _uuid: string = "";
    private static _gameAddr: string = "";
    private static _sid: string = "";
    private static _skey: string = "";
    private static _userip: string = "";
    private static _friend_list: string[] = [];
    private static _figureurl: string = "";
}