class PurchaseData {
    // Export --------------------------------------------------
    static get coin_limit(): number { return this._coin_limit; }
    static get coin_times(): number { return this._coin_times; }
    static get coin_cost(): number { return this._coin_cost; }
    static get coin_gain(): number { return this._coin_gain; }
    static get energy_limit(): number { return this._energy_limit; }
    static get energy_times(): number { return this._energy_times; }
    static get energy_cost(): number { return this._energy_cost; }
    static get energy_gain(): number { return this._energy_gain;}

    static get productsArr(): {} { return this._productArr;}
    static get deals(): {} { return this._deals;}

    static get MonthCards(): {} { return this._cards;}

    // Event & Callback --------------------------------------------------
    static update(obj: Object) {
        console.log("PurchaseData::update()");

        this._coin_limit = obj["ce_limit"];
        this._coin_times = obj["ce_times"];
        this._coin_cost = obj["coin_cost"];
        this._coin_gain = obj["coin_gain"];
        this._energy_limit = obj["eb_limit"];
        this._energy_times = obj["eb_times"];
        this._energy_cost = obj["energy_cost"];
        this._energy_gain = obj["energy_gain"];

        this._deals = obj["deals"];

        if(obj["cards"]) {
            this._cards = obj["cards"]["2"];
        }
    }

    static init_products(obj: {}) {
        console.log("init products");
        // this._productArr = [];
        // for(var i in obj) {
        //     this._productArr.push(obj[i]);
        // }
        if(obj) {
            this._productArr = obj;
        }
    }

    // Inner --------------------------------------------------
    static _coin_limit: number = 0;
    static _coin_times: number = 0;
    static _coin_cost: number = 0;
    static _coin_gain: number = 0;
    static _energy_limit: number = 0;
    static _energy_times: number = 0;
    static _energy_cost: number = 0;
    static _energy_gain: number = 0;

    static _productArr: {} = null;
    static _deals: {} = {};

    static _cards: {} = {};                 //月卡
}